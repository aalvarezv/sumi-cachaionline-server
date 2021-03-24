const { ModuloContenido, Modulo, Unidad, ModuloContenidoTema, PreguntaModuloContenido } = require('../database/db');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');


exports.crearModuloContenido = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
      
        const { codigo, descripcion, codigo_modulo, inactivo } = req.body;

        let modulo = await Modulo.findByPk(codigo_modulo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El modulo ${codigo_modulo} no existe`
            })
        }

        //Guarda la nueva relacion entre contenido y modulo
        modulo_contenido = await ModuloContenido.create({
            codigo,
            descripcion,
            codigo_modulo,
            inactivo
        });

        res.json({
            modulo_contenido
        })


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
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        
        const { codigo, descripcion, codigo_modulo, inactivo } = req.body;

        let contenido = await ModuloContenido.findByPk(codigo);
        if (!contenido) {
            return res.status(404).send({
                msg: `El contenido ${codigo} no existe`
            })
        }

        let modulo = await Modulo.findByPk(codigo_modulo);
        if (!modulo) {
            return res.status(404).send({
                msg: `El modulo ${codigo_modulo} no existe`
            })
        }

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

exports.eliminarModuloContenido = async(req, res) => {

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

        //revisa si tiene temas asociados.
        let temas_contenido = await ModuloContenidoTema.findOne({
            where:{
                codigo_modulo_contenido : codigo
            }
        })
        if (temas_contenido){
            return res.status(404).send({
                msg: `El contenido ${codigo} tiene temas asociados, no se puede eliminar`
            });
        }

        //revisa si tiene preguntas asociadas.
        let preguntas_contenido = await PreguntaModuloContenido.findOne({
            where:{
                codigo_modulo_contenido : codigo
            }
        })
        if (preguntas_contenido){
            return res.status(404).send({
                msg: `El contenido ${codigo} tiene preguntas asociadas, no se puede eliminar`
            });
        }

        //elimino el registro.
        await ModuloContenido.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Contenido eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.contenidosPorDescripcionModuloUnidadyMateria = async(req, res) => {

    try {

        let { codigo_modulo, codigo_unidad, codigo_materia, descripcion } = req.query;

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
                    { descripcion: { [Op.like] : `%${descripcion}%`} },
                    { codigo_modulo: { [Op.like] : `%${codigo_modulo}%`} },
                    {'$modulo.codigo_unidad$': { [Op.like]: `%${codigo_unidad}%` } },
                    {'$modulo.unidad.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } },
                ]
            },
            order: [
                ['descripcion', 'ASC']
            ]
        });

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
