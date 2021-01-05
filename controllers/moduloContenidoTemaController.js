const { ModuloContenidoTema, ModuloContenido, Modulo, Unidad, Materia, ModuloContenidoTemaConcepto } = require('../config/db');
const { validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');

exports.crearModuloContenidoTema = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo_contenido } = req.body;

        
        modulo_contenido_tema = await ModuloContenidoTema.create({
            codigo,
            descripcion,
            codigo_modulo_contenido
        });

        //next para pasar a listarContenidosModuloContenidos 
        req.params.codigo_modulo_contenido = codigo_modulo_contenido;
        next();


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
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { codigo, descripcion, codigo_modulo_contenido, inactivo } = req.body;

        let tema = await ModuloContenidoTema.findByPk(codigo);
        if (!tema) {
            return res.status(404).send({
                msg: `El tema ${codigo} no existe`
            })
        }

        /* let contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo_modulo_contenido} no existe`
            })
        } */

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

exports.eliminarModuloContenidoTema = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

        //revisa si el tema tiene conceptos asociados
        let conceptos_tema = await ModuloContenidoTemaConcepto.findAll({
            where:{
                codigo_modulo_contenido_tema : codigo
            }
        })
        if (conceptos_tema){
            return res.status(404).send({
                msg: `El tema ${codigo} tiene conceptos asociados, no se puede eliminar`
            });
        }

        //elimino el registro.
        await ModuloContenidoTema.destroy({
            where: {
                codigo
            }
        });

        //next para pasar a listarModuloContenidoTemas
        req.params.codigo_modulo_contenido = codigo_modulo_contenido;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.temaContenido = async(req, res) => {

    try {

        let { codigo_modulo_contenido, codigo_modulo, codigo_unidad, codigo_materia } = req.params;
        console.log('EJecutando')
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
                    { codigo_modulo_contenido: { [Op.like] : `%${codigo_modulo_contenido}%`} },
                    {'$modulo_contenido.codigo_modulo$': { [Op.like]: `%${codigo_modulo}%` } },
                    {'$modulo_contenido.modulo.codigo_unidad$': { [Op.like]: `%${codigo_unidad}%` } },
                    {'$modulo_contenido.modulo.unidad.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } },
                    {inactivo: false}
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