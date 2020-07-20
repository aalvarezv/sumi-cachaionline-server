const {NivelAcademico} = require('../config/db');

exports.nivelAcademico = (req, res) => {

    res.send({
        msg: 'Nivel intermedio'
    })

}