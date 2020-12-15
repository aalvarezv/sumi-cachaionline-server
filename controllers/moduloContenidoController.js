const { ModuloContenido, Modulo } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearModuloContenido = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo, inactivo } = req.body;

        //Guarda la nueva relacion entre contenido y modulo
        modulo_contenido = await ModuloContenido.create({
            codigo,
            descripcion,
            codigo_modulo,
            inactivo
        });

        res.json(modulo_contenido)


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidos = async(req, res) => {

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

exports.eliminarModuloContenido = async(req, res, next) => {

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

        //next para pasar a listarModuloContenidos
        req.params.codigo_modulo = codigo_modulo;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

