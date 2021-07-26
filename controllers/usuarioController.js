const { Usuario, sequelize, RingUsuario} = require('../database/db');
const { Op, QueryTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const fsp = require('fs').promises
const ExcelJS = require('exceljs')
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.crearUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { rut, clave, nombre, email, telefono, imagen, inactivo } = req.body;

        //verifica que el usuario no existe.
        let usuario = await Usuario.findByPk(rut);
        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }

        //genero un hash para el password
        let salt = bcrypt.genSaltSync(10);
        let clave_hash = bcrypt.hashSync(clave, salt);

        //Guarda el nuevo usuario
        usuario = await Usuario.create({
            rut,
            clave: clave_hash,
            nombre,
            email,
            telefono,
            imagen,
            inactivo
        });

        //envía la respuesta
        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarUsuarios = async(req, res, next) => {

    try {

        setTimeout(async() => {

            const { filtro } = req.query;

            const usuarios = await Usuario.findAll({
                  where: {
                    nombre: {
                        [Op.like]: '%' + filtro + '%',
                    },
                    inactivo: false
                },
                order: [
                    ['nombre', 'ASC'],
                ]
                
            }); 
            
            res.model_name = "usuarios";
            res.model_data = usuarios;
            
            next();

        }, 500);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarUsuariosNivelAcademico = async(req, res, next) => {

    try {

        const usuarios = await Usuario.findAll();
        res.json({usuarios})   

    }catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
    
}

exports.listarUsuariosInscritosDisponiblesCurso = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

            const { nombreUsuario, codigoInstitucion, codigoCurso } = req.query
            let { codigoRol } = req.query
            if (codigoRol === '0') codigoRol = ''

            const usuarios = await sequelize.query(`
                SELECT 
                    rut,
                    nombre_usuario,
                    rut_rol,
                    codigo_rol,
                    descripcion_rol, 
                    codigo_institucion,
                    descripcion_institucion,
                    existe_usr_rol_en_actual_curso AS item_select,
                    existe_usr_rol_en_actual_curso,
                    existe_usr_rol_en_otro_curso
                FROM (
                    SELECT 
                        usr.rut, 
                        usr.nombre AS nombre_usuario, 
                        rl.codigo AS codigo_rol,
                        CONCAT(usr.rut, rl.codigo) AS rut_rol,
                        rl.descripcion AS descripcion_rol,
                        uir.codigo_institucion,
                        it.descripcion AS  descripcion_institucion,
                        #EXISTE EN EL CURSO ACTUAL DE LA INSTITUCION.
                        (SELECT COUNT(*) 
                            FROM cursos_usuarios_roles cur 
                            INNER JOIN cursos c ON c.codigo = cur.codigo_curso
                            WHERE cur.rut_usuario = rut 
                                AND cur.codigo_curso = '${codigoCurso}'
                                AND c.codigo_institucion = '${codigoInstitucion}' #EL CODIGO DEL CURSO ES PROPIO DE LA INSTITUCIÓN.
                                AND cur.codigo_rol = rl.codigo
                        ) AS existe_usr_rol_en_actual_curso,
                        #EXISTE EN OTRO CURSO DE LA MISMA INSTITUCIÓN.
                        (SELECT COUNT(*) 
                            FROM cursos_usuarios_roles cur 
                            INNER JOIN cursos c ON c.codigo = cur.codigo_curso
                            WHERE cur.rut_usuario = rut 
                                AND cur.codigo_curso <> '${codigoCurso}'
                                AND c.codigo_institucion = '${codigoInstitucion}' #EL CODIGO DEL CURSO ES PROPIO DE LA INSTITUCIÓN.
                                AND cur.codigo_rol = rl.codigo
                        ) AS existe_usr_rol_en_otro_curso
                    FROM usuarios usr
                    INNER JOIN usuarios_instituciones_roles uir ON usr.rut = uir.rut_usuario 
                    INNER JOIN roles rl ON rl.codigo = uir.codigo_rol
                    INNER JOIN instituciones it ON it.codigo = uir.codigo_institucion
                    WHERE 
                        usr.inactivo = 0 
                        AND usr.nombre LIKE '%${nombreUsuario}%'
                        AND uir.codigo_institucion = '${codigoInstitucion}' 
                        AND rl.codigo IN (2,3) 
                        AND rl.codigo LIKE '%${codigoRol}%'
                )tb
                    WHERE (existe_usr_rol_en_actual_curso = 0 AND existe_usr_rol_en_otro_curso = 0) #SIN CURSO.
                        OR (existe_usr_rol_en_actual_curso = 1 AND existe_usr_rol_en_otro_curso = 0)#EN CURSO ACTUAL.
                        OR (codigo_rol = 3) #PROFESOR.
            `, { type: QueryTypes.SELECT });

            res.json({usuarios});


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.cargaMasivaUsuarios = async(req, res) => {

    const {archivoBase64} = req.body;

    try{
        //Directorio temporal donde se guardará el archivo de carga.
        const tmp_dir = process.env.DIR_TEMP;

        //Anido la ruta mas el nombre del archivo, para almacenarlo
        const archivoPath = tmp_dir + "cargaMasivaServer.xlsx"

        //Convierto el archivo base64 a xlsx y lo guardo en el directorio
        await fsp.writeFile(archivoPath, archivoBase64, 'base64');

        //Crea la instancia para utilizar la libreria.
        const workbook = new ExcelJS.Workbook()

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivoPath)

         //Se ubica en la hoja USUARIOS
         hoja_excel  = libro_excel.getWorksheet('USUARIOS');

    
         if (!hoja_excel) {
             return res.status(404).send({
                 msg: `No existe la hoja USUARIOS en el archivo excel para procesar y cargar las preguntas, verifique.`,
             });
         }

            let errores = []

        for (let i = 2; i < 5; i++) {
                let error = {
                    fila: i,
                    mensajes: []
                }
                let rut = hoja_excel.getCell(`A${i}`).text
                let clave = hoja_excel.getCell(`B${i}`).text
                let nombre = hoja_excel.getCell(`C${i}`).text
                let email = hoja_excel.getCell(`D${i}`).text
                let telefono = hoja_excel.getCell(`E${i}`).text
                let imagen = hoja_excel.getCell(`F${i}`).text
                //console.log(rut, clave,nombre, email, telefono, imagen)

             try{
                if(rut.trim() === ''){
                    error.mensajes.push('El rut está vacío')
                }
                if(nombre.trim() === ''){
                    error.mensajes.push('El nombre está vacío')
                }  

                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    
                if(!re.test(String(email).toLowerCase())){
                    error.mensajes.push('El email no es válido')
                }
                //que el telefono sea un numero
                if(isNaN(telefono)){
                    error.mensajes.push('El telefono no es un número')
                }

                if(error.mensajes.length > 0){
                    errores.push(error)
                }


            }catch(error) {
               console.log(error);
               res.status(500).send({
                   msg: 'Hubo un error, por favor vuelva a intentar'
               })
            }
        }


        if(errores.length > 0){
            return res.status(404).send({
                msg: 'El archivo contiene errores', 
                errores
            })
        }
        //hago nuevamente el for, pero esta vez inserto los registros en la base de datos.
        //y no olvidar el try catch.
        //verifico que el rut del usuario no existe en la base de datos.
        try{
            for (let i = 2; i < 5; i++) {
             let rut = hoja_excel.getCell(`A${i}`).text
             let clave = hoja_excel.getCell(`B${i}`).text
             let nombre = hoja_excel.getCell(`C${i}`).text
             let email = hoja_excel.getCell(`D${i}`).text
             let telefono = hoja_excel.getCell(`E${i}`).text
             let imagen = hoja_excel.getCell(`F${i}`).text

                const usuario = await Usuario.findByPk(rut);
                    if (!usuario) {
                        await Usuario.create({
                            rut,
                            clave,
                            nombre,
                            email,
                            telefono,
                            imagen
                        })
                    }else{
                        return res.status(400).json({
                            msg: `El usuario ${usuario.rut} ya existe`
                        });
                    }   
            }

        }catch(e){
            res.status(500).send({
                msg: 'Hubo un error, por favor vuelva a intentar'
            })
        }
        //Elimino el archivo
        await fsp.unlink(archivoPath)

        res.json({
            msg: "TODO OK!",
        })

    }catch(e){
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    

}

exports.actualizarUsuario = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let { rut, clave, nombre, email, telefono, imagen, inactivo } = req.body;

        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //compara la clave recibida con la almacenada en la base de datos
        //si son distintas entonces el usuario la actualizó y aplica el salt a la nueva clave
        if (clave !== usuario.clave) {
            //genero un hash para el password
            let salt = bcrypt.genSaltSync(10);
            clave = bcrypt.hashSync(clave, salt);
        }

        //actualiza los datos.
        usuario = await Usuario.update({
            nombre,
            clave,
            email,
            telefono,
            imagen,
            inactivo
        }, {
            where: {
                rut
            }
        })

        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarUsuario = async(req, res) => {

    try {
        //obtengo el rut del request
        const { rut, codigo_institucion } = req.query;
        //verifica que el usuario a eliminar existe.
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //si el usuario está inscrito en al menos un ring de la institución, ya no lo puedo eliminar.
        const ringUsuario = await RingUsuario.findOne({
            where: {
                rut_usuario: rut,
                codigo_institucion,
            }
        })

        if(ringUsuario){
            return res.status(404).send({
                msg: `El usuario ${rut} se encuentra inscrito en un ring, no se puede eliminar.`
            })
        }

        //elimina los cursos asociados al usuario institución.
        await sequelize.query(`
            DELETE cursos_usuarios_roles
            FROM cursos_usuarios_roles 
            INNER JOIN cursos ON cursos.codigo = cursos_usuarios_roles.codigo_curso
            WHERE cursos_usuarios_roles.rut_usuario = '${rut}' AND cursos.codigo_institucion = '${codigo_institucion}'
        `, {type: QueryTypes.DELETE})

        //elimina los roles asociados al usuario institución.
        await sequelize.query(`
            DELETE 
            FROM usuarios_instituciones_roles 
            WHERE rut_usuario = '${rut}' AND codigo_institucion = '${codigo_institucion}'
        `, {type: QueryTypes.DELETE})


        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario eliminado correctamente de la institución'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosUsuario = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { rut } = req.params
            //consulta por el usuario
        const usuario = await Usuario.findByPk(rut);
        //envia la información del usuario
        res.json({
            usuario
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.busquedaUsuarios = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro, codigo_institucion } = req.query
        //consulta por el usuario

        const usuarios = await sequelize.query(`
            SELECT u.* 
                FROM usuarios u
            LEFT JOIN usuarios_instituciones_roles uir ON uir.rut_usuario = u.rut
                WHERE CONCAT(u.rut, u.nombre) LIKE '%${filtro}%' AND uir.codigo_institucion = '${codigo_institucion}'
            GROUP BY u.rut
        `, { type: QueryTypes.SELECT })

        //envia la información del usuario
        res.json({
            usuarios
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.actualizarAvatar = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try{

        const { rut, avatar_color, avatar_textura, avatar_sombrero, avatar_accesorio } = req.body;

        //verifica si el usuario existe 
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //actualizo los datos del avatar
        usuario = await Usuario.update({
            avatar_color,
            avatar_textura,
            avatar_sombrero,
            avatar_accesorio,
        }, {
            where: {
                rut
            }
        })

        res.json({
            msg: 'Avatar actualizado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}
