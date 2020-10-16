const { RingUsuario } = require('../config/db');
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
            console.log('El usuario ya está asignado al ring');
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
        res.json(ring_usuario);

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
        const { codigo_ring } = req.params;
        const { rut_usuario } = req.query;

        //verifica si existe la combinación ring vs usuario.
        let ring_usuario = await RingUsuario.findAll({
            where: {
                codigo_ring,
                rut_usuario
            }
        });

        if (ring_usuario.length === 0) {
            console.log('El usuario no se encuentra asignado al ring');
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

