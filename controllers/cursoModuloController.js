const { CursoModulo } = require('../database/db');
const { validationResult } = require('express-validator');


exports.crearModuloCurso = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_curso, codigo_modulo } = req.body;

        //verifica si existe la combinación curso vs modulo.
        let curso_modulo = await CursoModulo.findAll({
            where: {
                codigo_curso,
                codigo_modulo
            }
        });

        if (curso_modulo.length > 0) {
            return res.status(400).json({
                msg: 'El módulo ya está asignado al curso'
            });
        }

        //Guarda la nueva relacion entre curso y modulo
        curso_modulo = await CursoModulo.create({
            codigo_curso,
            codigo_modulo,
        });

        //envía la respuesta
        res.json(curso_modulo);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.eliminarModuloCurso = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        //obtengo el codigo del request
        const { codigo_curso } = req.params;
        const { codigo_modulo } = req.query;

        //verifica si existe la combinación curso vs modulo.
        let curso_modulo = await CursoModulo.findAll({
            where: {
                codigo_curso,
                codigo_modulo
            }
        });

        if (curso_modulo.length === 0) {
            return res.status(400).json({
                msg: 'El módulo no se encuentra asignado al curso'
            });
        }

        //elimino el registro.
        await CursoModulo.destroy({
            where: {
                codigo_curso,
                codigo_modulo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Módulo eliminado correctamente del curso'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}