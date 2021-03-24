const { RingPregunta, Pregunta, PreguntaAlternativa, 
    PreguntaSolucion, PreguntaPista } = require('../database/db');

const { Sequelize } = require('sequelize');
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

        const cantPreguntasRing = await RingPregunta.count({
            where: {
                codigo_ring,
            }
        });

        //envía la respuesta
        res.json({
            ring_pregunta,
            cantPreguntasRing
        });

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

        const cantPreguntasRing = await RingPregunta.count({
            where: {
                codigo_ring: ring_preguntas_add[0].codigo_ring,
            }
        });

        res.json({
            msg: 'Preguntas correctamente agregadas al ring en forma masiva',
            cantPreguntasRing
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

        const { codigo_ring } = req.query;
    
        //verifica si existe la combinación ring vs pregunta.
        let ring_preguntas = await RingPregunta.findAll({
            
            attributes: ['codigo_pregunta'],
            include:[{
                attributes:[
                    'rut_usuario_creador',
                    'texto',
                    [Sequelize.literal('CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END'),'imagen'],
                    [Sequelize.literal('CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.audio)) ELSE pregunta.audio END'),'audio'],
                    [Sequelize.literal('CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.video)) ELSE pregunta.video END'),'video'],
                    'duracion',
                    'createdAt',
                ],
                model: Pregunta,
                as: 'pregunta',
                include:[{
                    model: PreguntaAlternativa,
                    as: 'pregunta_alternativa',
                    attributes: ['codigo', 'letra', 'correcta', 'numero'],
                },{
                    model: PreguntaSolucion,
                    as: 'pregunta_solucion',
                    attributes: [
                        'codigo', 
                        'numero', 
                        'texto',
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`imagen` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`imagen`)) ELSE `pregunta->pregunta_solucion`.`imagen` END'), 'imagen'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`audio` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`audio`)) ELSE `pregunta->pregunta_solucion`.`audio` END'), 'audio'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`video` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`video`)) ELSE `pregunta->pregunta_solucion`.`video` END'), 'video'],
                    ],
                },{
                    model: PreguntaPista,
                    attributes: [
                        'codigo', 
                        'numero', 
                        'texto',
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`imagen` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`imagen`)) ELSE `pregunta->pregunta_pista`.`imagen` END'), 'imagen'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`audio` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`audio`)) ELSE `pregunta->pregunta_pista`.`audio` END'), 'audio'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`video` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`video`)) ELSE `pregunta->pregunta_pista`.`video` END'), 'video'], 
                    ],
                }],
            }],
            where: {
                codigo_ring
            },
            order: [
                [Pregunta, PreguntaAlternativa ,'numero', 'ASC']
            ]
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

        const cantPreguntasRing = await RingPregunta.count({
            where: {
                codigo_ring,
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Pregunta eliminada correctamente del ring',
            cantPreguntasRing
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

        const cantPreguntasRing = await RingPregunta.count({
            where: {
                codigo_ring: JSON.parse(ring_preguntas_del[0]).codigo_ring,
            }
        });

        res.json({
            msg: 'Preguntas correctamente eliminadas del ring en forma masiva',
            cantPreguntasRing
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}

exports.countPreguntasRing = async(req, res) => {

    try{

        const { codigo_ring } = req.query; 

        const cantPreguntasRing = await RingPregunta.count({
            where: {
                codigo_ring,
            }
        });

        res.json({
            cantPreguntasRing,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}