const { RingUsuario, Ring, sequelize } = require('../config/db');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

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

     const { rut_usuario, codigo_institucion } = req.params;

     try {

         //verifica si existe la combinación ring vs pregunta.
         let rings_usuario = await RingUsuario.findAll({
            include:[{
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                model: Ring,
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
            ]
        });

        console.log('ENTRA AQUI', rings_usuario)

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
