const { ModuloContenidoTemaConcepto, ModuloContenidoTema, ModuloContenido, Modulo, Unidad, PreguntaModuloContenidoTemaConcepto } = require('../database/db');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');


exports.crearModuloContenidoTemaConcepto = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo_contenido_tema } = req.body;

        //revisa si existe el tema
        let tema = await ModuloContenidoTema.findByPk(codigo_modulo_contenido_tema);
        if (!tema) {
            return res.status(404).send({
                msg: `El tema ${codigo_modulo_contenido_tema} no existe`
            })
        }

        const modulo_contenido_tema_concepto = await ModuloContenidoTemaConcepto.create({
            codigo,
            descripcion,
            codigo_modulo_contenido_tema
        });

        res.json({
            modulo_contenido_tema_concepto,
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidoTemaConceptos = async(req, res) => {

    try {
       
        const { codigo_modulo_contenido_tema } = req.params;

        const modulo_contenido_tema_conceptos = await ModuloContenidoTemaConcepto.findAll({
            where: {
                codigo_modulo_contenido_tema
            }
        });

        res.json({
            modulo_contenido_tema_conceptos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarModuloContenidoTemaConcepto = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { codigo, descripcion, codigo_modulo_contenido_tema, inactivo } = req.body;

        let concepto = await ModuloContenidoTemaConcepto.findByPk(codigo);
        if (!concepto) {
            return res.status(404).send({
                msg: `El concepto ${codigo} no existe`
            })
        }

        let tema = await ModuloContenidoTema.findByPk(codigo_modulo_contenido_tema);
        if (!tema) {
            return res.status(404).send({
                msg: `El tema ${codigo_modulo_contenido_tema} no existe`
            })
        }

        concepto = await ModuloContenidoTemaConcepto.update({
            descripcion,
            codigo_modulo_contenido_tema,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Concepto actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarModuloContenidoTemaConcepto = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const { codigo } = req.params;

        //revisa si existe el concepto
        let concepto = await ModuloContenidoTemaConcepto.findByPk(codigo);
        if (!concepto) {
            return res.status(404).send({
                msg: `El concepto ${codigo} no existe`
            })
        }

        //revisa si tiene preguntas asociadas.
        let preguntas_concepto = await PreguntaModuloContenidoTemaConcepto.findOne({
            where:{
                codigo_modulo_contenido_tema_concepto : codigo
            }
        })

        if (preguntas_concepto){
            return res.status(404).send({
                msg: `El concepto ${codigo} tiene preguntas asociadas, no se puede eliminar`
            });
        }

        //elimino el registro.
        await ModuloContenidoTemaConcepto.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Concepto eliminado exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.conceptosPorDescripcionTemaContenidoModuloUnidadyMateria = async(req, res) => {

    try {

        let { codigo_modulo_contenido_tema, codigo_modulo_contenido,
            codigo_modulo, codigo_unidad, codigo_materia, descripcion } = req.query;
            
        if(codigo_modulo_contenido_tema.trim() === '0'){
            codigo_modulo_contenido_tema = ''
        }

        if(codigo_modulo_contenido.trim() === '0'){
            codigo_modulo_contenido = ''
        }
        
        if(codigo_modulo.trim() === '0'){
            codigo_modulo = ''
        }
        
        if(codigo_unidad.trim() === '0'){
            codigo_unidad = ''
        }

        if(codigo_materia.trim() === '0'){
            codigo_materia = ''
        }

        const conceptos = await ModuloContenidoTemaConcepto.findAll({
            include:[{
                attributes: ['codigo', 'descripcion', 'codigo_modulo_contenido'],
                model: ModuloContenidoTema,
                include: [{
                    attributes: ['codigo', 'descripcion', 'codigo_modulo'],
                    model: ModuloContenido,
                    include: [{
                        attributes: ['codigo', 'descripcion', 'codigo_unidad'],
                        model: Modulo,
                        include: [{
                            attributes: ['codigo', 'descripcion', 'codigo_materia'],
                            model: Unidad
                        }]
                    }]
                }]
            }],
            where: {
              [Op.and]:[
                    { descripcion: { [Op.like] : `%${descripcion}%`} },
                    { codigo_modulo_contenido_tema: { [Op.like] : `%${codigo_modulo_contenido_tema}%`} },
                    {'$modulo_contenido_tema.codigo_modulo_contenido$': { [Op.like]: `%${codigo_modulo_contenido}%` } },
                    {'$modulo_contenido_tema.modulo_contenido.codigo_modulo$': { [Op.like]: `%${codigo_modulo}%` } },
                    {'$modulo_contenido_tema.modulo_contenido.modulo.codigo_unidad$': { [Op.like]: `%${codigo_unidad}%` } },
                    {'$modulo_contenido_tema.modulo_contenido.modulo.unidad.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } }
                ]
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

        res.json({
            conceptos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}