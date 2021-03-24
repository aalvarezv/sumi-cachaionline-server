const { PreguntaPista } = require('../database/db');
const { validationResult } = require('express-validator');

exports.crearPreguntaPista= async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, codigo_pregunta, imagen, audio, video, inactivo } = req.body;

        //verifica si existe la combinación pista vs pregunta.
        let pregunta_pista = await PreguntaPista.findAll({
            where: {
                codigo,
                codigo_pregunta
            }
        });

        if (pregunta_pista.length > 0) {
            return res.status(400).json({
                msg: 'La pregunta ya está asignada a la pista'
            });
        }

        //Guarda la nueva relacion entre pista y pregunta.
        pregunta_pista = await PreguntaPista.create({
            codigo,
            codigo_pregunta,
            imagen,
            audio,
            video,
            inactivo
        });

        //envía la respuesta
        res.json(pregunta_pista);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarPreguntaPista = async(req, res) => {

    try {
        const pregunta_pista = await PreguntaPista.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['nombre', 'ASC'],
            ]
        });

        res.json({
            pregunta_pista
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}


exports.eliminarPreguntaPista = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;

        //elimino el registro.
        pregunta_pista = await PreguntaPista.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Pista eliminada correctamente de la pregunta'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

