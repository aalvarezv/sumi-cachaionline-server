const { ModuloContenidoTema } = require('../config/db');
const { validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');

exports.crearModuloContenidoTema = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo_contenido } = req.body;

        
        modulo_contenido_tema = await ModuloContenidoTema.create({
            codigo,
            descripcion,
            codigo_modulo_contenido
        });

        //next para pasar a listarContenidosModuloContenidos 
        req.params.codigo_modulo_contenido = codigo_modulo_contenido;
        next();


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidoTemas = async(req, res) => {

    try {
       
        const { codigo_modulo_contenido } = req.params;

        const modulo_contenido_temas = await ModuloContenidoTema.findAll({
            where: {
                codigo_modulo_contenido
            },order:[
                ['descripcion', 'ASC'],
            ]
        });

        res.json({
            modulo_contenido_temas
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarModuloContenidoTema = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const {codigo_modulo_contenido} = req.query;
        const { codigo } = req.params;

        //elimino el registro.
        await ModuloContenidoTema.destroy({
            where: {
                codigo
            }
        });

        //next para pasar a listarModuloContenidoTemas
        req.params.codigo_modulo_contenido = codigo_modulo_contenido;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}