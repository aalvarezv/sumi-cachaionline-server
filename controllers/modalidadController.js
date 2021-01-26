const { Modalidad, } = require ('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearModalidad = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { codigo, descripcion, inactivo } = req.body;

        let modalidad = await Modalidad.findByPk(codigo);
        if (modalidad) {
            console.log('La modalidad ya existe');
            return res.status(400).json({
                msg: 'La modalidad ya existe'
            });
        }

        modalidad = await Modalidad.create({
            codigo,
            descripcion,
            inactivo
        });

        res.json(modalidad);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }
}

exports.listarModalidades = async(req, res) => {

    try {
        const modalidades = await Modalidad.findAll({
            where: {
                inactivo: false
            },
            order: [
                ['codigo', 'ASC'],
            ]
        }); 

        res.json({
            modalidades
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}


exports.busquedaModalidad = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
        //consulta por la modalidad
        const modalidades = await Modalidad.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información de la modalidad
        res.json({
            modalidades
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}
