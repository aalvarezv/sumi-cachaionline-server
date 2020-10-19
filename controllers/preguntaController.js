const { Pregunta, Modulo } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.crearPregunta = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const {
            codigo,
            texto,
            imagen,
            audio,
            video,
        } = req.body;


        let pregunta = await Pregunta.findByPk(codigo);
        if (pregunta) {
            console.log('La pregunta ya existe');
            return res.status(400).json({
                msg: 'La pregunta ya existe'
            });
        }

        pregunta = await Pregunta.create({
            codigo,
            texto,
            imagen,
            audio,
            video,
        });

        res.json({
            pregunta
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarPreguntas = async(req, res) => {

    try {

        const pregunta = await Pregunta.findAll();
        res.json({
            pregunta
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarPregunta = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const {
            codigo,
            pregunta_texto,
            pregunta_imagen,
            pregunta_audio,
            pregunta_video,
            respuesta_texto,
            respuesta_imagen,
            respuesta_audio,
            respuesta_video,
            codigo_modulo
        } = req.body;


        let pregunta = await Pregunta.findByPk(codigo);
        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }

        let modulo = await Modulo.findByPk(codigo_modulo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El módulo ${codigo_modulo} no existe`
            })
        }


        pregunta = await Pregunta.update({
            pregunta_texto,
            pregunta_imagen,
            pregunta_audio,
            pregunta_video,
            respuesta_texto,
            respuesta_imagen,
            respuesta_audio,
            respuesta_video,
            codigo_modulo
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Pregunta actualizada exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarPregunta = async(req, res) => {

    try {

        const { codigo } = req.params;

        let pregunta = await Pregunta.findByPk(codigo);
        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }
        pregunta = await Pregunta.destroy({
            where: {
                codigo
            }
        });


        res.json({
            msg: 'Pregunta eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosPreguntas = async(req, res) => {

    try {
        const { codigo } = req.params

        const pregunta = await Pregunta.findByPk(codigo);

        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }

        res.json({
            pregunta
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.busquedaPreguntas = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por el usuario
        const preguntas = await Pregunta.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("pregunta_texto")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del usuario
        res.json({
            preguntas
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}