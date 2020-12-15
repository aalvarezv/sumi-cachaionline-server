const { Institucion, Usuario } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearInstitucion = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, descripcion, rut_usuario_rector, rut_usuario_administrador,direccion,email, telefono,
                website ,logo, inactivo } = req.body;

        //verifica que las institucion no existe.
        let institucion = await Institucion.findByPk(codigo);
        if (institucion) {
            console.log('La institución ya existe');
            return res.status(400).json({
                msg: 'La institución ya existe'
            });
        }

        //Verifica que el rut_usuario_rector sea valido y que corresponda a un rector.
        let usuario_rector = await Usuario.findByPk(rut_usuario_rector);
        if (usuario_rector) {
            if (usuario_rector.dataValues.codigo_rol != 4) {
                console.log('El rut ingresado no corresponde a un rector');
                return res.status(400).json({
                    msg: 'El rut ingresado no corresponde a un rector'
                });
            }
        } else {
            console.log('El rector ingresado no es válido');
            return res.status(400).json({
                msg: 'El rector ingresado no es válido'
            });
        }

        //Verifica que el rut_usuario_administrador sea valido y corresponda a un administrador
        let usuario_administrador = await Usuario.findByPk(rut_usuario_administrador);
        if (usuario_administrador) {
            if (usuario_administrador.dataValues.codigo_rol != 5) {
                console.log('El rut ingresado no corresponde a un administrador');
                return res.status(400).json({
                    msg: 'El rut ingresado no corresponde a un administrador'
                });
            }

        } else {
            console.log('El administrador ingresado no es válido');
            return res.status(400).json({
                msg: 'El administrador ingresado no es válido'
            });
        }



        //Guarda la nueva institucion
        institucion = await Institucion.create({
            codigo,
            descripcion,
            rut_usuario_rector,
            rut_usuario_administrador,
            direccion,
            email,
            telefono,
            website,
            logo,
            inactivo
        });

        //envía la respuesta
        res.json(institucion);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.listarInstituciones = async(req, res) => {

    try {

        const instituciones = await Institucion.findAll();
        res.json({
            instituciones
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarInstitucion = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { codigo, descripcion, rut_usuario_rector, rut_usuario_administrador,direccion,email, telefono,
            website ,logo, inactivo } = req.body;

        //verifica que la institucion a actualizar existe.
        let institucion = await Institucion.findByPk(codigo);
        if (!institucion) {
            return res.status(404).send({
                msg: `La institución ${codigo} no existe`
            })
        }

        //actualiza los datos.
        institucion = await Institucion.update({
            descripcion,
            rut_usuario_rector,
            rut_usuario_administrador,
            direccion,
            email,
            telefono,
            website,
            logo,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json(institucion);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarInstitucion = async(req, res) => {

    try {
        //obtengo el codigo del request
        const { codigo } = req.params;
        //verifica que la institucion a actualizar existe.
        let institucion = await Institucion.findByPk(codigo);
        if (!institucion) {
            return res.status(404).send({
                msg: `La institución ${codigo} no existe`
            })
        }
        //elimino el registro.
        institucion = await Institucion.destroy({
            where: {
                codigo
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Institución eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosInstitucion = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { codigo } = req.params
            //consulta por la institucion
        const institucion = await Institucion.findByPk(codigo);
        //si la institucion no existe
        if (!institucion) {
            return res.status(404).send({
                msg: `La institución ${codigo} no existe`
            })
        }
        //envia la información de la institucion
        res.json({
            institucion
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.busquedaInstituciones = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
        console.log(filtro)
            //consulta por la institucion
        const instituciones = await Institucion.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del institucion
        res.json({
            instituciones
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}