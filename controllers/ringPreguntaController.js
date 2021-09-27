const { 
    RingPregunta, 
    Pregunta, 
    PreguntaAlternativa, 
    PreguntaPista,
    PreguntaSolucion, 
    sequelize 
} = require('../database/db');

const { Sequelize, QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');

const url_preguntas = process.env.URL_PREGUNTAS;

exports.crearRingPregunta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { 
                codigo_ring, 
                codigo_pregunta,
                puntos_factor,
                puntos_respuesta_correcta, 
                puntos_respuesta_incorrecta, 
                puntos_respuesta_omitida, 
                puntos_respuesta_timeout, 
            } = req.body;

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
            codigo_pregunta,
            puntos_factor,
            puntos_respuesta_correcta, 
            puntos_respuesta_incorrecta, 
            puntos_respuesta_omitida, 
            puntos_respuesta_timeout, 
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
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { ring_preguntas_add } = req.body;

        for(let ring_pregunta_add of ring_preguntas_add){
   
            const {
                    codigo_pregunta, 
                    codigo_ring,
                    puntos_factor,
                    puntos_respuesta_correcta, 
                    puntos_respuesta_incorrecta, 
                    puntos_respuesta_omitida, 
                    puntos_respuesta_timeout 
                } = ring_pregunta_add;
           
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
                    codigo_pregunta,
                    puntos_factor,
                    puntos_respuesta_correcta, 
                    puntos_respuesta_incorrecta, 
                    puntos_respuesta_omitida, 
                    puntos_respuesta_timeout 
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
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
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
                    [Sequelize.literal(`CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END`),'imagen'],
                    [Sequelize.literal(`CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.audio)) ELSE pregunta.audio END`),'audio'],
                    [Sequelize.literal(`CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.video)) ELSE pregunta.video END`),'video'],
                    'imagen_alto',
                    'imagen_ancho',
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
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`imagen` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`imagen`)) ELSE `pregunta->pregunta_solucion`.`imagen` END'), 'imagen'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`audio` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`audio`)) ELSE `pregunta->pregunta_solucion`.`audio` END'), 'audio'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_solucion`.`video` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta->pregunta_solucion`.`video`)) ELSE `pregunta->pregunta_solucion`.`video` END'), 'video'],
                    ],

                },{
                    model: PreguntaPista,
                    attributes: [
                        'codigo', 
                        'numero', 
                        'texto',
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`imagen` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`imagen`)) ELSE `pregunta->pregunta_pista`.`imagen` END'), 'imagen'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`audio` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`audio`)) ELSE `pregunta->pregunta_pista`.`audio` END'), 'audio'],
                        [Sequelize.literal('CASE WHEN `pregunta->pregunta_pista`.`video` <> "" THEN (SELECT CONCAT("'+url_preguntas+'", `pregunta->pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta->pregunta_pista`.`video`)) ELSE `pregunta->pregunta_pista`.`video` END'), 'video'],
                        'imagen_alto',
                        'imagen_ancho',
                    ],

                }],
            }],
            where: {
                codigo_ring
            },
            order: [
                [Pregunta, PreguntaAlternativa ,'numero', 'ASC'],
                [Pregunta, PreguntaSolucion,'numero', 'ASC'],
                [Pregunta, PreguntaPista,'numero', 'ASC'],
            ],

        });

        ring_preguntas = JSON.parse(JSON.stringify(ring_preguntas))

        let newPreguntasRing = []

        for(let preguntaRing of ring_preguntas){

            let codigo_pregunta = preguntaRing.codigo_pregunta

            const unidadesPregunta = await sequelize.query(`
                SELECT 
                    un.codigo, un.descripcion
                    FROM pregunta_modulos pmd
                    LEFT JOIN modulos md ON md.codigo = pmd.codigo_modulo
                    LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                    WHERE pmd.codigo_pregunta = '${codigo_pregunta}'
                GROUP BY un.codigo
            `, { type: QueryTypes.SELECT })

            newPreguntasRing.push({
                ...preguntaRing,
                pregunta: {
                    ...preguntaRing.pregunta,
                    unidades: unidadesPregunta,
                }
            })

        }

        res.json({
            ring_preguntas: newPreguntasRing,
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
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
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
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
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

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

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

exports.getPuntajesPreguntaRing = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        
        const { codigo_ring, codigo_pregunta } = req.query; 

        const puntajesPreguntaRing = await RingPregunta.findOne({
            where: {
                codigo_ring,
                codigo_pregunta,
            }
        })

        res.json({
            puntajesPreguntaRing,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.updatePuntajesPreguntaRing = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        
        const { 
            codigo_ring, 
            codigo_pregunta,
            puntos_factor,
            puntos_respuesta_correcta,
            puntos_respuesta_incorrecta,
            puntos_respuesta_omitida,
            puntos_respuesta_timeout, 
        } = req.body; 

        await RingPregunta.update({
            puntos_factor,
            puntos_respuesta_correcta,
            puntos_respuesta_incorrecta,
            puntos_respuesta_omitida,
            puntos_respuesta_timeout,
        },{
            where: {
                codigo_ring,
                codigo_pregunta,
            }
        })

        res.json({
           msg: 'Puntaje pregunta ring actualizado correctamente'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}