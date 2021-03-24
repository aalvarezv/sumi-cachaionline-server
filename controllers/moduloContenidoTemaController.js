const { ModuloContenidoTema, ModuloContenido, Modulo, Unidad, ModuloContenidoTemaConcepto, PreguntaModuloContenidoTema } = require('../database/db');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.crearModuloContenidoTema = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo_contenido } = req.body;

        let contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo_modulo_contenido} no existe`
            })
        }

        const modulo_contenido_tema = await ModuloContenidoTema.create({
            codigo,
            descripcion,
            codigo_modulo_contenido
        });

        res.json({
            modulo_contenido_tema,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidoTemas = async(req, res) => {

    try {
       
        const { codigo_modulo_contenido } = req.params;

        const modulo_contenido_temas = await ModuloContenidoTema.findAll({
            where: {
                codigo_modulo_contenido
            },order:[
                ['descripcion', 'ASC'],
            ]
        });

        res.json({
            modulo_contenido_temas
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarModuloContenidoTema = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        
        const { codigo, descripcion, codigo_modulo_contenido, inactivo } = req.body;

        let tema = await ModuloContenidoTema.findByPk(codigo);
        if (!tema) {
            return res.status(404).send({
                msg: `El tema ${codigo} no existe`
            })
        }

        let contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo_modulo_contenido} no existe`
            })
        }

        tema = await ModuloContenidoTema.update({
            descripcion,
            codigo_modulo_contenido,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Tema actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarModuloContenidoTema = async(req, res) => {


    try {
        
        //obtengo el codigo del request
        const { codigo } = req.params;

        //revisa si existe el tema
        let tema = await ModuloContenidoTema.findByPk(codigo);
        if (!tema) {
            return res.status(404).send({
                msg: `El tema ${codigo} no existe`
            })
        }

        //revisa si tiene conceptos asociados
        let conceptos_tema = await ModuloContenidoTemaConcepto.findOne({
            where:{
                codigo_modulo_contenido_tema : codigo
            }
        })

        if (conceptos_tema){
            return res.status(404).send({
                msg: `El tema ${codigo} tiene conceptos asociados, no se puede eliminar`
            });
        }

        //revisa si tiene preguntas asociadas
        let preguntas_tema = await PreguntaModuloContenidoTema.findOne({
            where:{
                codigo_modulo_contenido_tema : codigo
            }
        })

        if (preguntas_tema){
            return res.status(404).send({
                msg: `El tema ${codigo} tiene preguntas asociadas, no se puede eliminar`
            });
        }

        //elimino el registro.
        await ModuloContenidoTema.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Tema eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.temaPorDescripcionContenidoModuloUnidadyMateria = async(req, res) => {

    try {

        let { codigo_modulo_contenido, codigo_modulo, 
                codigo_unidad, codigo_materia, descripcion } = req.query;

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

        const contenido_tema = await ModuloContenidoTema.findAll({
           
            include:[{
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
            }],
            where: {
                [Op.and]:[
                    { descripcion: { [Op.like] : `%${descripcion}%`} },
                    { codigo_modulo_contenido: { [Op.like] : `%${codigo_modulo_contenido}%`} },
                    {'$modulo_contenido.codigo_modulo$': { [Op.like]: `%${codigo_modulo}%` } },
                    {'$modulo_contenido.modulo.codigo_unidad$': { [Op.like]: `%${codigo_unidad}%` } },
                    {'$modulo_contenido.modulo.unidad.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } },
                ]
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

        /*
        if (!contenido_tema) {
            return res.status(404).send({
                msg: `El tema ${codigo_modulo_contenido} no tiene contenidos asociados`
            });
        }*/

        res.json({
            contenido_tema
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}