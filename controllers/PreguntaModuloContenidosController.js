const { PreguntaModuloContenido } = require('../config/db');
const { validationResult } = require('express-validator');

exports.crearPreguntaModuloContenido= async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_pregunta, codigo_modulo_contenido } = req.body;

        //verifica si existe la combinación pregunta vs modulo_propiedad.
        let pregunta_modulo_contenido = await PreguntaModuloContenido.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo_contenido,
            }
        });

        if (pregunta_modulo_contenido.length > 0) {
            return res.status(400).json({
                msg: 'La pregunta ya está asignada al contenido del módulo',
            });
        }

        //Guarda la nueva relacion entre pregunta y modulo_propiedad.
        pregunta_modulo_contenido = await PreguntaModuloContenido.create({
            codigo_pregunta,
            codigo_modulo_contenido,
        });

        //envía la respuesta
        res.json({pregunta_modulo_contenido});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar',
        });
    }

}


exports.listarPreguntaModuloContenido = async(req, res, next) => {

    try {
        const pregunta_modulo_contenido = await PreguntaModuloContenido.findAll();

        res.json({
            pregunta_modulo_contenido,
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar",
        });
    }
}


exports.eliminarPreguntaModuloContenido = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo_pregunta } = req.params;
        const { codigo_modulo_contenido } = req.query;


        //verifica si existe la combinación pregunta vs modulo contenido.
        let pregunta_modulo_contenido = await PreguntaModuloContenido.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo_contenido,
            }
        });

        if (pregunta_modulo_contenido.length === 0) {
            return res.status(400).json({
                msg: 'El contenido del módulo no se encuentra asignado a la pregunta',
            });
        }

        //elimino el registro.
        pregunta_modulo_contenido = await PreguntaModuloContenido.destroy({
            where: {
                codigo_pregunta,
                codigo_modulo_contenido,
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Contenido módulo eliminado correctamente de la pregunta'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}