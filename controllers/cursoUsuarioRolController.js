const { CursoUsuarioRol, Curso, NivelAcademico, Institucion } = require('../database/db');
const { validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');

exports.crearUsuarioCursoRol = async(req, res) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
       
        const { rut_usuario, codigo_curso, codigo_rol } = req.body;
        
        //Verifica si existe la combinación curso vs usuario
        let curso_usuario = await CursoUsuarioRol.findAll({
            where: {
                codigo_curso,
                rut_usuario,
                codigo_rol
            }
        });

        if (curso_usuario.length > 0) {
            return res.status(400).json({
                msg: 'El usuario ya está asignado al curso'
            });
        }

        //Guarda la nueva relación entre curso, usuario y rol
        curso_usuario = await CursoUsuarioRol.create({
            codigo_curso,
            rut_usuario,
            codigo_rol
        });

        //envía la respuesta
        res.json({
            curso_usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.eliminarUsuarioCursoRol = async(req, res) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { rut_usuario, codigo_curso, codigo_rol } = req.query;

        //Verifica si existe la combinación curso vs usuario.
        let curso_usuario = await CursoUsuarioRol.findAll({
            where: {
                codigo_curso,
                rut_usuario,
                codigo_rol
            }
        });

        if (curso_usuario.length === 0) {
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

//Lista los cursos e indica si el usuario con el rol consultado está inscrito.
exports.listarCursosUsuarioRol = async(req, res) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let { 
            rut_usuario,
            codigo_rol,
            codigo_institucion,
            codigo_nivel_academico,
        } = req.query;

        let filtrosDinamicos = []
        if(codigo_nivel_academico){
            filtrosDinamicos.push({codigo_nivel_academico : { [Op.eq] : codigo_nivel_academico}})
        }

        const cursos = await Curso.findAll({
            attributes: [
                'codigo',
                'letra', 
                [Sequelize.literal(`(SELECT COUNT(*) 
                FROM cursos_usuarios_roles 
                WHERE codigo_curso = curso.codigo
                AND rut_usuario = '${rut_usuario}'
                AND codigo_rol = '${codigo_rol}'
                )`),'inscrito']
            ],
            include:[{
                attributes:['descripcion', 'nivel'],
                model: NivelAcademico,
            },{
                attributes:['codigo','descripcion'],
                model: Institucion
            }],
            where: { 
                [Op.and]:[
                    {codigo_institucion: { [Op.eq] : codigo_institucion}},
                    filtrosDinamicos.map(filtro => filtro),
            ]},
            order: [
                ['nivel_academico','nivel', 'ASC'],
                ['nivel_academico','descripcion','ASC'],
            ]
        });

        res.json({
            cursos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}