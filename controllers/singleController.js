const { 
    Single, 
    Usuario, 
    NivelAcademico, 
    Institucion,
    Pregunta,
    PreguntaModulo,
    Modulo,
    Unidad,
    Materia,
    PreguntaModuloContenido,
    ModuloContenido,
    PreguntaModuloContenidoTema,
    ModuloContenidoTema,
    PreguntaModuloContenidoTemaConcepto,
    ModuloContenidoTemaConcepto,
    PreguntaAlternativa,
    PreguntaSolucion,
    PreguntaPista,
 } = require('../database/db');
 const { Sequelize, Op } = require('sequelize');
const uuidv4 = require('uuid').v4;
const { validationResult } = require('express-validator');

exports.iniciarSingle = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
 
    try {
        
        const {
            filtro_materia, 
            filtro_unidad,
            filtro_modulo,
            filtro_contenido,
            filtro_tema,
            filtro_concepto,
            cantidad_preguntas,
            tiempo,
            rut_usuario,
            codigo_institucion,
            codigo_nivel_academico,
        } = req.body;

        //verifica que el usuario sea válido.
        let usuario = await Usuario.findByPk(rut_usuario);
        if (!usuario) {
            return res.status(400).json({
                msg: 'El rut usuario no es válido'
            });
        }

        //verifica que la institucion sea válida.
        let institucion = await Institucion.findByPk(codigo_institucion);
        if (!institucion) {
            return res.status(400).json({
                msg: 'El código institución no es válido'
            });
        }

        //verifica que el nivel academico sea válido.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            return res.status(400).json({
                msg: 'El código nivel academico no es válido'
            });
        }

        let codigo = uuidv4();
        //Guarda el nuevo ring
        single = await Single.create({
            codigo, 
            filtro_materia, 
            filtro_unidad,
            filtro_modulo,
            filtro_contenido,
            filtro_tema,
            filtro_concepto,
            cantidad_preguntas,
            tiempo,
            rut_usuario,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_estado : "1",
            fecha_hora_inicio: new Date(),
        }); 

        //Obtiene las preguntas single.
        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        const filtros_dinamicos = []; 
        
        if(filtro_materia.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.materia.codigo$': { [Op.like]: `%${filtro_materia}%` } });
        }
        if(filtro_unidad.trim() !== '0'){
           filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.codigo$': { [Op.like]: `%${filtro_unidad}%` } });
        }
        if(filtro_modulo.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.codigo$': { [Op.like]: `%${filtro_modulo}%` } });
        }
        if(filtro_contenido.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenidos.codigo_modulo_contenido$': { [Op.like]: `%${filtro_contenido}%` } });
        }
        if(filtro_tema.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_temas.codigo_modulo_contenido_tema$': { [Op.like]: `%${filtro_tema}%` } });
        }
        if(filtro_concepto.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_tema_conceptos.codigo_modulo_contenido_tema_concepto$': { [Op.like]: `%${filtro_concepto}%` } });
        }
        
        let preguntas = await Pregunta.findAll({
           
            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal('CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END'),'imagen'],
                [Sequelize.literal('CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.audio)) ELSE pregunta.audio END'),'audio'],
                [Sequelize.literal('CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.video)) ELSE pregunta.video END'),'video'],
                'duracion'
            ],
            include:[{
                model: PreguntaModulo,
                attributes: ['codigo_pregunta', 'codigo_modulo'],
                include:[{
                    model: Modulo,
                    attributes:['codigo', 'descripcion'],
                    include:[{
                        model:Unidad,
                        attributes:['codigo', 'descripcion', 'codigo_materia'],
                        include:[{
                            model:Materia,
                            as:'materia',
                            attributes:['codigo', 'nombre'],
                        }],
                    }],
                }],
            },{
                model: PreguntaModuloContenido,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido'],
                include:[{
                    model: ModuloContenido,
                    attributes:['codigo', 'descripcion', 'codigo_modulo'],
                }],
            },{
                model: PreguntaModuloContenidoTema,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema'],
                include:[{
                    model: ModuloContenidoTema,
                    attributes: ['codigo', 'descripcion', 'codigo_modulo_contenido'],
                }],
            },{
                model: PreguntaModuloContenidoTemaConcepto,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema_concepto'],
                include: [{
                    model: ModuloContenidoTemaConcepto,
                    attributes: ['codigo', 'descripcion', 'codigo_modulo_contenido_tema']
                }],
            },{
                //separate: true,
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
                order: [
                    ['numero', 'ASC'],
                ]
            },{
                //separate: true,
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal('CASE WHEN `pregunta_solucion`.`imagen` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta_solucion`.`imagen`)) ELSE `pregunta_solucion`.`imagen` END'), 'imagen'],
                    [Sequelize.literal('CASE WHEN `pregunta_solucion`.`audio` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta_solucion`.`audio`)) ELSE `pregunta_solucion`.`audio` END'), 'audio'],
                    [Sequelize.literal('CASE WHEN `pregunta_solucion`.`video` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_solucion`.`codigo_pregunta`, "/soluciones/" , `pregunta_solucion`.`video`)) ELSE `pregunta_solucion`.`video` END'), 'video'],
                ],
                order: [
                    ['numero', 'ASC'],
                ],
            },{
                //separate: true,
                model: PreguntaPista,
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal('CASE WHEN `pregunta_pista`.`imagen` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta_pista`.`imagen`)) ELSE `pregunta_pista`.`imagen` END'), 'imagen'],
                    [Sequelize.literal('CASE WHEN `pregunta_pista`.`audio` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta_pista`.`audio`)) ELSE `pregunta_pista`.`audio` END'), 'audio'],
                    [Sequelize.literal('CASE WHEN `pregunta_pista`.`video` <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"), `pregunta_pista`.`codigo_pregunta`, "/pistas/" , `pregunta_pista`.`video`)) ELSE `pregunta_pista`.`video` END'), 'video'], 
                ],
                order: [
                    ['numero', 'ASC'],
                ]
            }],
            where: {
                [Op.and] : [
                    filtros_dinamicos.map(filtro => filtro),
                    {inactivo: false},
                ]
            },
            order:[
                [Sequelize.literal('RAND()')],
            ],  
            //offset: 0,
            //limit: cantidad_preguntas, //provoca un subquery sobre la misma tabla del findAll y el where se hace en el subquery, no se puede hacer a los join. Para evitar que se genere ese subquery se usa el atributo subQuery: false.
            //subQuery: false,
                     
        });

        //envía la respuesta
        res.json({
            codigo_single: codigo,
            preguntas: preguntas.splice(0, cantidad_preguntas),
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}


exports.finalizarSingle = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { 
            codigo,
         } = req.body;

        //verifica que el single a actualizar existe.
        let single = await Single.findByPk(codigo);
        if (!single) {
            return res.status(404).send({
                msg: `El codigo single ${codigo} no existe`
            })
        }
        
        //actualiza los datos.
        single = await Single.update({
            codigo_estado: "3",
            fecha_hora_fin: new Date(),
        }, {
            where: {
                codigo
            }
        })

        res.json({
            codigo,
            msg: `Finalizado correctamente`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}