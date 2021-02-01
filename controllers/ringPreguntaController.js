const { RingPregunta, Pregunta } = require('../config/db');
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

exports.crearRingPreguntaMasivo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { ring_preguntas_add } = req.body;

        for(let ring_pregunta_add of ring_preguntas_add){
   
            const {codigo_pregunta, codigo_ring} = ring_pregunta_add;
           
            //verifica si existe la combinación ring vs pregunta.
            let ring_pregunta = await RingPregunta.findAll({
                where: {
                    codigo_ring,
                    codigo_pregunta
                }
            });
            
            if (ring_pregunta.length === 0) {
                await RingPregunta.create({
                    codigo_ring,
                    codigo_pregunta
                });
            }

        }

        res.json({
            msg: 'Preguntas correctamente agregadas al ring en forma masiva'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.listarRingPreguntas = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {

        const { codigo_ring } = req.params;
    
        //verifica si existe la combinación ring vs pregunta.
        let ring_preguntas = await RingPregunta.findAll({
            include:[{
                model: Pregunta,
            }],
            where: {
                codigo_ring
            }
        });

        res.json({
            ring_preguntas
        });

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
        const { codigo_ring, codigo_pregunta } = req.params;
     
        //verifica si existe la combinación ring vs pregunta.
        let ring_pregunta = await RingPregunta.findAll({
            where: {
                codigo_ring,
                codigo_pregunta
            }
        });

        if (ring_pregunta.length === 0) {
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

exports.eliminarRingPreguntaMasivo = async(req, res) => {
    //si hay errores de la validación
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { ring_preguntas_del } = req.query;

        for(let ring_pregunta_del of ring_preguntas_del){
            
            const {codigo_pregunta, codigo_ring} = JSON.parse(ring_pregunta_del);
            
            //verifica si existe la combinación ring vs pregunta.
            let ring_pregunta = await RingPregunta.findAll({
                where: {
                    codigo_ring,
                    codigo_pregunta
                }
            });

            if (ring_pregunta.length > 0) {
                await RingPregunta.destroy({
                    where: {
                        codigo_ring,
                        codigo_pregunta
                    }
                });
            }

        }

        res.json({
            msg: 'Preguntas correctamente eliminadas del ring en forma masiva'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}