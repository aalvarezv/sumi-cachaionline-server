const {Usuario} = require('../config/db');


exports.listarUsuarios = (req, res) => {

    res.send({
        msg: 'Lista de usuarios'
    })
}

