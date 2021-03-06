const { Unidad, Materia, Modulo } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearUnidad = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        const { codigo, descripcion, codigo_materia, inactivo } = req.body;

        let unidad = await Unidad.findByPk(codigo);
        if (unidad) {
            return res.status(400).json({
                msg: 'La unidad ya existe'
            });
        }

        let materia = await Materia.findByPk(codigo_materia);
        if (!materia) {
            return res.status(400).json({
                msg: 'la materia ingresada no es valida'
            });
        }

        unidad = await Unidad.create({
            codigo,
            descripcion,
            codigo_materia,
            inactivo
        });

        res.json(unidad);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }
}

exports.listarUnidades = async(req, res, next) => {

    try {
        const unidades = await Unidad.findAll();

        res.json({
            unidades
        })

    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.actualizarUnidades = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        const { codigo, descripcion, codigo_materia, inactivo } = req.body;

        let unidad = await Unidad.findByPk(codigo);
        if (!unidad) {
            return res.status(400).send({
                msg: `La unidad ${codigo} no existe`
            });
        }

        let materia = await Materia.findByPk(codigo_materia);
        if (!materia) {
            return res.status(400).send({
                msg: `La materia ${codigo_materia} no existe`
            });
        }

        unidad = await Unidad.update({
            descripcion,
            codigo_materia,
            inactivo
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Unidad actualizada exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.eliminarUnidades = async(req, res) => {

    try {

        const { codigo } = req.params;

        let unidad = await Unidad.findByPk(codigo);
        if (!unidad) {
            return res.status(404).send({
                msg: `La unidad ${codigo} no existe`
            });
        }

        let modulos_unidad = await Modulo.findOne({
            where:{
                codigo_unidad : codigo
            }
        })
        
        if (modulos_unidad){
            return res.status(404).send({
                msg: `La unidad ${codigo} tiene modulos asociados, no se puede eliminar`
            });
        }

        unidad = await Unidad.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: "Unidad eliminada correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.datosUnidad = async(req, res) => {

    try {

        const { codigo } = req.params;
        const unidad = await Unidad.findByPk(codigo);
        if (!unidad) {
            return res.status(404).send({
                msg: `La unidad ${codigo} no existe`
            });
        }

        res.json({
            unidad
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.unidadesMateria = async(req, res) => {

    try {

        let { codigo_materia } = req.params;

        if(codigo_materia.trim() === '0'){
            codigo_materia = ''
        }

        const unidades = await Unidad.findAll({
            where: {
                codigo_materia: {
                    [Op.like] : `%${codigo_materia}%`
                },
                inactivo: false
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

        if (!unidades) {
            return res.status(404).send({
                msg: `La materia ${codigo_materia} no tiene unidades asociadas`
            });
        }

        res.json({
            unidades
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.unidadesPorDescripcionyMateria = async(req, res) => {

    try {

        let { codigo_materia, descripcion } = req.query;

        if(codigo_materia.trim() === '0'){
            codigo_materia = ''
        }

        const unidades = await Unidad.findAll({
            where: { [Op.and]: [
                {codigo_materia: { [Op.like] : `%${codigo_materia}%`}},
                {descripcion: { [Op.like] : `%${descripcion}%` }},
            ]},
            order: [
                ['descripcion', 'ASC']
            ]
        });

        res.json({
            unidades
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.unidadesMateriaNivelAcademico = async(req, res) => {

    try {

        const { codigo_materia, niveles_academicos } = req.query;

        if (!niveles_academicos || niveles_academicos.length === 0) {
            return res.json({
                unidades: []
            });
        }

        const unidades = await Unidad.findAll({
            include: [{
                model: Modulo,
                where: {
                    codigo_nivel_academico: niveles_academicos
                },
                //required:false
            }],
            where: {
                codigo_materia,
                inactivo: false
            },
            order: [
                ['descripcion', 'ASC'],
                [{ model: Modulo }, 'descripcion', 'ASC']
            ]
        });

        res.json({
            unidades
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.busquedaUnidades = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por la unidad
        const unidades = await Unidad.findAll({
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información de la unidad
        res.json({
            unidades
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}