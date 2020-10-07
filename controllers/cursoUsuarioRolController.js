const { CursoUsuarioRol } = require('../config/db');
const { validationResult } = require('express-validator');

exports.crearUsuarioCursoRol = async(req, res) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo_curso, rut_usuario, codigo_rol } = req.body;

        //Verifica si existe la combinación curso vs usuario
        let curso_usuario = await CursoUsuarioRol.findAll({
            where: {
                codigo_curso,
                rut_usuario,
                codigo_rol
            }
        });

        if (curso_usuario.length > 0) {
            console.log('El usuario ya está asignado al curso');
            return res.status(400).json({
                msg: 'El usuario ya está asignado al curos'
            });
        }

        //Guarda la nueva relación entre curso, usuario y rol
        curso_usuario = await CursoUsuarioRol.create({
            codigo_curso,
            rut_usuario,
            codigo_rol
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

exports.eliminarUsuarioCursoRol = async(req, res) => {

    //Si hay errores de la validación
    const { codigo_curso } = req.params;
    const { rut_usuario, codigo_rol } = req.query;

    try {
        //Verifica si existe la combinación curso vs usuario.
        let curso_usuario = await CursoUsuarioRol.findAll({
            where: {
                codigo_curso,
                rut_usuario,
                codigo_rol
            }
        });

        if (curso_usuario.length === 0) {
            console.log('El usuario no se encuentra asignado al curso');
            return res.status(400).json({
                msg: 'El usuario no se encuentra asignado al curso'
            });
        }

        //Elimino el registro
        await CursoUsuarioRol.destroy({
            where: {
                codigo_curso,
                rut_usuario,
                codigo_rol
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