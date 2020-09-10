const { Curso, NivelAcademico, Institucion } = require('../config/db');
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
        let curso = await Curso.findByPk(codigo);
        if (curso) {
            console.log('El curso ya existe');
            return res.status(400).json({
                msg: 'El curso ya existe'
            });
        }

        //verifica que la institución sea valida.
        let institucion = await Institucion.findByPk(codigo_institucion);
        if (!institucion) {
            console.log('La institución ingresada no es válida');
            return res.status(400).json({
                msg: 'La institución ingresada no es válida'
            });
        }

        //verifica que el nivel academico sea válido.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            console.log('El nivel academico ingresado no es válido');
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

exports.listarCursos = async(req, res) => {

    try {

        const cursos = await Curso.findAll();
        res.json({
            cursos
        });

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
            console.log('La institución ingresada no es válida');
            return res.status(400).json({
                msg: 'La institución ingresada no es válida'
            });
        }

        //verifica que el nivel academico del curso a actualizar existe.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            return res.status(404).send({
                msg: `El codigo nivel academico ${codigo_nivel_academico} no existe`
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
                         [Sequelize.fn("concat", Sequelize.col("nivel_academico.descripcion"), " ", Sequelize.col("curso.letra")), 'nivel_letra'],
                         'letra',
                         'inactivo'
                        ],
            include: [{
                model: NivelAcademico,
                attributes: ['codigo', 'descripcion'],
                required: true
            }],
             where: { 
                [Op.and]: 
                [ 
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