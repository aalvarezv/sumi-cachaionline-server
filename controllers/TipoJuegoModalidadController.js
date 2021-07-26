const { TipoJuegoModalidad, Modalidad } = require('../database/db');
const { validationResult } = require('express-validator');

exports.crearTipoJuegoModalidad = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_tipo_juego, codigo_modalidad } = req.body;

        //verifica si existe la combinación tipo juego vs modalidad.
        let tipo_juego_modalidad = await TipoJuegoModalidad.findAll({
            where: {
                codigo_tipo_juego,
                codigo_modalidad
            }
        });

        if (tipo_juego_modalidad.length > 0) {
            console.log('La modalidad ya está asignada al tipo de juego');
            return res.status(400).json({
                msg: 'La modalidad ya está asignada al tipo de juego'
            });
        }

        //Guarda la nueva relacion entre tipo juego y modalidad.
        tipo_juego_modalidad = await TipoJuegoModalidad.create({
            codigo_tipo_juego,
            codigo_modalidad
        });

        //envía la respuesta
        res.json({tipo_juego_modalidad});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}


exports.listarTipoJuegoModalidad = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {

        const { codigo_tipo_juego } = req.params;
    
        //verifica si existe la combinación ring vs pregunta.
        let tipo_juego_modalidad = await TipoJuegoModalidad.findAll({
            include:[{
                model: Modalidad,
            }],
            where: {
                codigo_tipo_juego
            }
        });

        res.json({
            tipo_juego_modalidad
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}