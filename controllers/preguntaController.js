const {Pregunta} = require('../config/db');

exports.listarPreguntas = (req, res) =>{
    
    res.send({
        msg: 'Listado de preguntas'
    })
}