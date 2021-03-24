const { PreguntaModulo } = require('../database/db');
const { validationResult } = require('express-validator');

exports.crearPreguntaModulo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_pregunta, codigo_modulo } = req.body;

        //verifica si existe la combinación pregunta vs modulo.
        let pregunta_modulo = await PreguntaModulo.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo
            }
        });

        if (pregunta_modulo.length > 0) {
            return res.status(400).json({
                msg: 'La pregunta ya está asignada al modulo'
            });
        }

        //Guarda la nueva relacion entre pregunta vs modulo.
        pregunta_modulo = await PreguntaModulo.create({
            codigo_pregunta,
            codigo_modulo
        });

        //envía la respuesta
        res.json({pregunta_modulo});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarPreguntaModulos = async(req, res, next) => {

    try {
        const pregunta_modulo = await PreguntaModulo.findAll();

        res.json({
            pregunta_modulo
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}


exports.eliminarPreguntaModulo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo_pregunta } = req.params;
        const { codigo_modulo } = req.query;


        //verifica si existe la combinación pregunta vs modulo.
        let pregunta_modulo = await PreguntaModulo.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo
            }
        });

        if (pregunta_modulo.length === 0) {
            return res.status(400).json({
                msg: 'El módulo no se encuentra asignado a la pregunta'
            });
        }

        //elimino el registro.
        pregunta_modulo = await PreguntaModulo.destroy({
            where: {
                codigo_pregunta,
                codigo_modulo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Módulo eliminado correctamente de la pregunta'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}