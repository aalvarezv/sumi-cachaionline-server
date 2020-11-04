const { ModuloContenido } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearContenidoModulo = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo } = req.body;

        //Guarda la nueva relacion entre curso y modulo
        modulo_contenido = await ModuloContenido.create({
            codigo,
            descripcion,
            codigo_modulo
        });

        //next para pasar a listarContenidosModulo 
        req.params.codigo_modulo = codigo_modulo;
        next();


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarContenidosModulo = async(req, res) => {

    try {
       
        const { codigo_modulo } = req.params;

        const modulo_contenidos = await ModuloContenido.findAll({
            where: {
                codigo_modulo
            }
        });

        res.json({
            modulo_contenidos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarContenidoModulo = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const {codigo_modulo} = req.query;
        const { codigo } = req.params;

        //elimino el registro.
        await ModuloContenido.destroy({
            where: {
                codigo
            }
        });

        //next para pasar a listarPropiedadesModulo 
        req.params.codigo_modulo = codigo_modulo;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}