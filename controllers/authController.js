const {CursoUsuarioRol, Curso, NivelAcademico, Usuario, UsuarioInstitucionRol, Institucion, Rol} = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid').v4
const { limpiaTextoObjeto, validRefreshTokens } = require('../helpers');
const moment = require('moment');
const { Sequelize, Op } = require('sequelize');

//filtro_fecha.push({ '$ring.fecha_hora_fin$': { [Op.gte] : moment().format('YYYY-MM-DD HH:mm')}})

const autenticarUsuario = async (req, res) => {
    
    try { 

      
        const { rut, clave } = req.body

        //revisa que el usuario existe
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(400).json({
                msg: 'Verifique los datos ingresados'
            })
        }
        
        //revisar el password ingresado vs el password de la bd
        const passCorrecto = await bcrypt.compare(clave, usuario.clave)
        if(!passCorrecto){
            return res.status(401).json({
                msg: 'Verifique los datos ingresados'
            })
        }

        //revisar que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'La cuenta de usuario se encuentra inactiva'
            })
        }

        //revisa que el usuario tenga al menos un rol asignado.
        const usuario_institucion_rol = await UsuarioInstitucionRol.findAll({
            where:{
                rut_usuario: rut,
            }
        });
       
        if(usuario_institucion_rol.length === 0){
            return res.status(401).json({
                msg: 'El usuario no se encuentra asociado a una institución con un perfil asignado, comuniquese con un administrador.'
            })
        }
        
        //si el usuario es válido crear y firmar el jsonwebtoken
        const payload = {
            usuario: {
                rut: usuario.rut
            }
        }
        // //Obtiene el tiempo de expiracion del token.
        // const token = await Configuracion.findOne({
        //     where: {
        //         seccion: 'TOKEN',
        //         clave: 'EXPIRA'
        //     }
        // })

        //id para refrescar el token
        const tokenRefresh = uuidv4()
        validRefreshTokens.push({
            rut: usuario.rut,
            tokenRefresh,
            fechaHora: new Date(),
        })

        //firmar el jsonwebtoken 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 86400, //86400 segundos 1 día.
        }, (error, token) => {
            if (error) throw error
            res.json({ 
                token,
                tokenRefresh,
            })
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}

/*attributes: [
                'codigo',
                'letra', 
                [Sequelize.literal(`(SELECT COUNT(*) 
                FROM cursos_usuarios_roles 
                WHERE codigo_curso = curso.codigo
                AND rut_usuario = '${rut_usuario}'
                AND codigo_rol = '${codigo_rol}'
                )`),'inscrito']
            ],*/

const datosUsuarioAutenticado = async (req, res) => {

    try {
        //obtiene el parametro desde la url
        const {rut} = req.usuario

        //consulta por el usuario
        const usuario = await Usuario.findByPk(rut, {
            attributes: [
                'rut', 
                'nombre',
                'email',
                'telefono',
                'imagen',
                'avatar_color',
                'avatar_textura',
                'avatar_sombrero',
                'avatar_accesorio',
                [Sequelize.literal(`(SELECT COUNT(*)
                    FROM ring_usuarios ru
                    LEFT JOIN rings r ON r.codigo = ru.codigo_ring
                    WHERE ru.rut_usuario = '${rut}'
                    AND ru.finalizado = 0 
                    AND r.fecha_hora_fin >= '${moment().format('YYYY-MM-DD HH:mm')}'
                )`),'rings_activos'],
                'inactivo',
            ],
            raw: true,
            nested: true,
        });

        //si el usuario no existe
        if(!usuario){
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        
        //obtiene las instituciones del usuario.
        let usuarioInstituciones = await UsuarioInstitucionRol.findAll({
            attributes:['codigo_institucion'],
            include:[{
                model:Institucion,
                attributes: ['descripcion', 'direccion', 'email', 'telefono', 'logo'],
            }],
            where:{
                rut_usuario: rut,
            },
            group: ['codigo_institucion'],
            raw: true,
            nested: false,
        })

        let institucionRoles = []

        if(usuarioInstituciones.length > 0){
          
            //Obtiene los roles y cursos del usuario por institucion.
            for(let usuarioInstitucion of usuarioInstituciones){

                let roles = await UsuarioInstitucionRol.findAll({
                    attributes:['codigo_rol'],
                    include: [{
                        model: Rol,
                        attributes: { exclude: ['codigo','createdAt', 'updatedAt'] },
                    }],
                    where:{
                        rut_usuario: rut,
                        codigo_institucion: usuarioInstitucion.codigo_institucion,
                    },
                    raw:true,
                    nested: true,
                    //order: ['rol.descripcion', 'ASC']
                })

                roles = roles.map((rol, idx) => {
                    return {
                        descripcion: rol["rol.descripcion"],
                        ver_menu_administrar: rol["rol.ver_menu_administrar"],
                        ver_submenu_instituciones: rol["rol.ver_submenu_instituciones"],
                        ver_submenu_niveles_academicos: rol["rol.ver_submenu_niveles_academicos"],
                        ver_submenu_roles: rol["rol.ver_submenu_roles"],
                        ver_submenu_usuarios: rol["rol.ver_submenu_usuarios"],
                        ver_menu_asignaturas: rol["rol.ver_menu_asignaturas"],
                        ver_submenu_materias: rol["rol.ver_submenu_materias"],
                        ver_submenu_unidades: rol["rol.ver_submenu_unidades"],
                        ver_submenu_modulos: rol["rol.ver_submenu_modulos"],
                        ver_submenu_contenidos: rol["rol.ver_submenu_contenidos"],
                        ver_submenu_temas: rol["rol.ver_submenu_temas"],
                        ver_submenu_conceptos: rol["rol.ver_submenu_conceptos"],
                        ver_menu_preguntas: rol["rol.ver_menu_preguntas"],
                        ver_menu_rings: rol["rol.ver_menu_rings"],
                        inactivo: rol["rol.inactivo"],
                    }
                })

                let cursos = await Curso.findAll({
                    attributes:['codigo', 'letra'],
                    include:[{
                        model: CursoUsuarioRol,
                        attributes: ['codigo_curso', 'rut_usuario'],
                    },{
                        model: NivelAcademico,
                        attributes: ['descripcion']
                    }],
                    where:{
                        [Op.and]:[
                            {codigo_institucion: {[Op.eq]: usuarioInstitucion.codigo_institucion }},
                            {'$curso_usuario_rols.rut_usuario$': {[Op.eq]: rut}}
                        ]
                    },
                    raw: true,
                    nested: true,
                    group: 'codigo'
                })

                cursos = cursos.map(curso => {
                    return {
                        codigo: curso.codigo,
                        descripcion: `${curso["nivel_academico.descripcion"]} ${curso.letra}`
                    }
                })

                
                institucionRoles.push({
                    codigo_institucion: usuarioInstitucion.codigo_institucion,
                    descripcion_institucion: usuarioInstitucion["institucion.descripcion"],
                    direccion_institucion: usuarioInstitucion["institucion.direccion"],
                    email_institucion: usuarioInstitucion["institucion.email"],
                    telefono_institucion: usuarioInstitucion["institucion.telefono"],
                    logo_institucion: usuarioInstitucion["institucion.logo"],
                    roles,
                    cursos,
                })

            }





        }

        //envia la información del usuario
        res.json({
            ...usuario,
            institucion_roles: institucionRoles
        })
       

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    
}

module.exports = {
    autenticarUsuario,
    datosUsuarioAutenticado
}