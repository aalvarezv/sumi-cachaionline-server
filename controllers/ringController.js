const { Ring, Usuario, NivelAcademico, sequelize } = require('../config/db');
const { Sequelize, Op, QueryTypes } = require('sequelize');
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.crearRing = async(req, res) => {

    //si hay errores de la validación
    console.log(req.body);

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
            cantidad_usuarios,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_materia,
            tipo_duracion_pregunta,
            duracion_pregunta,
            codigo_tipo_juego,
            privado,
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
            codigo_tipo_juego,
            cantidad_usuarios,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_materia,
            tipo_duracion_pregunta,
            duracion_pregunta,
            privado,
            inactivo,
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

exports.listarRings = async(req, res) => {

    try {

        let { fecha_desde, fecha_hasta, codigo_institucion, 
                codigo_materia, codigo_nivel_academico, nombre_ring, 
                nombre_usuario_creador, privado} = req.query;
        
        let fecha_desde_format = new Date(fecha_desde).toISOString().split('T')[0];
        let fecha_hasta_format = new Date(fecha_hasta).toISOString().split('T')[0];

        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        const filtros_dinamicos = []; 
        
        if(codigo_materia.trim() !== '0'){
            filtros_dinamicos.push({'$ring.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } });
        }
        if(codigo_nivel_academico.trim() !== '0'){
            filtros_dinamicos.push({'$ring.codigo_nivel_academico$': { [Op.like]: `%${codigo_nivel_academico}%` } });
        }
        if(nombre_ring.trim() !== '0'){
            filtros_dinamicos.push({'$ring.nombre$': { [Op.like]: `%${nombre_ring}%` } });
        }
        if(nombre_usuario_creador.trim() !== '0'){
            filtros_dinamicos.push({'$usuario.nombre$': { [Op.like]: `%${nombre_usuario_creador}%` } });
        }

        if(privado === 'true'){
            privado = 1
        }else{
            privado = 0
        }

        const ring = await Ring.findAll({
            include: [{
                model: Usuario,
                attributes: ['rut','nombre'],
            },{
                model: NivelAcademico,
                attributes: ['descripcion'],
            }],
            where:{
                [Op.and]:[
                    sequelize.where( sequelize.fn('date', sequelize.col('fecha_hora_inicio')), '>=', fecha_desde_format ),
                    sequelize.where( sequelize.fn('date', sequelize.col('fecha_hora_fin')), '<=', fecha_hasta_format ),
                    {codigo_institucion},
                    filtros_dinamicos.map(filtro => filtro),
                    {privado: privado},
                ]
            },  
            order:[
                ['createdAt', 'DESC']
            ]
           
        });

        res.json({
            ring
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
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
            privado,
            codigo_tipo_juego,
            cantidad_usuarios,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_materia,
            tipo_duracion_pregunta,
            duracion_pregunta,            
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
        let usuario = await Usuario.findByPk(rut_usuario_creador);
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
            privado,
            codigo_tipo_juego,
            cantidad_usuarios,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_materia,
            tipo_duracion_pregunta,
            duracion_pregunta,
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
