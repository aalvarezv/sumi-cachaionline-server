const { RingPregunta } = require('../config/db');
const { validationResult } = require('express-validator');

exports.crearRingPregunta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_ring, codigo_pregunta } = req.body;

        //verifica si existe la combinación ring vs pregunta.
        let ring_pregunta = await RingPregunta.findAll({
            where: {
                codigo_ring,
                codigo_pregunta
            }
        });

        if (ring_pregunta.length > 0) {
            console.log('La pregunta ya está asignada al ring');
            return res.status(400).json({
                msg: 'La pregunta ya está asignada al ring'
            });
        }

        //Guarda la nueva relacion entre ring y pregunta.
        ring_pregunta = await RingPregunta.create({
            codigo_ring,
            codigo_pregunta
        });

        //envía la respuesta
        res.json({ring_pregunta});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}


exports.eliminarRingPregunta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo_ring } = req.params;
        const { codigo_pregunta } = req.query;

        //verifica si existe la combinación ring vs usuario.
        let ring_pregunta = await RingPregunta.findAll({
            where: {
                codigo_ring,
                codigo_pregunta
            }
        });

        if (ring_pregunta.length === 0) {
            console.log('La pregunta no se encuentra asignada al ring');
            return res.status(400).json({
                msg: 'La pregunta no se encuentra asignada al ring'
            });
        }

        //elimino el registro.
        await RingPregunta.destroy({
            where: {
                codigo_ring,
                codigo_pregunta
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Pregunta eliminada correctamente del ring'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

