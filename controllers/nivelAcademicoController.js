const { NivelAcademico } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');



exports.crearNivelAcademico = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, descripcion, nivel } = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (nivelAcademico) {
            console.log('El nivel academico ya existe');
            return res.status(400).json({
                msg: 'El nivel academico ya existe'
            });
        }

        nivelAcademico = await NivelAcademico.create({
            codigo,
            descripcion,
            nivel
        });

        res.json(nivelAcademico)

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error'
        })
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
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, descripcion, nivel } = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (!nivelAcademico) {
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
        }

        nivelAcademico = await NivelAcademico.update({
            descripcion,
            nivel
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Nivel academico actualizado existosamente"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarNivelAcademico = async(req, res) => {

    try {
        const { codigo } = req.params;
        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if (!nivelAcademico) {
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
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
        })
    }
}

exports.datosNivelAcademico = async(req, res) => {

    try {
        const { codigo } = req.params

        const nivelAcademico = await NivelAcademico.findByPk(codigo);

        if (!nivelAcademico) {
            return res.satus(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
        }
        res.json({
            nivelAcademico
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.busquedaNivelesAcademicos = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por el usuario
        const nivelesAcademicos = await NivelAcademico.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del usuario
        res.json({
            nivelesAcademicos
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}