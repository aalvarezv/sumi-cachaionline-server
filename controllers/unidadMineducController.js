const { UnidadMineduc, Curso } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');



exports.listarUnidadesMineducNivelAcademico = async(req, res) => {

    try {

        const { codigoNivelAcademico } = req.params;

        const unidadesMineduc = await UnidadMineduc.findAll({
            where: {
                codigo_nivel_academico: codigoNivelAcademico
            }
        });

        res.json({
            unidadesMineduc
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.listarUnidadesMineducCurso = async(req, res) => {

    try{

        const { codigo_curso } = req.query;

        const cursos = await Curso.findByPk(codigo_curso)
        const codigoNivelAcademico = cursos.codigo_nivel_academico

        const unidadesMineduc = await UnidadMineduc.findAll({
            where: {
                codigo_nivel_academico: codigoNivelAcademico
            }
        });

        res.json({
            unidadesMineduc
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }

     
}
