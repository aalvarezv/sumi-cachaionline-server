const { Modulo, Unidad, NivelAcademico } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.crearModulo = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { codigo, descripcion, codigo_unidad, codigo_nivel_academico, inactivo } = req.body;


        let modulo = await Modulo.findByPk(codigo);
        if (modulo) {
            console.log('El modulo ya existe');
            return res.status(400).json({
                msg: 'El modulo ya existe'
            });
        }

        let unidad = await Unidad.findByPk(codigo_unidad);
        if (!unidad) {
            console.log('El codigo unidad ingresado no es válido');
            return res.status(400).json({
                msg: 'El codigo unidad ingresado no es válido'
            });
        }

        let nivelAcademico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivelAcademico) {
            console.log('El codigo nivel academico ingresado no es válido');
            return res.status(400).json({
                msg: 'El codigo nivel academico ingresado no es válido'
            });
        }

        modulo = await Modulo.create({
            codigo,
            descripcion,
            codigo_unidad,
            codigo_nivel_academico,
            inactivo
        });


        res.json(modulo);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarModulos = async(req, res, next) => {


    try {

        setTimeout( async() => {
        
            const modulos = await Modulo.findAll({

                order: [
                    ['descripcion', 'ASC'],
                ]
            });

            res.model_name = "modulos";
            res.model_data  = modulos;
            
            next();

        }, 500);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.listarModulosDisponiblesCurso = async(req, res, next) => {

    console.log('listarModulosDisponiblesCurso');
    try {

        setTimeout( async() => {
        
            const {descripcion, codigo_curso} = JSON.parse(req.query.filters);
            let {codigo_materia} = JSON.parse(req.query.filters);
            if (codigo_materia === '0') codigo_materia = '';
         
            const modulos = await Modulo.findAll({
                attributes:['codigo', 
                'descripcion',
                [Sequelize.literal(`(SELECT COUNT(*) 
                            FROM cursos_modulos 
                            WHERE codigo_curso = '${codigo_curso}'
                            AND codigo_modulo = modulo.codigo)`),'item_select']
                ],
                include: [{
                    attributes: ['codigo_materia'],
                    model: Unidad,
                    required: true,
                    /*Forma de agregar un and al Join.
                    where: {
                        codigo_materia: {
                          [Op.eq]: codigo_materia
                        }
                    }*/
                }],
                where: { 
                    [Op.and]: [ 
                        { descripcion: {[Op.like]: '%'+descripcion+'%'}},
                        //2 Formas de hacer un where apuntando a la tabla Join.
                        //{ '$unidad.codigo_materia$': {[Op.eq]: codigo_materia}},
                        Sequelize.where( 
                            Sequelize.col("unidad.codigo_materia"), Op.like, '%'+codigo_materia+'%',
                        ),                        
                    ]
                },
                order: [
                    ['descripcion', 'ASC'],
                ]
            });
            
            res.model_name = "modulos";
            res.model_data  = modulos;
            
            next();

        }, 500);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.actualizarModulo = async(req, res) => {

    try {

        const { codigo, descripcion, codigo_unidad, codigo_nivel_academico, inactivo } = req.body;


        let modulo = await Modulo.findByPk(codigo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El módulo ${codigo} no existe`
            })
        }

        let unidad = await Unidad.findByPk(codigo_unidad);
        if (!unidad) {
            return res.status(404).send({
                msg: `La unidad ${codigo_unidad} no existe`
            })
        }

        let nivelAcademico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivelAcademico) {
            return res.status(404).send({
                msg: `El nivel academico ${codigo_nivel_academico} no existe`
            })
        }


        modulo = await Modulo.update({
            descripcion,
            codigo_unidad,
            codigo_nivel_academico,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Módulo actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarModulo = async(req, res) => {

    try {

        const { codigo } = req.params;

        let modulo = await Modulo.findByPk(codigo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El módulo ${codigo} no existe`
            })
        }
        modulo = await Modulo.destroy({
            where: {
                codigo
            }
        });


        res.json({
            msg: 'Módulo eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosModulo = async(req, res) => {

    try {
        const { codigo } = req.params

        const modulo = await Modulo.findByPk(codigo);

        if (!modulo) {
            return res.status(404).send({
                msg: `El módulo ${codigo} no existe`
            })
        }

        res.json({
            modulo
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.busquedaModulos = async(req, res) => {

    try {

        const { filtro } = req.params
        const modulos = await Modulo.findAll({
            include: [{
                model: Unidad,
                attributes: [ ['codigo','codigo_unidad'],'codigo_materia'],
                required: true
            }],
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("modulo.codigo"), Sequelize.col("modulo.descripcion")), {
                [Op.like]: `%${filtro}%`
            })
        });

        res.json({
            modulos
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}