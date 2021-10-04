const {
    CursoUsuarioRol, 
    Curso, 
    NivelAcademico, 
    Usuario, 
    UsuarioInstitucionRol, 
    Institucion, 
    Rol, 
    sequelize,
    TokenRefresh
} = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid').v4
const moment = require('moment');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');


const autenticarUsuario = async (req, res) => {

    
    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

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

        const tokenRefeshExist = await TokenRefresh.findByPk(rut)
        if(tokenRefeshExist){
            await TokenRefresh.update({
                token_refresh: tokenRefresh,
                updatedAt: moment().format('YYYY-MM-DD HH:mm')
            },{ 
                where: {
                    rut_usuario: rut
                }
            })
        }else{
            await TokenRefresh.create({
                rut_usuario: rut,
                token_refresh: tokenRefresh,
                createdAt: moment().format('YYYY-MM-DD HH:mm'),
                updatedAt: moment().format('YYYY-MM-DD HH:mm')
            })
        }

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
                [Sequelize.literal(`CONVERT(IFNULL((SELECT SUM(puntos) 
                    FROM respuestas
                    WHERE rut_usuario = '${rut}'), 0), SIGNED)`),'puntaje_global'],
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
                        codigo_rol: rol.codigo_rol,
                        descripcion: rol["rol.descripcion"],
                        sys_admin: rol["rol.sys_admin"],
                        ver_menu_administrar: rol["rol.ver_menu_administrar"],
                        ver_submenu_instituciones: rol["rol.ver_submenu_instituciones"],
                        ver_submenu_niveles_academicos: rol["rol.ver_submenu_niveles_academicos"],
                        ver_submenu_roles: rol["rol.ver_submenu_roles"],
                        ver_submenu_usuarios: rol["rol.ver_submenu_usuarios"],
                        ver_submenu_cursos: rol["rol.ver_submenu_cursos"],
                        ver_menu_asignaturas: rol["rol.ver_menu_asignaturas"],
                        ver_submenu_materias: rol["rol.ver_submenu_materias"],
                        ver_submenu_unidades: rol["rol.ver_submenu_unidades"],
                        ver_submenu_modulos: rol["rol.ver_submenu_modulos"],
                        ver_submenu_contenidos: rol["rol.ver_submenu_contenidos"],
                        ver_menu_carga_masiva: rol["rol.ver_menu_carga_masiva"],
                        ver_submenu_carga_masiva_unidades: rol["rol.ver_submenu_carga_masiva_unidades"],
                        ver_submenu_carga_masiva_usuarios: rol["rol.ver_submenu_carga_masiva_usuarios"],
                        ver_submenu_temas: rol["rol.ver_submenu_temas"],
                        ver_submenu_conceptos: rol["rol.ver_submenu_conceptos"],
                        ver_menu_preguntas: rol["rol.ver_menu_preguntas"],
                        ver_menu_rings: rol["rol.ver_menu_rings"],
                        ver_menu_cuestionarios: rol["rol.ver_menu_cuestionarios"],
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

                const puntos = await sequelize.query(`
                    SELECT CONVERT(IFNULL(SUM(puntos), 0), SIGNED) AS total_puntos
                        FROM respuestas re
                    LEFT JOIN rings ri ON ri.codigo = re.codigo_ring
                    WHERE re.rut_usuario = '${rut}' AND ri.codigo_institucion = '${usuarioInstitucion.codigo_institucion}'
                `, { type: QueryTypes.SELECT })

                
                institucionRoles.push({
                    codigo_institucion: usuarioInstitucion.codigo_institucion,
                    descripcion_institucion: usuarioInstitucion["institucion.descripcion"],
                    direccion_institucion: usuarioInstitucion["institucion.direccion"],
                    email_institucion: usuarioInstitucion["institucion.email"],
                    telefono_institucion: usuarioInstitucion["institucion.telefono"],
                    logo_institucion: usuarioInstitucion["institucion.logo"],
                    roles,
                    cursos,
                    puntaje_institucion: puntos[0].total_puntos
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