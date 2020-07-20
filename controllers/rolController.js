const {Rol} = require('../config/db');

exports.listarRoles = (req, res) =>{

    res.send({
        msg: 'Lista de roles'
    })
}