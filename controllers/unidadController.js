const {Unidad} = require('../config/db');

exports.listarUnidades = (req, res) =>{

    res.send({
        msg:'Lista de usuarios'
    })
}