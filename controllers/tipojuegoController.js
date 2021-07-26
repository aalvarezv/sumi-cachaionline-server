const { TipoJuego} = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearTipoJuego = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo, descripcion, inactivo } = req.body;

        let tipo_juego = await TipoJuego.findByPk(codigo);
        if (tipo_juego) {
            return res.status(400).json({
                msg: 'El tipo de juego ya existe'
            });
        }

        tipo_juego = await TipoJuego.create({
            codigo,
            descripcion,
            inactivo
        });

        res.json(tipo_juego)

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarTipoJuego = async(req, res) => {

    try {
        const tipo_juegos = await TipoJuego.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['codigo', 'ASC'],
            ]
        });

        res.json({
            tipo_juegos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.actualizarTipoJuego = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo, descripcion, inactivo } = req.body;

        let tipo_juego = await TipoJuego.findByPk(codigo);
        if (!tipo_juego) {
            return res.status(404).send({
                msg: `El tipo de juego ${codigo} no existe`
            });
        }

        tipo_juego = await TipoJuego.update({
            descripcion,
            inactivo,
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Tipo de juego actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.eliminarTipoJuego = async(req, res) => {

    try {

        const { codigo } = req.params;
        let tipo_juego = await TipoJuego.findByPk(codigo);

        if (!tipo_juego) {
            return res.status(404).send({
                msg: `El tipo de juego ${codigo} no existe`
            });
        }

        tipo_juego = await TipoJuego.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Tipo de juego eliminado exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}