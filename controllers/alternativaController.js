const {Alternativa} = require('../config/db');

exports.listarAlternativas = (req, res) =>{

    res.send({
        msg: 'Lista de alternativas'
    })
}