const { Curso, Usuario, NivelAcademico, 
        Institucion, CursoUsuarioRol, RingUsuario } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearCurso = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, letra, codigo_institucion, codigo_nivel_academico, inactivo } = req.body;

        //verifica que el curso no existe.
        let curso = await Curso.findAll({
            where:{
                codigo_institucion,
                codigo_nivel_academico,
                letra
            }
        });

        if (curso.length > 0) {
            return res.status(400).json({
                msg: 'El curso ya existe'
            });
        }

        //verifica que la institución sea valida.
        let institucion = await Institucion.findByPk(codigo_institucion);
        if (!institucion) {
            return res.status(400).json({
                msg: 'La institución ingresada no es válida'
            });
        }

        //verifica que el nivel academico sea válido.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            return res.status(400).json({
                msg: 'El nivel academico ingresado no es válido'
            });
        }

        //Guarda el nuevo curso
        curso = await Curso.create({
            codigo,
            letra,
            codigo_institucion,
            codigo_nivel_academico,
            inactivo
        });

        //envía la respuesta
        res.json(curso);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.actualizarCurso = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { codigo, letra, codigo_institucion, codigo_nivel_academico,  inactivo } = req.body;

        //verifica que el curso a actualizar existe.
        let curso = await Curso.findByPk(codigo);
        if (!curso) {
            return res.status(404).send({
                msg: `El curso ${codigo} no existe`
            })
        }

        //verifica que la institución sea valida.
        let institucion = await Institucion.findByPk(codigo_institucion);
        if (!institucion) {
            return res.status(400).json({
                msg: 'La institución ingresada no es válida'
            });
        }

        //verifica que el nivel academico del curso a actualizar existe.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            return res.status(404).send({
                msg: `El código nivel academico ${codigo_nivel_academico} no existe`
            })
        }

        //actualiza los datos.
        curso = await Curso.update({
            letra,
            codigo_institucion,
            codigo_nivel_academico,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json(curso);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarCurso = async(req, res) => {

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;
        //verifica que el curso a actualizar existe.
        let curso = await Curso.findByPk(codigo);
        if (!curso) {
            return res.status(404).send({
                msg: `El curso ${codigo} no existe`
            })
        }

        let curso_usuario_rol = await CursoUsuarioRol.findOne({
            where: {
                codigo_curso : codigo
            }
        })
      
        if (curso_usuario_rol){
            return res.status(404).send({
                msg: `El curso ${codigo} tiene usuarios asociados, no se puede eliminar`
            });
        }

        //elimino el registro.
        curso = await Curso.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Curso eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosCurso = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { codigo } = req.params
            //consulta por el curso
        const curso = await Curso.findByPk(codigo);
        //si el curso no existe
        if (!curso) {
            return res.status(404).send({
                msg: `El curso ${codigo} no existe`
            })
        }
        //envia la información del curso
        res.json({
            curso
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.busquedaCursos = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params;
        const { codigo_institucion } = req.query;
        //consulta los cursos de una institución
        const cursos = await Curso.findAll({
            attributes: ['codigo', 
                         'letra', 
                         'codigo_institucion',
                         'codigo_nivel_academico',
                         [Sequelize.fn("concat", Sequelize.col("nivel_academico.descripcion"), " ", Sequelize.col("curso.letra")), 'nivel_letra'],
                         'inactivo'
                        ],
            include: [{
                model: NivelAcademico,
                attributes: ['codigo', 'descripcion'],
                required: true
            }],
            where: { 
                [Op.and]: [ 
                    Sequelize.where(
                        Sequelize.fn("concat", Sequelize.col("nivel_academico.descripcion"), Sequelize.col("curso.letra")), {[Op.like]: `%${filtro}%`}
                    ), 
                    { codigo_institucion }
                ]
            }
        });
     
        //envia la información del curso
        res.json({
            cursos
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.cursosInstitucionNivelAcademico = async(req, res) => {

    try {

        let { codigo_institucion, codigo_nivel_academico } = req.query;

        let filtros_dinamicos = []

        if(codigo_institucion.trim() !== '0'){
            filtros_dinamicos.push( {codigo_institucion: { [Op.eq] : codigo_institucion}} )
        }

        if(codigo_nivel_academico.trim() !== '0'){
            filtros_dinamicos.push( {codigo_nivel_academico: { [Op.eq] : codigo_nivel_academico}} )
        }

        const cursos = await Curso.findAll({
            include:[{
                attributes:['descripcion', 'nivel'],
                model: NivelAcademico,
            },{
                attributes:['codigo','descripcion'],
                model: Institucion
            }],
            where: { 
                [Op.and]: [
                    filtros_dinamicos.map(filtro => filtro)
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

exports.listarCursosUsuarioNivelAcademicoInstitucion = async(req, res) => {
    
    try{

        const {niveles_academicos, rut_usuario, codigo_institucion} = req.query;
    
        const cursos_usuario_nivel_academico_institucion = await CursoUsuarioRol.findAll({
            attributes: [],
            include: [{
                attributes: ['codigo', 'letra'],
                model: Curso,
                include: [{
                    attributes: ['descripcion'],
                    model: NivelAcademico
                }],
            }],
            where: {
                [Op.and]:[
                    {rut_usuario: rut_usuario},
                    {'$curso.codigo_institucion$': { [Op.eq]: codigo_institucion } },
                    {'$curso.nivel_academico.codigo$': { [Op.in]: niveles_academicos } },
                ]
            },
            raw: true,
            group: ['curso.codigo'],
            
            order: [
                [Curso, NivelAcademico , 'descripcion', 'ASC'],
                [Curso , 'letra', 'ASC'],
            ]
        });

       
        res.json({cursos_usuario_nivel_academico_institucion});
       

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
    

}

//Obtiene los alumnos de un curso y consulta si están asociados a un ring.
exports.listarUsuariosRingCurso = async(req, res) => {

    try{

        const {codigo_curso, codigo_ring} = req.query;

        const usuarios_ring_curso = await CursoUsuarioRol.findAll({
            attributes: ['rut_usuario', 'codigo_rol', 'codigo_curso'],
            include:[{
                attributes: ['rut', 'nombre', 'email'],
                model: Usuario,
                include:[{
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    model: RingUsuario,
                    where:{
                        codigo_ring,
                    },
                    required: false,
                }]
            },{
                attributes: ['codigo', 'letra'],
                model: Curso,
            }],
            
            where: {
                [Op.and]:[
                    {'$curso_usuario_rol.codigo_curso$': { [Op.eq]: codigo_curso } },
                    {'$curso_usuario_rol.codigo_rol$': { [Op.eq]: '2' } },
                    {'$usuario.inactivo$': { [Op.eq]: 0 } },
                ]
            },
            order: [
                [{ model: Usuario }, 'nombre', 'ASC']
            ]
        });

        res.json({usuarios_ring_curso});

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

