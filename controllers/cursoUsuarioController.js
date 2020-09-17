const { CursoUsuario } = require('../config/db');
const { validationResult } = require('express-validator');

exports.agregarUsuarioCurso = async(req, res) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_curso, rut_usuario } = req.body;

        //Verifica si existe la combinación curso vs usuario
        let curso_usuario = await CursoUsuario.findAll({
            where: {
                codigo_curso,
                rut_usuario
            }
        });

        if (curso_usuario.length > 0) {
            console.log('El usuario ya está asignado al curso');
            return res.status(400).json({
                msg: 'El usuario ya está asignado al curos'
            });
        }

        //Guarda la nueva relación entre curso y usuario
        curso_usuario = await CursoUsuario.create({
            codigo_curso,
            rut_usuario
        });

        //envía la respuesta
        res.json(curso_usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.listarUsuarioCurso = async(req, res) => {

    try {

        const { codigo_curso } = req.params;

        const usuarios_curso = await CursoUsuario.findAll({
            attributes: ['rut_usuario'],
            where: {
                codigo_curso
            }
        });

        res.json({
            usuarios_curso
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarUsuarioCurso = async(req, res) => {

    //Si hay errores de la validación
    const { codigo_curso } = req.params;
    const { rut_usuario } = req.query;

    try {
        //Verifica si existe la combinación curso vs usuario.
        let curso_usuario = await CursoUsuario.findAll({
            where: {
                codigo_curso,
                rut_usuario
            }
        });

        if (curso_usuario.length === 0) {
            console.log('El usuario no se encuentra asignado al curso');
            return res.status(400).json({
                msg: 'El usuario no se encuentra asignado al curso'
            });
        }

        //Elimino el registro
        await CursoUsuario.destroy({
            where: {
                codigo_curso,
                rut_usuario
            }
        });

        //Envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario eliminado correctamente del curso'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}