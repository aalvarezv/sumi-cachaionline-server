const { CursoUsuarioRol, Usuario, Curso, Ring, 
    RingInvitacion, RingNivelAcademico, NivelAcademico } = require('../config/db')
const {Sequelize, Op} = require('sequelize')


exports.listarUsuariosInvitarRing = async(req, res) => {

    try {

        const { rut_usuario, codigo_institucion, 
                codigo_nivel_academico, roles, codigo_ring } = req.query

        const usuarios_invitar_ring = await CursoUsuarioRol.findAll({
            attributes: ['rut_usuario', 'codigo_rol', 'codigo_curso',
                [Sequelize.literal(`(SELECT COUNT(*) 
                FROM ring_invitaciones 
                WHERE codigo_ring = '${codigo_ring}'
                AND rut_usuario_receptor = curso_usuario_rol.rut_usuario)`),'invitacion_enviada'],
                [Sequelize.literal(`(SELECT estado 
                FROM ring_invitaciones 
                WHERE codigo_ring = '${codigo_ring}'
                AND rut_usuario_receptor = curso_usuario_rol.rut_usuario)`),'invitacion_estado']
            ],
            include: [{
                attributes: ['rut', 'nombre'],
                model: Usuario,
            },{
                attributes: ['codigo', 'letra', 
                'codigo_nivel_academico', 'codigo_institucion'],
                model: Curso,
            }],
            where: {
                [Op.and]:[
                    {codigo_rol: {[Op.in]: roles}},
                    {rut_usuario: {[Op.ne]: rut_usuario }},
                    {'$curso.codigo_institucion$': {[Op.eq]: codigo_institucion}},
                    {'$curso.codigo_nivel_academico$': {[Op.eq]: codigo_nivel_academico}}
                ]
            },
            group: ['rut_usuario'],
            order: [
                [Usuario, 'nombre', 'ASC']
            ]
        })

        res.json({
            usuarios_invitar_ring
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.listarInvitacionesRingUsuario = async (req, res) => {

    try {

        const { rut_usuario } = req.query

        const invitaciones_ring_usuario = await RingInvitacion.findAll({
            include:[{
                attributes: ['codigo','nombre', 'descripcion', 'fecha_hora_inicio',
                'fecha_hora_fin', 'rut_usuario_creador'],
                model: Ring,
                include:[{
                    model: RingNivelAcademico,
                    attributes: ['codigo_ring', 'codigo_nivel_academico'],
                    include:[{
                        model: NivelAcademico,
                        attributes: ['codigo', 'descripcion']
                    }]
                }]
            }, {
                attributes: ['rut', 'nombre', 'email'],
                model: Usuario,
                as: 'usuario_emisor'
            }, {
                attributes: ['rut', 'nombre', 'email'],
                model: Usuario,
                as: 'usuario_receptor'
            }],
            where:{
                rut_usuario_receptor: rut_usuario,
                inactivo: false,
            },  
            order:[
                ['createdAt', 'DESC']
            ]
        })

        res.json({
            invitaciones_ring_usuario,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar',
        })
    }

}

exports.cantidadInvitacionesRingUsuario = async (req, res) => {
    try {

        const { rut_usuario } = req.query

        const cantidad_invitaciones_ring = await RingInvitacion.count({
            where:{
                rut_usuario_receptor: rut_usuario,
                inactivo: false,
            }
        })

        res.json({
            cantidad_invitaciones_ring
        })

    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar',
        })
    }
}

exports.actualizarEstadoInvitacionRing = async (req, res) => {

    try {

        const { codigo, estado } = req.body

        const usuario_invitacion_ring = await RingInvitacion.update({
            estado
        },
        { 
            where: {
                codigo
            }
        })

        res.json({
            usuario_invitacion_ring
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar',
        })
    }

}