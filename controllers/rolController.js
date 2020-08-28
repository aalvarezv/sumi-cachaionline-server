const { Rol } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearRol = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { codigo, descripcion } = req.body;

        let rol = await Rol.findByPk(codigo);
        if (rol) {
            console.log('El rol ya existe');
            return res.status(400).json({
                msg: 'El rol ya existe'
            });
        }

        rol = await Rol.create({
            codigo,
            descripcion
        });

        res.json(rol);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }
}

exports.listarRoles = async(req, res) => {

    try {
        const rol = await Rol.findAll();
        res.json({
            rol
        });
    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.actualizarRoles = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { codigo, descripcion } = req.body;

        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(400).send({
                msg: `El rol ${codigo} no existe`
            });
        }

        rol = await Rol.update({
            descripcion,
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Rol actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.eliminarRoles = async(req, res) => {

    try {

        const { codigo } = req.params;

        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            });
        }
        rol = await Rol.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: "Rol eliminado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.datosRol = async(req, res) => {

    try {

        const { codigo } = req.params;
        const rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            });
        }

        res.json({
            rol
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.busquedaRoles = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por el usuario
        const roles = await Rol.findAll({

            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del usuario
        res.json({
            roles
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}