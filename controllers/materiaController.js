const {Materia} = require('../config/db');

exports.listarMaterias = (req, res) =>{
   
    res.send({
        msg: 'Lista de materias'
    })
}