const { ModuloContenidoTemaConcepto } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearModuloContenidoTemaConepto = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo_contenido_tema } = req.body;

        
        modulo_contenido_tema_concepto = await ModuloContenidoTemaConcepto.create({
            codigo,
            descripcion,
            codigo_modulo_contenido_tema
        });

        //next para pasar a listarContenidosModuloContenidoTemas 
        req.params.codigo_modulo_contenido_tema = codigo_modulo_contenido_tema;
        next();


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidoTemaConceptos = async(req, res) => {

    try {
       
        const { codigo_modulo_contenido_tema } = req.params;

        const modulo_contenido_tema_conceptos = await ModuloContenidoTemaConcepto.findAll({
            where: {
                codigo_modulo_contenido_tema
            }
        });

        res.json({
            modulo_contenido_tema_conceptos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarModuloContenidoTemaConcepto = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const {codigo_modulo_contenido_tema} = req.query;
        const { codigo } = req.params;

        //elimino el registro.
        await ModuloContenidoTemaConcepto.destroy({
            where: {
                codigo
            }
        });

        //next para pasar a listarModuloContenidoTemas
        req.params.codigo_modulo_contenido_tema = codigo_modulo_contenido_tema;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}