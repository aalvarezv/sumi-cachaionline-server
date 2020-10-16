const { PreguntaSolucion, Pregunta } = require('../config/db');
const { validationResult } = require('express-validator');

exports.crearPreguntaSolucion= async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, codigo_pregunta, numero, texto, imagen, audio, video, inactivo } = req.body;

        //verifica si existe la combinación pregunta vs pista.
        let pregunta_solucion = await PreguntaSolucion.findAll({
            where: {
                codigo,
                codigo_pregunta
            }
        });

        if (pregunta_solucion.length > 0) {
            console.log('La pregunta ya está asignada a la solución');
            return res.status(400).json({
                msg: 'La pregunta ya está asignada a la solución'
            });
        }

        //Guarda la nueva relacion entre solucion y pregunta.
        pregunta_pista = await PreguntaSolucion.create({
            codigo,
            codigo_pregunta,
            numero,
            texto,
            imagen,
            audio,
            video,
            inactivo
        });

        //envía la respuesta
        res.json(pregunta_solucion);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarPreguntaSolucion = async(req, res) => {

    try {
        const pregunta_solucion = await PreguntaSolucion.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['nombre', 'ASC'],
            ]
        });

        res.json({
            pregunta_solucion
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}



exports.eliminarPreguntaSolucion = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;

        //elimino el registro.
        pregunta_solucion = await PreguntaSolucion.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Pregunta eliminada correctamente de la solución'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

