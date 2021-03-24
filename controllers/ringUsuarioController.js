const { RingUsuario, Ring, Usuario, Materia, Institucion, TipoJuego, Modalidad } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { limpiaTextoObjeto } = require('../helpers');

exports.crearRingUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_ring, rut_usuario } = req.body;

        //verifica si existe la combinación ring vs usuario.
        let ring_usuario = await RingUsuario.findAll({
            where: {
                codigo_ring,
                rut_usuario
            }
        });

        if (ring_usuario.length > 0) {
            return res.status(400).json({
                msg: 'El usuario ya está asignado al ring'
            });
        }

        //Guarda la nueva relacion entre ring y usuario
        ring_usuario = await RingUsuario.create({
            codigo_ring,
            rut_usuario,
        });

        //envía la respuesta
        res.json({ring_usuario});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.crearRingUsuarioMasivo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { ring_usuarios_add } = req.body;

        for(let ring_usuario_add of ring_usuarios_add){
   
            const {rut_usuario, codigo_ring} = ring_usuario_add;
           
            //verifica si existe la combinación ring vs pregunta.
            let ring_usuario = await RingUsuario.findAll({
                where: {
                    codigo_ring,
                    rut_usuario
                }
            });
            
            if (ring_usuario.length === 0) {
                await RingUsuario.create({
                    codigo_ring,
                    rut_usuario,
                });
            }

        }

        res.json({
            msg: 'Usuarios correctamente agregados al ring en forma masiva'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.listarRingsUsuarioInstitucion = async (req,res) => {

     //si hay errores de la validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
     }

     const { rut_usuario, codigo_institucion } = req.query;

     try {


         //verifica si existe la combinación ring vs pregunta.
         let rings_usuario = await RingUsuario.findAll({
            attributes: [['rut_usuario','rut_usuario_invitado'],['createdAt','fecha_invitacion_usuario']],
            include:[{
                attributes: { 
                    include: ['codigo','nombre','descripcion','fecha_hora_inicio','fecha_hora_fin','tipo_duracion_pregunta',
                    [Sequelize.literal(`(
                        CASE WHEN tipo_duracion_pregunta = 1 THEN "SIN TIEMPO" 
                             WHEN tipo_duracion_pregunta = 2 THEN "TIEMPO DEFINIDO" 
                             ELSE "TIEMPO PREGUNTA" END)`),'tipo_duracion_pregunta_descripcion']
                    ,'duracion_pregunta','revancha','revancha_cantidad','retroceder','pistas','privado','inactivo'],
                    exclude: ['rut_usuario_creador', 'codigo_materia', 'codigo_institucion','codigo_tipo_juego','codigo_modalidad','createdAt', 'updatedAt'] },
                model: Ring,
                include:[{
                    attributes: ['rut','nombre','email'],
                    model: Usuario,
                    as: 'usuario_creador',
                },{
                    attributes: ['codigo', 'nombre'],
                    model: Materia,
                    as: 'materia'
                },{
                    attributes: ['codigo', 'descripcion'],
                    model: Institucion,
                    as: 'institucion'
                },{
                    attributes: ['codigo', 'descripcion'],
                    model: TipoJuego,
                    as: 'tipo_juego'
                },{
                    attributes: ['codigo', 'descripcion'],
                    model: Modalidad,
                    as: 'modalidad',
                }],
            }],
            where: {
                [Op.and]:[
                    {rut_usuario},
                    {'$ring.codigo_institucion$': { [Op.eq]: codigo_institucion } },
                    //sequelize.where( sequelize.col('fecha_hora_inicio'), '<=', new Date() ),
                    //sequelize.where( sequelize.col('fecha_hora_fin'), '>=', new Date() ),
                ]
            },
            order: [
                [Ring, 'fecha_hora_fin', 'ASC'],
            ],
           
        });

        //rings_usuario = limpiaTextoObjeto(rings_usuario, 'ring.')

        console.log(rings_usuario)

        res.json({
            rings_usuario
        });

     } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
     }

}

exports.eliminarRingUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo_ring, rut_usuario } = req.params;
    
        //verifica si existe la combinación ring vs usuario.
        let ring_usuario = await RingUsuario.findAll({
            where: {
                codigo_ring,
                rut_usuario
            }
        });

        if (ring_usuario.length === 0) {
            return res.status(400).json({
                msg: 'El usuario no se encuentra asignado al ring'
            });
        }

        //elimino el registro.
        await RingUsuario.destroy({
            where: {
                codigo_ring,
                rut_usuario
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario eliminado correctamente del ring'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.eliminarRingUsuarioMasivo = async(req, res) => {
    //si hay errores de la validación
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { ring_usuarios_del } = req.query;

        for(let ring_usuario_del of ring_usuarios_del){
            
            const {rut_usuario, codigo_ring} = JSON.parse(ring_usuario_del);
            
            //verifica si existe la combinación ring vs pregunta.
            let ring_usuario = await RingUsuario.findAll({
                where: {
                    codigo_ring,
                    rut_usuario,
                }
            });

            if (ring_usuario.length > 0) {
                await RingUsuario.destroy({
                    where: {
                        codigo_ring,
                        rut_usuario
                    }
                });
            }

        }

        res.json({
            msg: 'Usuarios correctamente eliminados del ring en forma masiva'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}

exports.listarUsuariosRing = async(req, res) => {

    try {
        
        const { codigoRing } = req.query

        const usuariosRing = await RingUsuario.findAll({
            include:[{
                attributes: ['rut', 'nombre', 'email'],
                model: Usuario,
            }],
            where: {
                codigo_ring: codigoRing,
            }
        })

        res.json({
            usuariosRing
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}
