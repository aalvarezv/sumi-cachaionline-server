const { NivelAcademico, CursoUsuarioRol, Curso } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.crearNivelAcademico = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo, descripcion, nivel, inactivo } = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (nivelAcademico) {
            return res.status(400).json({
                msg: 'El nivel academico ya existe'
            });
        }

        nivelAcademico = await NivelAcademico.create({
            codigo,
            descripcion,
            nivel,
            inactivo
        });

        res.json(nivelAcademico);

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error'
        });
    }
}

exports.listarNivelesAcademicos = async(req, res) => {

    try {

        const niveles_academicos = await NivelAcademico.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['nivel', 'ASC'],
            ]
        });

        res.json({
            niveles_academicos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.actualizarNivelAcademico = async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo, descripcion, nivel, inactivo } = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (!nivelAcademico) {
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            });
        }

        nivelAcademico = await NivelAcademico.update({
            descripcion,
            nivel,
            inactivo
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Nivel academico actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.eliminarNivelAcademico = async(req, res) => {

    try {

        const { codigo } = req.params;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (!nivelAcademico) {
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            });
        }

        //verifica que no se encuentre asociado a un curso.
        let nivel_academico_cursos = await Curso.findOne({
            where: {
                codigo_nivel_academico: codigo
            }
        })

        if (nivel_academico_cursos) {
            return res.status(404).send({
                msg: 'El nivel academico tiene cursos asociados, no se puede eliminar'
            });
        }

        nivelAcademico = await NivelAcademico.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Nivel academico eliminado exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.datosNivelAcademico = async(req, res) => {

    try {
        const { codigo } = req.params;

        const nivelAcademico = await NivelAcademico.findByPk(codigo);

        if (!nivelAcademico) {
            return res.satus(404).send({
                msg: `El nivel academico ${codigo} no existe`
            });
        }

        res.json({
            nivelAcademico
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.busquedaNivelesAcademicos = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.query;
            //consulta por el usuario
        const nivelesAcademicos = await NivelAcademico.findAll({
            where: 
                Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {[Op.like]: `%${filtro}%`}),
                order: [
                    ['nivel', 'ASC'],
                ]
        });

        //envia la información del usuario
        res.json({
            nivelesAcademicos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }


}

exports.listarNivelesAcademicosUsuarioInstitucion = async(req, res) =>{

    try{

        const {rut_usuario, codigo_institucion} = req.query;
 
        const niveles_academicos_usuario_institucion = await CursoUsuarioRol.findAll({
            attributes: [],
            include: [{
                attributes:['codigo_institucion'],
                model: Curso,
                include: [{
                    attributes:['codigo', 'descripcion'],
                    model: NivelAcademico,
                }]   
            }],
            where: {
                [Op.and]:[
                    {rut_usuario: rut_usuario},
                    {'$curso.codigo_institucion$': { [Op.eq]: codigo_institucion } }
                ]
            },
            raw: true,
            group: ['curso.nivel_academico.codigo']
        });

        res.json({
            niveles_academicos_usuario_institucion
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
   
}
