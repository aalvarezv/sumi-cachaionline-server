const { ModuloContenido, Modulo, Unidad, ModuloContenidoTema } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.crearModuloContenido = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo, inactivo } = req.body;

        //Guarda la nueva relacion entre contenido y modulo
        modulo_contenido = await ModuloContenido.create({
            codigo,
            descripcion,
            codigo_modulo,
            inactivo
        });

        res.json(modulo_contenido)


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}

exports.listarModuloContenidos = async(req, res) => {

    try {
       
        const { codigo_modulo } = req.params;

        const modulo_contenidos = await ModuloContenido.findAll({
            where: {
                codigo_modulo
            }
        });

        res.json({
            modulo_contenidos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarModuloContenido = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { codigo, descripcion, codigo_modulo, inactivo } = req.body;

        let contenido = await ModuloContenido.findByPk(codigo);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo} no existe`
            })
        }

        /* let modulo = await Modulo.findByPk(codigo_modulo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El modulo ${codigo_modulo} no existe`
            })
        } */

        contenido = await ModuloContenido.update({
            descripcion,
            codigo_modulo,
            inactivo
        }, {
            where: {
                codigo
            }
        })

        res.json({
            msg: "Contenido actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarModuloContenido = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //obtengo el codigo del request
        const { codigo } = req.params;

        let contenido = await ModuloContenido.findByPk(codigo);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo} no existe`
            })
        }

        let temas_contenido = await ModuloContenidoTema.findAll({
            where:{
                codigo_modulo_contenido : codigo
            }
        })
        if (temas_contenido){
            return res.status(404).send({
                msg: `El contenido ${codigo} tiene temas asociados, no se puede eliminar`
            });
        }

        //elimino el registro.
        await ModuloContenido.destroy({
            where: {
                codigo
            }
        });

        //next para pasar a listarModuloContenidos
        req.params.codigo_modulo = codigo_modulo;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}


exports.contenidoModulo = async(req, res) => {

    try {

        let { codigo_modulo, codigo_unidad, codigo_materia } = req.params;

        if(codigo_modulo.trim() === '0'){
            codigo_modulo = ''
        }
        
        if(codigo_unidad.trim() === '0'){
            codigo_unidad = ''
        }

        if(codigo_materia.trim() === '0'){
            codigo_materia = ''
        }
    

        const modulo_contenido = await ModuloContenido.findAll({
            include:[{
                attributes: ['codigo', 'descripcion', 'codigo_unidad'],
                model: Modulo,
                include:[{
                    attributes: ['codigo', 'descripcion', 'codigo_materia'],
                    model: Unidad
                }]
            }],
            where: {
                [Op.and]:[
                    { codigo_modulo: { [Op.like] : `%${codigo_modulo}%`} },
                    {'$modulo.codigo_unidad$': { [Op.like]: `%${codigo_unidad}%` } },
                    {'$modulo.unidad.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } },
                    {inactivo: false}
                ]
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

        if (!modulo_contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo_modulo} no tiene modulos asociados`
            });
        }

        res.json({
            modulo_contenido
        });
 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}
