const { Ring, Usuario, sequelize } = require('../config/db');
const { Sequelize, Op, QueryTypes } = require('sequelize');
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.crearRing = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const {
            codigo,
            nombre,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            rut_usuario_creador,
            inactivo
        } = req.body;

        //verifica que el ring no existe.
        let ring = await Ring.findByPk(codigo);
        if (ring) {
            console.log('El ring ya existe');
            return res.status(400).json({
                msg: 'El ring ya existe'
            });
        }

        //verifica que el usuario sea válido.
        let usuario = await Usuario.findByPk(rut_usuario_creador);
        if (!usuario) {
            console.log('El usuario ingresado no es válido');
            return res.status(400).json({
                msg: 'El usuario ingresado no es válido'
            });
        }


        //Guarda el nuevo ring
        ring = await Ring.create({
            codigo,
            nombre,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            rut_usuario_creador,
            inactivo
        });

        //envía la respuesta
        res.json(ring);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarRings = async(req, res, next) => {

    try {
        const ring = await Ring.findAll();

        res.json({
            ring
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.actualizarRing = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let {
            codigo,
            nombre,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            rut_usuario_creador,
            inactivo
        } = req.body;

        //verifica que el ring a actualizar existe.
        let ring = await Ring.findByPk(codigo);
        if (!ring) {
            return res.status(404).send({
                msg: `El ring ${codigo} no existe`
            })
        }

        //verifica que el usuario del ring a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //actualiza los datos.
        ring = await Ring.update({
            nombre,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            rut_usuario_creador,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json(ring);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarRing = async(req, res) => {

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;
        //verifica que el ring a actualizar existe.
        let ring = await Ring.findByPk(codigo);
        if (!ring) {
            return res.status(404).send({
                msg: `El ring ${codigo} no existe`
            })
        }
        //elimino el registro.
        ring = await Ring.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Ring eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosRing = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { codigo } = req.params
            //consulta por el ring
        const ring = await Ring.findByPk(codigo);
        //si el ring no existe
        if (!ring) {
            return res.status(404).send({
                msg: `El ring ${codigo} no existe`
            })
        }
        //envia la información del ring
        res.json({
            ring
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.busquedaRings = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por el ring
        const ring = await Ring.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del ring
        res.json({
            ring
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}