const { PreguntaModuloPropiedad, Pregunta } = require('../config/db');
const { validationResult } = require('express-validator');

exports.crearPreguntaModuloPropiedad= async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_pregunta, codigo_modulo_propiedad } = req.body;

        //verifica si existe la combinación pregunta vs modulo_propiedad.
        let pregunta_modulo_propiedad = await PreguntaModuloPropiedad.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo_propiedad
            }
        });

        if (pregunta_modulo_propiedad.length > 0) {
            console.log('La pregunta ya está asignada al modulo propiedad');
            return res.status(400).json({
                msg: 'La pregunta ya está asignada al modulo propiedad'
            });
        }

        //Guarda la nueva relacion entre pregunta y modulo_propiedad.
        pregunta_modulo_propiedad = await PreguntaModuloPropiedad.create({
            codigo_pregunta,
            codigo_modulo_propiedad
        });

        //envía la respuesta
        res.json({pregunta_modulo_propiedad});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarPreguntaModuloPropiedades = async(req, res, next) => {

    try {
        const pregunta_modulo_propiedad = await PreguntaModuloPropiedad.findAll();

        res.json({
            pregunta_modulo_propiedad
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}


exports.eliminarPreguntaModuloPropiedad = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //obtengo el codigo del request
        const { codigo_pregunta } = req.params;
        const { codigo_modulo_propiedad } = req.query;


        //verifica si existe la combinación pregunta vs modulo propiedad.
        let pregunta_modulo_propiedad = await PreguntaModuloPropiedad.findAll({
            where: {
                codigo_pregunta,
                codigo_modulo_propiedad
            }
        });

        if (pregunta_modulo_propiedad.length === 0) {
            console.log('El módulo propiedad no se encuentra asignado a la pregunta');
            return res.status(400).json({
                msg: 'El módulo propiedad no se encuentra asignado a la pregunta'
            });
        }

        //elimino el registro.
        pregunta_modulo_propiedad = await PreguntaModuloPropiedad.destroy({
            where: {
                codigo_pregunta,
                codigo_modulo_propiedad
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Módulo propiedad eliminado correctamente de la pregunta'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}