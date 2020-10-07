const { ModuloPropiedad } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearPropiedadModulo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, codigo_modulo } = req.body;

        //Guarda la nueva relacion entre curso y modulo
        modulo_propiedad = await ModuloPropiedad.create({
            codigo,
            codigo_modulo,
        });

        //envía la respuesta
        res.json(modulo_propiedad);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.eliminarPropiedadModulo = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const { codigo } = req.params;

        //elimino el registro.
        await ModuloPropiedad.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Propiedad eliminada correctamente del módulo'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}