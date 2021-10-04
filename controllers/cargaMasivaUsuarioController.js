const fs = require('fs')
const ExcelJS = require('exceljs')
const uuidv4 = require('uuid').v4
const bcrypt = require('bcryptjs')
const { 
    Usuario, 
    UsuarioInstitucionRol, 
    CursoUsuarioRol, 
    Configuracion, 
    sequelize } = require('../database/db')
const { sendMail, generaCodigo4Digitos } = require('../helpers')
const { QueryTypes } = require('sequelize')

exports.cargaMasivaUsuarios = async(req, res) => {

    try{

        const { 
            nombre_archivo_carga,
            archivo_base64,
            codigo_rol,
            codigo_institucion,
            codigo_curso
        } = req.body

        
        //verificar que existe la configuracion del asunto y mensaje para enviar la clave al usuario por email
        let asuntoConfig = await Configuracion.findOne({
            where:{
                seccion: 'CREAR_USUARIO',
                clave: 'ASUNTO'
            }
        })

        if(!asuntoConfig){
            reject('seccion CREAR_USUARIO clave ASUNTO no existe en la configuración')    
        }

        let mensajeConfig = await Configuracion.findOne({
            where:{
                seccion: 'CREAR_USUARIO',
                clave: 'MENSAJE'
            }
        })

        if(!mensajeConfig){
            reject('seccion CREAR_USUARIO clave MENSAJE no existe en la configuración')    
        }


        //Directorio temporal donde se guardará el archivo zip con la información de las preguntas a cargar.
        const tmp_dir = process.env.DIR_TEMP;
        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_archivo_carga}`;
        //Guarda el archivo en el directorio temporal.
        await fs.writeFileSync(`${archivo_carga}`, archivo_base64, 'base64')

        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_carga);

        hoja_excel  = libro_excel.getWorksheet('USUARIOS');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja USUARIOS en el archivo excel para procesar y cargar las preguntas, verifique.`,
            });
        }

        //Se ubica en la hoja 
        hoja_excel  = libro_excel.getWorksheet('USUARIOS');
        

        //Carga los registros en la base de datos.
        for(let i = 2; i <= 100; i++){

            let rutUsuario = hoja_excel.getCell(`A${i}`).text;
            //si no hay mas información, detengo
            if(rutUsuario === ''){
                break
            }
            let nombreUsuario = hoja_excel.getCell(`B${i}`).text;
            let emailUsuario = hoja_excel.getCell(`C${i}`).text;
            let telefonoUsuario = hoja_excel.getCell(`D${i}`).text;

            let claveAleatoriaUsuario = generaCodigo4Digitos()
            //genero un hash para el password
            let salt = bcrypt.genSaltSync(10);
            let claveHash = bcrypt.hashSync(claveAleatoriaUsuario.toString(), salt);

            const usuario = await Usuario.findOne({
                where:{
                    rut: rutUsuario
                }
            }) 
            
            if(!usuario){

                await Usuario.create({
                    rut: rutUsuario,
                    clave: claveHash,
                    nombre: nombreUsuario,
                    email: emailUsuario,
                    telefono: telefonoUsuario,
                    imagen: '',
                    avatar_color: 0,
                    avatar_textura: 0,
                    avatar_sombrero: 0,
                    avatar_accesorio: 0,
                })

            }else{

                await Usuario.update({
                    clave: claveHash,
                    nombre: nombreUsuario,
                    email: emailUsuario,
                    telefono: telefonoUsuario,
                },{ 
                    where: {
                        rut: rutUsuario
                    }
                })

            }

            await UsuarioInstitucionRol.destroy({
                where: {
                    rut_usuario: rutUsuario,
                    codigo_institucion: codigo_institucion,
                }
            })

            await UsuarioInstitucionRol.create({
                codigo: uuidv4(),
                rut_usuario: rutUsuario,
                codigo_institucion: codigo_institucion,
                codigo_rol: codigo_rol,
            })

            await sequelize.query(`
                DELETE cur FROM cursos_usuarios_roles cur
                INNER JOIN cursos c ON c.codigo = cur.codigo_curso
                WHERE cur.rut_usuario = '${rutUsuario}' AND c.codigo_institucion = '${codigo_institucion}'
            `, { type: QueryTypes.DELETE })

            
            await CursoUsuarioRol.create({
                codigo_curso: codigo_curso,
                rut_usuario: rutUsuario,
                codigo_rol: codigo_rol
            })

            let emailAsunto = asuntoConfig.valor
            //Muestro la clave aleatoria en el mensaje.
            let emailMensaje = mensajeConfig.valor.replace('${nombre_usuario}', nombreUsuario)
            emailMensaje = emailMensaje.replace('${codigo_usuario}', rutUsuario)
            emailMensaje = emailMensaje.replace('${clave}', claveAleatoriaUsuario)

            //Envia el email al usuario.
            await sendMail(emailUsuario, emailAsunto, '', emailMensaje, []) 
            
        }  

        res.json({
            msg: 'Usuarios cargados correctamente'
        })
        

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}