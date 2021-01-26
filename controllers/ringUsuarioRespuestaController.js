const { RingUsuarioRespuesta, Ring, Usuario, Pregunta } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearRingUsuarioRespuesta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo_ring, rut_usuario, codigo_pregunta, correcta, erronea, omitida,inactivo } = req.body;

        ring_usuario_respuesta = await RingUsuarioRespuesta.create({
            codigo_ring,
            rut_usuario,
            codigo_pregunta,
            correcta,
            erronea,
            omitida,
            inactivo
        });

        res.json(ring_usuario_respuesta);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}
