const { Materia } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearMateria = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, nombre, descripcion, inactivo } = req.body;

        let materia = await Materia.findByPk(codigo);
        if (materia) {
            console.log('La materia ya existe');
            return res.status(400).json({
                msg: 'La materia ya existe'
            });
        }

        materia = await Materia.create({
            codigo,
            nombre,
            descripcion,
            inactivo
        });

        res.json(materia)

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error'
        })
    }
}

exports.listarMaterias = async(req, res) => {

    try {
        const materias = await Materia.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['nombre', 'ASC'],
            ]
        });

        res.json({
            materias
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.actualizarMaterias = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, nombre, descripcion, inactivo } = req.body;

        let materia = await Materia.findByPk(codigo);
        if (!materia) {
            return res.status(404).send({
                msg: `La materia ${codigo} no existe`
            });
        }

        materia = await Materia.update({
            nombre,
            descripcion,
            inactivo
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Materia actualizada existosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.eliminarMaterias = async(req, res) => {

    try {

        const { codigo } = req.params;
        let materia = await Materia.findByPk(codigo);

        if (!materia) {
            return res.status(404).send({
                msg: `La materia ${codigo} no existe`
            });
        }

        materia = await Materia.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Materia eliminada exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.datosMaterias = async(req, res) => {

    try {
        const { codigo } = req.params;

        const materia = await Materia.findByPk(codigo);

        if (!materia) {
            return res.satus(404).send({
                msg: `La materia ${codigo} no existe`
            });
        }
        res.json({
            materia
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.busquedaMaterias = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por la materia
        const materias = await Materia.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("nombre")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información de la materia
        res.json({
            materias
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}