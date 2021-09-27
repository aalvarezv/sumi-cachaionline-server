const { 
    Unidad, 
    Modulo, 
    ModuloContenido,
    ModuloContenidoTema, 
    ModuloContenidoTemaConcepto,
 } = require('../database/db');

const { Op } = require('sequelize');



exports.unidadesMaterias = async(req, res) => {

    try {

        let { array_materias } = req.query;

        const unidades = await Unidad.findAll({
            where: {
                [Op.and]:[
                    {codigo_materia: {[Op.in]: array_materias }},
                    {inactivo: {[Op.eq]: false}}
                ]
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

exports.modulosUnidades = async(req, res) => {

    try {

        let { array_unidades } = req.query;

        const modulos = await Modulo.findAll({
            where:{
                [Op.and]:[
                    {codigo_unidad: {[Op.in]: array_unidades }},
                    {inactivo: {[Op.eq]: false}}
                ]
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

        if (!modulos) {
            return res.status(404).send({
                msg: `La unidad ${codigo_unidad} no tiene módulos asociados`
            });
        }

        res.json({
            modulos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.modulosContenidos = async(req, res) => {

    try {
       
        let { array_modulos } = req.query;

        const contenidos = await ModuloContenido.findAll({
            where: {
                codigo_modulo: {
                    [Op.in] : array_modulos
                }
            }
        });

        res.json({
            contenidos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.modulosContenidosTemas = async(req, res) => {

    try {
       
        let { array_contenidos } = req.query;

        const temas = await ModuloContenidoTema.findAll({
            where: {
                codigo_modulo_contenido: {
                    [Op.in] : array_contenidos
                }
            },order:[
                ['descripcion', 'ASC'],
            ]
        });

        res.json({
            temas
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.modulosContenidosTemasConceptos = async(req, res) => {

    try {
       
        let { array_temas } = req.query;

        const conceptos = await ModuloContenidoTemaConcepto.findAll({
            where: {
                codigo_modulo_contenido_tema: {
                    [Op.in] : array_temas
                }
            }
        });

        res.json({
            conceptos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}