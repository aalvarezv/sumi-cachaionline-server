const { Ring, Usuario, NivelAcademico, sequelize, RingPregunta, RingUsuario, Respuesta, RingNivelAcademico } = require('../database/db');
const { Op, QueryTypes } = require('sequelize');
const moment = require('moment');
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.crearRing = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
 
    try {
        
        const {
            codigo,
            nombre,
            descripcion,
            rut_usuario_creador,
            codigo_institucion,
            niveles_academicos,
            codigo_materia,
            codigo_tipo_juego,
            codigo_modalidad,
            fecha_hora_inicio,
            fecha_hora_fin,
            tipo_duracion_pregunta,
            duracion_pregunta,
            revancha,
            revancha_cantidad,
            nota_alta,
            nota_alta_mensaje,
            nota_media,
            nota_media_mensaje,
            nota_baja,
            nota_baja_mensaje,
            retroceder,
            pistas,
            mostrar_cantidad_usuarios,
            privado,
            inactivo,
        } = req.body;

        
        //verifica que el ring no existe.
        let ring = await Ring.findByPk(codigo);
        if (ring) {
            return res.status(400).json({
                msg: 'El ring ya existe'
            });
        }

        //verifica que el usuario sea válido.
        let usuario = await Usuario.findByPk(rut_usuario_creador);
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario ingresado no es válido'
            });
        }

        const ultimoCodigoConexion = await sequelize.query(`SELECT codigo, codigo_conexion, codigo_institucion FROM rings WHERE createdAt = (SELECT MAX (createdAt) FROM rings WHERE codigo_institucion = '${codigo_institucion}') AND codigo_institucion = '${codigo_institucion}'`, { type: QueryTypes.SELECT })

        let codigoConexion = 0

        console.log(ultimoCodigoConexion)
        
        if(ultimoCodigoConexion.length > 0){
            if(Number(ultimoCodigoConexion[0].codigo_conexion) === 1000){
                codigoConexion = 1
            }else{
                codigoConexion = Number(ultimoCodigoConexion[0].codigo_conexion) + 1
            }
        }else{
            codigoConexion = 1
        }
       

        //Guarda el nuevo ring
        ring = await Ring.create({
            codigo,
            codigo_conexion: codigoConexion,
            nombre,
            descripcion,
            rut_usuario_creador,
            codigo_institucion,
            codigo_materia,
            codigo_tipo_juego,
            codigo_modalidad,
            fecha_hora_inicio: moment(fecha_hora_inicio).format('YYYY-MM-DD HH:mm'),
            fecha_hora_fin: moment(fecha_hora_fin).format('YYYY-MM-DD HH:mm'),
            tipo_duracion_pregunta,
            duracion_pregunta,
            revancha,
            revancha_cantidad,
            nota_alta,
            nota_alta_mensaje,
            nota_media,
            nota_media_mensaje,
            nota_baja,
            nota_baja_mensaje,
            retroceder,
            pistas,
            mostrar_cantidad_usuarios,
            privado,
            inactivo,
        }); 

        //Agrega los niveles academicos.
        for(let nivelAcademico of niveles_academicos){
            await RingNivelAcademico.create({
                codigo_ring: codigo,
                codigo_nivel_academico: nivelAcademico.codigo
            })
        }

        //envía la respuesta
        res.json({
            ring
        });

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
                codigo_materia, nombre_ring, 
                rut_usuario_creador, privado} = req.query;
        
        let fecha_desde_format = new Date(fecha_desde).toISOString().split('T')[0];
        let fecha_hasta_format = new Date(fecha_hasta).toISOString().split('T')[0];

        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        const filtros_dinamicos = []; 
        
        if(codigo_materia.trim() !== '0'){
            filtros_dinamicos.push({'$ring.codigo_materia$': { [Op.like]: `%${codigo_materia}%` } });
        }

        if(nombre_ring.trim() !== '0'){
            filtros_dinamicos.push({'$ring.nombre$': { [Op.like]: `%${nombre_ring}%` } });
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
                as: 'usuario_creador',
            },{
                model: RingNivelAcademico,
                attributes: ['codigo_ring', 'codigo_nivel_academico'],
                include:[{
                    model: NivelAcademico,
                    attributes: ['codigo', 'descripcion']
                }]
            }],
            where:{
                [Op.and]:[
                    sequelize.where( sequelize.fn('date', sequelize.col('ring.createdAt')), '>=', fecha_desde_format ),
                    sequelize.where( sequelize.fn('date', sequelize.col('ring.createdAt')), '<=', fecha_hasta_format ),
                    {codigo_institucion},
                    {rut_usuario_creador},
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
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        let {
            codigo,
            nombre,
            descripcion,
            rut_usuario_creador,
            codigo_institucion,
            niveles_academicos,
            codigo_materia,
            codigo_tipo_juego,
            codigo_modalidad,
            fecha_hora_inicio,
            fecha_hora_fin,
            tipo_duracion_pregunta,
            duracion_pregunta,
            revancha,
            revancha_cantidad,
            nota_alta,
            nota_alta_mensaje,
            nota_media,
            nota_media_mensaje,
            nota_baja,
            nota_baja_mensaje,
            retroceder,
            pistas,
            mostrar_cantidad_usuarios,
            privado,
            inactivo,
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
            codigo,
            nombre,
            descripcion,
            rut_usuario_creador,
            codigo_institucion,
            codigo_materia,
            codigo_tipo_juego,
            codigo_modalidad,
            fecha_hora_inicio: moment(fecha_hora_inicio).format('YYYY-MM-DD HH:mm'),
            fecha_hora_fin: moment(fecha_hora_fin).format('YYYY-MM-DD HH:mm'),
            tipo_duracion_pregunta,
            duracion_pregunta,
            revancha,
            revancha_cantidad,
            nota_alta,
            nota_alta_mensaje,
            nota_media,
            nota_media_mensaje,
            nota_baja,
            nota_baja_mensaje,
            retroceder,
            pistas,
            mostrar_cantidad_usuarios,
            privado,
            inactivo,
        }, {
            where: {
                codigo
            }
        })

        //elimina los niveles academicos asociados al ring
        await RingNivelAcademico.destroy({
            where: {
                codigo_ring: codigo
            }
        })

        //Agrega los niveles academicos.
        for(let nivelAcademico of niveles_academicos){
            await RingNivelAcademico.create({
                codigo_ring: codigo,
                codigo_nivel_academico: nivelAcademico.codigo
            })
        }

        res.json({
            ring
        });

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
        //verifica que el ring a eliminar existe.
        let ring = await Ring.findByPk(codigo);
        if (!ring) {
            return res.status(404).send({
                msg: `El ring ${codigo} no existe`
            })
        }

        //revisa si tiene preguntas asociadas.
        const ringPregunta = await RingPregunta.findOne({
            where:{
                codigo_ring: codigo
            }
        })

        if(ringPregunta){
            return res.status(404).send({
                msg: `El ring ${codigo} tiene preguntas asociadas, no se puede eliminar`
            })
        }
        //revisa si tiene usuarios asociados.
        const ringUsuario = await RingUsuario.findOne({
            where: {
                codigo_ring: codigo
            }
        })

        if(ringUsuario){
            return res.status(404).send({
                msg: `El ring ${codigo} tiene usuarios asociados, no se puede eliminar`
            })
        }

        //revisa si tiene respuestas de la competencia registradas.
        const ringRespuestas = await Respuesta.findOne({
            where: {
                codigo_ring: codigo
            }
        })

        if(ringRespuestas){
            return res.status(404).send({
                msg: `El ring ${codigo} tiene resultados registrados, no se puede eliminar`
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

