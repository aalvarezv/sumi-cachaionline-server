const { Pregunta, PreguntaAlternativa, PreguntaSolucion, 
        PreguntaPista, PreguntaModulo, PreguntaModuloContenido, 
        PreguntaModuloContenidoTema, PreguntaModuloContenidoTemaConcepto,
        ModuloContenidoTema, ModuloContenidoTemaConcepto, RingPregunta,
        Usuario, Modulo, ModuloContenido, Unidad, Materia, sequelize } = require('../database/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');
const fs = require('fs');
const findRemoveSync = require('find-remove');
const { creaPreguntaModulo, 
        creaPreguntaModuloContenido, 
        creaPreguntaModuloContenidoTema, 
        creaPreguntaModuloContenidoTemaConcepto,
        isUrl,
        } = require('../helpers');

const url_preguntas = process.env.URL_PREGUNTAS;

exports.crearPregunta = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const {
            codigo,
            rut_usuario_creador,
            texto,
            imagen,
            audio,
            video,
            duracion,
            modulos,
            contenidos,
            temas,
            conceptos,
            alternativas,
            soluciones,
            pistas,
        } = req.body;

        let pregunta = await Pregunta.findByPk(codigo);
        if (pregunta) {
            return res.status(400).json({
                msg: 'El código de la pregunta ya existe, vuelva a intentar'
            });
        }

        let dir_pregunta = process.env.DIR_PREGUNTAS;

        //Crea el directorio (codigo pregunta) para almacenar los archivos de la pregunta.
        await fs.promises.mkdir(`${dir_pregunta}/${codigo}`, {recursive: true});
        
        let imagen_pregunta = '';
        if(imagen.trim() !== ''){
            //Obtiene la extension del archivo video de la pregunta.
            let imagen_pregunta_ext = imagen.substring("data:image/".length, imagen.indexOf(";base64"));
            imagen_pregunta = `img-pregunta.${imagen_pregunta_ext}`;
            //Escribe el archivo imagen de la pregunta en disco.
            await fs.promises.writeFile(`${dir_pregunta}/${codigo}/${imagen_pregunta}`, imagen.split(';base64,').pop(), {encoding: 'base64'});
        }
        let video_pregunta = '';
        if(video.trim() !== ''){
            //Obtiene la extension del archivo video de la pregunta.
            let video_pregunta_ext = video.substring("data:video/".length, video.indexOf(";base64"));
            video_pregunta = `vd-pregunta.${video_pregunta_ext}`;
            //Escribe el archivo video de la pregunta en disco.
            await fs.promises.writeFile(`${dir_pregunta}/${codigo}/${video_pregunta}`, video.split(';base64,').pop(), {encoding: 'base64'});
        }
        let audio_pregunta = '';
        if(audio.trim() !== ''){
            //Obtiene la extension del archivo audio de la pregunta.
            let audio_pregunta_ext = audio.substring("data:audio/".length, audio.indexOf(";base64"));
            audio_pregunta = `ad-pregunta.${audio_pregunta_ext}`;
            //Escribe el archivo audio de la pregunta en disco.
            await fs.promises.writeFile(`${dir_pregunta}/${codigo}/${audio_pregunta}`, audio.split(';base64,').pop(), {encoding: 'base64'});
        }
   
        //Graba la pregunta en la base de datos.
        await Pregunta.create({
            codigo,
            rut_usuario_creador,
            texto,
            imagen: imagen_pregunta,
            audio: audio_pregunta,
            video: video_pregunta,
            duracion,
        });

        //*********PREGUNTA vs MODULOS
        for(let modulo of modulos){
            const {codigo, codigo_pregunta} = modulo;
            await creaPreguntaModulo(codigo_pregunta, codigo);
        }
        //*********PREGUNTA vs CONTENIDOS
        for(let contenido of contenidos){
            const {codigo, codigo_pregunta} = contenido;
            await creaPreguntaModuloContenido(codigo_pregunta, codigo);
        }
        //**********PREGUNTA vs TEMAS
        for(let tema of temas){
            const {codigo, codigo_pregunta} = tema;
            await creaPreguntaModuloContenidoTema(codigo_pregunta, codigo);
        }
        //**********PREGUNTA vs CONCEPTOS
        for(let concepto of conceptos){
            const {codigo, codigo_pregunta} = concepto;
            await creaPreguntaModuloContenidoTemaConcepto(codigo_pregunta, codigo);
        }

        //*********ALTERNATIVAS.
        //Graba las alternativas de la pregunta.
        await PreguntaAlternativa.bulkCreate(alternativas);

        //*********SOLUCIONES.
        //Crea el directorio para almacenar los archivos multimedia de la solución.
        await fs.promises.mkdir(`${dir_pregunta}/${codigo}/soluciones`, {recursive: true});
        
        //Recorre cada una de las soluciones para grabar los archivos en disco.
        for(const solucion of soluciones){

            let imagen_solucion = solucion.imagen;
            //Si la solución tiene imagen.
            if(solucion.imagen.trim() !== ''){
                //Obtiene la extension del archivo imagen de la solucion.
                let imagen_solucion_ext = solucion.imagen.substring("data:image/".length, solucion.imagen.indexOf(";base64"));
                //Genera el nombre del archivo.
                imagen_solucion = `img-solucion-${solucion.numero}.${imagen_solucion_ext}`;
                 //Escribe el archivo de la solucion en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/soluciones/${imagen_solucion}`, solucion.imagen.split(';base64,').pop(), {encoding: 'base64'});
            }

            let audio_solucion = solucion.audio;
            if(solucion.audio.trim() !== ''){
                //Obtiene la extension del archivo audio de la solucion.
                let audio_solucion_ext = solucion.audio.substring("data:audio/".length, solucion.audio.indexOf(";base64"));
                //Genera el nombre del archivo.
                audio_solucion = `ad-solucion-${solucion.numero}.${audio_solucion_ext}`;
                 //Escribe el archivo de la solucion en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/soluciones/${audio_solucion}`, solucion.audio.split(';base64,').pop(), {encoding: 'base64'});
            }

            let video_solucion = solucion.video;
            if(solucion.video.trim() !== ''){
                //Obtiene la extension del archivo audio de la solucion.
                let video_solucion_ext = solucion.video.substring("data:video/".length, solucion.video.indexOf(";base64"));
                //Genera el nombre del archivo.
                video_solucion = `vd-solucion-${solucion.numero}.${video_solucion_ext}`;
                 //Escribe el archivo de la solucion en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/soluciones/${video_solucion}`, solucion.video.split(';base64,').pop(), {encoding: 'base64'});
            }

            //Crea el registro en la base de datos.
            await PreguntaSolucion.create({
                codigo: solucion.codigo,
                codigo_pregunta: solucion.codigo_pregunta,
                numero: solucion.numero,
                texto: solucion.texto,
                imagen: imagen_solucion,
                audio: audio_solucion,
                video: video_solucion,
            });
        }

        //*********PISTAS.
        //Crea el directorio para almacenar los archivos multimedia de las pistas.
        await fs.promises.mkdir(`${dir_pregunta}/${codigo}/pistas`, {recursive: true});

        //Recorre cada una de las pistas para grabar los archivos en disco.
        for(const pista of pistas){
            
            let imagen_pista = pista.imagen;
            //Si la pista tiene imagen.
            if(pista.imagen.trim() !== ''){
                //Obtiene la extension del archivo imagen de la pista.
                let imagen_pista_ext = pista.imagen.substring("data:image/".length, pista.imagen.indexOf(";base64"));
                //Genera el nombre del archivo.
                imagen_pista = `img-pista-${pista.numero}.${imagen_pista_ext}`;

                //Escribe el archivo de la pista en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/pistas/${imagen_pista}`, pista.imagen.split(';base64,').pop(), {encoding: 'base64'});
            }

            let audio_pista = pista.audio;
            if(pista.audio.trim() !== ''){
                //Obtiene la extension del archivo audio de la pista.
                let audio_pista_ext = pista.audio.substring("data:audio/".length, pista.audio.indexOf(";base64"));
                //Genera el nombre del archivo.
                audio_pista = `ad-pista-${pista.numero}.${audio_pista_ext}`;

                //Escribe el archivo de la pista en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/pistas/${audio_pista}`, pista.audio.split(';base64,').pop(), {encoding: 'base64'});
            }

            let video_pista = pista.video;
            if(pista.video.trim() !== ''){
                //Obtiene la extension del archivo video de la pista.
                let video_pista_ext = pista.video.substring("data:video/".length, pista.video.indexOf(";base64"));
                //Genera el nombre del archivo.
                video_pista = `vd-pista-${pista.numero}.${video_pista_ext}`;

                //Escribe el archivo de la pista en disco.
                await fs.promises.writeFile(`${dir_pregunta}/${codigo}/pistas/${video_pista}`, pista.video.split(';base64,').pop(), {encoding: 'base64'});
            }
        
            //Crea el registro en la base de datos.
            await PreguntaPista.create({
                codigo: pista.codigo,
                codigo_pregunta: pista.codigo_pregunta,
                numero: pista.numero,
                texto: pista.texto,
                imagen: imagen_pista,
                audio: audio_pista,
                video: video_pista,
            });
            
        }

        res.json({
            pregunta
        });
     
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarPreguntas = async(req, res) => {

    try {

        const { nombre_usuario_creador,
                codigo_materia, codigo_unidad, 
                codigo_modulo, codigo_modulo_contenido,
                codigo_modulo_contenido_tema, 
                codigo_modulo_contenido_tema_concepto,
             } = req.query;

        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        const filtros_dinamicos = []; 
        
        if(codigo_materia.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.materia.codigo$': { [Op.like]: `%${codigo_materia}%` } });
        }
        if(codigo_unidad.trim() !== '0'){
           filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.codigo$': { [Op.like]: `%${codigo_unidad}%` } });
        }
        if(codigo_modulo.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.codigo$': { [Op.like]: `%${codigo_modulo}%` } });
        }
        if(codigo_modulo_contenido.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenidos.codigo_modulo_contenido$': { [Op.like]: `%${codigo_modulo_contenido}%` } });
        }
        if(codigo_modulo_contenido_tema.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_temas.codigo_modulo_contenido_tema$': { [Op.like]: `%${codigo_modulo_contenido_tema}%` } });
        }
        if(codigo_modulo_contenido_tema_concepto.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_tema_conceptos.codigo_modulo_contenido_tema_concepto$': { [Op.like]: `%${codigo_modulo_contenido_tema_concepto}%` } });
        }

        let preguntas = await Pregunta.findAll({

            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal(`CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.imagen)) ELSE pregunta.imagen END`), 'imagen'],
                [Sequelize.literal(`CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.imagen)) ELSE pregunta.imagen END`), 'imagen'],
                [Sequelize.literal(`CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.audio)) ELSE pregunta.audio END`), 'audio'],
                [Sequelize.literal(`CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.video)) ELSE pregunta.video END`), 'video'],
                'duracion',
                'createdAt',
                'updatedAt',
            ],
            include:[{
                model: Usuario,
                attributes: ['rut', 'nombre'],
                required: false,
            },{
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
                            attributes:['codigo', 'descripcion'],
                            
                        }],
                    }],
                }],
            },{
                model: PreguntaModuloContenido,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido'],
            },{
                model: PreguntaModuloContenidoTema,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema'],
            },{
                model: PreguntaModuloContenidoTemaConcepto,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema_concepto'],
            }],
            where: {
                [Op.and]:[
                    { inactivo: false },
                    sequelize.where(sequelize.col('usuario.nombre'),'LIKE','%'+nombre_usuario_creador+'%'),
                    filtros_dinamicos.map(filtro => filtro),    
                ],   
            },
            order:[
                ['createdAt', 'DESC'],
            ],
        });

        res.send({
            preguntas,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarPreguntasRing = async(req, res) => {

    try {

        const { nombre_usuario_creador,
                codigo_materia, codigo_unidad, 
                codigo_modulo, codigo_modulo_contenido,
                codigo_modulo_contenido_tema, 
                codigo_modulo_contenido_tema_concepto,
                codigo_ring,
             } = req.query;

        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        const filtros_dinamicos = []; 
        
        if(codigo_materia.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.materia.codigo$': { [Op.like]: `%${codigo_materia}%` } });
        }
        if(codigo_unidad.trim() !== '0'){
           filtros_dinamicos.push({'$pregunta_modulos.modulo.unidad.codigo$': { [Op.like]: `%${codigo_unidad}%` } });
        }
        if(codigo_modulo.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulos.modulo.codigo$': { [Op.like]: `%${codigo_modulo}%` } });
        }
        if(codigo_modulo_contenido.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenidos.codigo_modulo_contenido$': { [Op.like]: `%${codigo_modulo_contenido}%` } });
        }
        if(codigo_modulo_contenido_tema.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_temas.codigo_modulo_contenido_tema$': { [Op.like]: `%${codigo_modulo_contenido_tema}%` } });
        }
        if(codigo_modulo_contenido_tema_concepto.trim() !== '0'){
            filtros_dinamicos.push({'$pregunta_modulo_contenido_tema_conceptos.codigo_modulo_contenido_tema_concepto$': { [Op.like]: `%${codigo_modulo_contenido_tema_concepto}%` } });
        }

        let preguntas = await Pregunta.findAll({

            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal(`CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END`),'imagen'],
                [Sequelize.literal(`CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.audio)) ELSE pregunta.audio END`),'audio'],
                [Sequelize.literal(`CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT('${url_preguntas}',pregunta.codigo,"/",pregunta.video)) ELSE pregunta.video END`),'video'],
                'duracion',
                'createdAt',
                'updatedAt',
            ],
            include:[{
                model: Usuario,
                attributes: ['rut', 'nombre'],
                required: false,
            },{
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
                            attributes:['codigo', 'descripcion'],
                            
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
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
            },{
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.imagen)) ELSE pregunta_solucion.imagen END`), 'imagen'],
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.audio)) ELSE pregunta_solucion.audio END`), 'audio'],
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.video)) ELSE pregunta_solucion.video END`), 'video'],
                ],
            },{
                model: PreguntaPista,
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal(`CASE WHEN pregunta_pista.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.imagen)) ELSE pregunta_pista.imagen END`), 'imagen'],
                    [Sequelize.literal(`CASE WHEN pregunta_pista.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.audio)) ELSE pregunta_pista.audio END`), 'audio'],
                    [Sequelize.literal(`CASE WHEN pregunta_pista.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.video)) ELSE pregunta_pista.video END`), 'video'], 
                ],
            },{
                model: RingPregunta,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where:{
                    codigo_ring,
                },
                required: false,
            }],
            where: {
                [Op.and]:[
                    { inactivo: false },
                    sequelize.where(sequelize.col('usuario.nombre'),'LIKE','%'+nombre_usuario_creador+'%'),
                    filtros_dinamicos.map(filtro => filtro),    
                ],   
            },
            order:[
                ['createdAt', 'DESC'],
                [{ model: PreguntaAlternativa },
                    'numero',
                    'ASC'],
                [{ model: PreguntaSolucion },
                    'numero',
                    'ASC'],
                [{ model: PreguntaPista },
                    'numero',
                    'ASC'],
            ],
        });

        res.send({
            preguntas,
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarPregunta = async(req, res) => {

    try {

        const { codigo } = req.params;
        //Obtiene el directorio donde se almacenan los archivos.
        let dir_pregunta = process.env.DIR_PREGUNTAS;
    
        let pregunta = await Pregunta.findByPk(codigo);
        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }

        //******ALTERNATIVAS
        await PreguntaAlternativa.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******SOLUCIONES
        await PreguntaSolucion.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******PISTAS
        await PreguntaPista.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******MODULOS
        await PreguntaModulo.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******CONTENIDOS MODULO
        await PreguntaModuloContenido.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******TEMA CONTENIDOS MODULO
        await PreguntaModuloContenidoTema.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******CONCEPTO TEMA CONTENIDOS MODULO
        await PreguntaModuloContenidoTemaConcepto.destroy({
            where: {
                codigo_pregunta: codigo
            }
        });

        //******PREGUNTA
        await Pregunta.destroy({
            where: {
                codigo
            }
        });

        //******ELIMINA LOS ARCHIVOS DE IMAGEN
        findRemoveSync(dir_pregunta, { dir: codigo });

        res.json({
            msg: 'Pregunta eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosPreguntas = async(req, res) => {

    try {
        const { codigo } = req.params
        let pregunta = await Pregunta.findOne({
            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal(`CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.imagen)) ELSE pregunta.imagen END`), 'imagen'],
                [Sequelize.literal(`CASE WHEN pregunta.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.audio)) ELSE pregunta.audio END`), 'audio'],
                [Sequelize.literal(`CASE WHEN pregunta.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta.codigo, "/" , pregunta.video)) ELSE pregunta.video END`), 'video'],
                'duracion',
            ],
            include:[{
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
            },{
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.imagen)) ELSE pregunta_solucion.imagen END`), 'imagen'],
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.audio)) ELSE pregunta_solucion.audio END`), 'audio'],
                    [Sequelize.literal(`CASE WHEN pregunta_solucion.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_solucion.codigo_pregunta, "/soluciones/" , pregunta_solucion.video)) ELSE pregunta_solucion.video END`), 'video'],
                ],
            },{
                model: PreguntaPista,
                attributes: [
                    'codigo', 
                    'numero', 
                    'texto',
                    [Sequelize.literal(`CASE WHEN pregunta_pista.imagen <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.imagen)) ELSE pregunta_pista.imagen END`), 'imagen'],
                    [Sequelize.literal(`CASE WHEN pregunta_pista.audio <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.audio)) ELSE pregunta_pista.audio END`), 'audio'],
                    [Sequelize.literal(`CASE WHEN pregunta_pista.video <> "" THEN (SELECT CONCAT('${url_preguntas}', pregunta_pista.codigo_pregunta, "/pistas/" , pregunta_pista.video)) ELSE pregunta_pista.video END`), 'video'], 
                ],
            },{
                model: PreguntaModulo,
                attributes: ['codigo_pregunta', 'codigo_modulo'],
                include: [{
                    model: Modulo,
                    attributes: ['codigo', 'descripcion'],
                }]
            },{
                model: PreguntaModuloContenido,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido'],
                include:[{
                    model: ModuloContenido,
                    attributes:['codigo', 'descripcion', 'codigo_modulo'],
                }]
            },{
                model: PreguntaModuloContenidoTema,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema'],
                include:[{
                    model: ModuloContenidoTema,
                    attributes: ['codigo', 'descripcion', 'codigo_modulo_contenido'],
                }]
            },{
                model: PreguntaModuloContenidoTemaConcepto,
                attributes: ['codigo_pregunta', 'codigo_modulo_contenido_tema_concepto'],
                include: [{
                    model: ModuloContenidoTemaConcepto,
                    attributes: ['codigo', 'descripcion', 'codigo_modulo_contenido_tema']
                }]
            }],
            where:{
                codigo,
            },
            order:[
                [{ model: PreguntaAlternativa },
                    'numero',
                    'ASC'],
                [{ model: PreguntaSolucion },
                    'numero',
                    'ASC'],
                [{ model: PreguntaPista },
                    'numero',
                    'ASC'],
            ],
        });

        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }

        res.send({
            pregunta,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.actualizarPregunta = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const {
            codigo,
            rut_usuario_creador,
            texto,
            imagen,
            audio,
            video,
            duracion,
            modulos,
            contenidos,
            temas,
            conceptos,
            alternativas,
            soluciones,
            pistas,
        } = req.body;

        let pregunta = await Pregunta.findByPk(codigo, {
            raw: true,
        });

        if (!pregunta) {
            return res.status(400).json({
                msg: 'La pregunta no existe, vuelva a intentar'
            });
        }

        //Obtiene el directorio de las preguntas.
        let dir_pregunta = process.env.DIR_PREGUNTAS;

        let imagen_pregunta = '';
        //Si la imagen no está vacía y no es una URL, entonces la modifico.
        if(imagen.trim() !== ''){
            if(isUrl(imagen)){
                imagen_pregunta = pregunta.imagen;
            }else{
                //Elimina el archivo actual.
                if(pregunta.imagen.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.imagen}`);
                }
                if(pregunta.video.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.video}`);
                }
                if(pregunta.audio.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.audio}`);
                }
                //Obtiene la extension del archivo desde el base64.
                let imagen_pregunta_ext = imagen.substring("data:image/".length, imagen.indexOf(";base64"));
                imagen_pregunta = `img-pregunta.${imagen_pregunta_ext}`;

                //Graba el archivo de la pregunta.
                await fs.promises.writeFile(`${dir_pregunta}${codigo}/${imagen_pregunta}`, imagen.split(';base64,').pop(), {encoding: 'base64'});
            }
        }

        let video_pregunta = '';
        if(video.trim() !== ''){
            if(isUrl(video)){
                video_pregunta = pregunta.video;
            }else{
                //Elimina el archivo actual.
                if(pregunta.imagen.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.imagen}`);
                }
                if(pregunta.video.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.video}`);
                }
                if(pregunta.audio.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.audio}`);
                }
                //Obtiene la extension del archivo video de la pregunta.
                let video_pregunta_ext = video.substring("data:video/".length, video.indexOf(";base64"));
                video_pregunta = `vd-pregunta.${video_pregunta_ext}`;
                //Escribe el archivo video de la pregunta en disco.
                await fs.promises.writeFile(`${dir_pregunta}${codigo}/${video_pregunta}`, video.split(';base64,').pop(), {encoding: 'base64'});
            }            
        }

        let audio_pregunta = '';
        if(audio.trim() !== ''){
            if(isUrl(audio)){
                audio_pregunta = pregunta.audio;
            }else{
                //Elimina el archivo actual.
                if(pregunta.imagen.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.imagen}`);
                }
                if(pregunta.video.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.video}`);
                }
                if(pregunta.audio.trim() !== ''){
                    await fs.promises.unlink(`${dir_pregunta}${codigo}/${pregunta.audio}`);
                }
                //Obtiene la extension del archivo audio de la pregunta.
                let audio_pregunta_ext = video.substring("data:audio/".length, audio.indexOf(";base64"));
                audio_pregunta = `ad-pregunta.${audio_pregunta_ext}`;
                //Escribe el archivo audio de la pregunta en disco.
                await fs.promises.writeFile(`${dir_pregunta}${codigo}/${audio_pregunta}`, audio.split(';base64,').pop(), {encoding: 'base64'});
            }
        }
        

        await Pregunta.update({
            codigo,
            rut_usuario_creador,
            texto,
            imagen: imagen_pregunta,
            audio: audio_pregunta,
            video: video_pregunta,
            duracion,
        },{
            where: {
                codigo
            }
        });

        //ALTERNATIVAS
        //Elimina las alternativas que no están en las posibilidades (Fueron eliminadas en el Front).
        await PreguntaAlternativa.destroy({ 
            where: { 
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo: {[Op.notIn] : alternativas.map(alternativa => alternativa.codigo)}},
                ]
                
            } 
        });
        
        for(let alternativa of alternativas){
            const alternativaExiste = await PreguntaAlternativa.findByPk(alternativa.codigo)
            if(alternativaExiste){
                await PreguntaAlternativa.update({
                    correcta: alternativa.correcta
                },{
                    where:{
                        codigo: alternativa.codigo
                    }
                });
            }else{
                await PreguntaAlternativa.create(alternativa);
            }
        }

        //********SOLUCIONES
        if(soluciones.length > 0){
            await fs.promises.mkdir(`${dir_pregunta}/${codigo}/soluciones`, {recursive: true});
        }
        //ELIMINAR ARCHIVOS Y REGISTRO EN TABLA DE AQUELLAS SOLUCIONES QUE FUERON ELIMINADAS EN EL FRONT.
        const preguntaSolucionesEliminar = await PreguntaSolucion.findAll({ 
            where: { 
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo: {[Op.notIn] : soluciones.map(solucion => solucion.codigo)}},
                ]
            },
            raw: true,
        });
        //ELIMINA ARCHIVOS
        for(let solucionEliminar of preguntaSolucionesEliminar){
            if(solucionEliminar.imagen.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionEliminar.imagen}`);
            }
            if(solucionEliminar.video.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionEliminar.video}`);
            }
            if(solucionEliminar.audio.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionEliminar.audio}`);
            }
        }   
        //ELIMINA DATOS
        await PreguntaSolucion.destroy({ 
            where: { 
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo: {[Op.notIn] : soluciones.map(alternativa => alternativa.codigo)}},
                ]
            } 
        });


        //ACTUALIZA O CREA SEGUN CORRESPONDA.
        for(let solucion of soluciones){
                     
            const solucionPregunta = await PreguntaSolucion.findByPk(solucion.codigo, {
                raw: true,
            });

            let imagen_solucion = '';
            //Si la imagen no está vacía
            if(solucion.imagen.trim() !== ''){
                //Si la imagen es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(solucion.imagen)){
                    let imagen_solucion_ext = solucion.imagen.substr(
                        solucion.imagen.lastIndexOf('.') + 1
                    )
                    imagen_solucion = `img-solucion-${solucion.numero}.${imagen_solucion_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/soluciones/${solucionPregunta.imagen}`,
                        `${dir_pregunta}${codigo}/soluciones/${imagen_solucion}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual que pudo ser (imagen, audio o video).
                    if(solucionPregunta){
                        if(solucionPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.imagen}`);
                        }
                        if(solucionPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.video}`);
                        }
                        if(solucionPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let imagen_solucion_ext = solucion.imagen.substring("data:image/".length, solucion.imagen.indexOf(";base64"));
                    imagen_solucion = `img-solucion-${solucion.numero}.${imagen_solucion_ext}`;

                    //Graba el archivo de la pregunta.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/soluciones/${imagen_solucion}`, 
                        solucion.imagen.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }

            }

            let video_solucion = '';
            //Si el video no está vacío
            if(solucion.video.trim() !== ''){
                //Si el video es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(solucion.video)){
                    let video_solucion_ext = solucion.video.substr(
                        solucion.video.lastIndexOf('.') + 1
                    )
                    video_solucion = `vd-solucion-${solucion.numero}.${video_solucion_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/soluciones/${solucionPregunta.video}`,
                        `${dir_pregunta}${codigo}/soluciones/${video_solucion}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual.
                    if(solucionPregunta){
                        if(solucionPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.imagen}`);
                        }
                        if(solucionPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.video}`);
                        }
                        if(solucionPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let video_solucion_ext = solucion.video.substring("data:image/".length, solucion.video.indexOf(";base64"));
                    video_solucion = `vd-solucion-${solucion.numero}.${video_solucion_ext}`;

                    //Graba el archivo de la pregunta.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/soluciones/${video_solucion}`, 
                        solucion.video.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }

            }

            let audio_solucion = '';
            //Si el audio no está vacío
            if(solucion.audio.trim() !== ''){
                //Si el audio es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(solucion.audio)){
                    let audio_solucion_ext = solucion.audio.substr(
                        solucion.audio.lastIndexOf('.') + 1
                    )
                    audio_solucion = `ad-solucion-${solucion.numero}.${audio_solucion_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/soluciones/${solucionPregunta.audio}`,
                        `${dir_pregunta}${codigo}/soluciones/${audio_solucion}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual.
                    if(solucionPregunta){
                        if(solucionPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.imagen}`);
                        }
                        if(solucionPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.video}`);
                        }
                        if(solucionPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/soluciones/${solucionPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let audio_solucion_ext = solucion.audio.substring("data:image/".length, solucion.audio.indexOf(";base64"));
                    audio_solucion = `ad-solucion-${solucion.numero}.${audio_solucion_ext}`;

                    //Graba el archivo de la pregunta.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/soluciones/${audio_solucion}`, 
                        solucion.audio.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }

            }

            if(solucionPregunta){
                await PreguntaSolucion.update({
                    numero: solucion.numero,
                    texto: solucion.texto,
                    imagen: imagen_solucion,
                    audio: audio_solucion,
                    video: video_solucion,
                },{
                    where:{
                        codigo: solucion.codigo,
                    }
                });
            }else{
                await PreguntaSolucion.create({
                    codigo: solucion.codigo,
                    codigo_pregunta: codigo,
                    numero: solucion.numero,
                    texto: solucion.texto,
                    imagen: imagen_solucion,
                    audio: audio_solucion,
                    video: video_solucion,
                });
            }

        }

        //********PISTAS
        if(pistas.length > 0){
            await fs.promises.mkdir(`${dir_pregunta}/${codigo}/pistas`, {recursive: true});
        }
        //ELIMINAR ARCHIVOS Y REGISTRO EN TABLA DE AQUELLAS PISTAS QUE FUERON ELIMINADAS EN EL FRONT.
        const preguntaPistasEliminar = await PreguntaPista.findAll({ 
            where: { 
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo: {[Op.notIn] : pistas.map(pista => pista.codigo)}},
                ]
            },
            raw: true,
        });
        //ELIMINA ARCHIVOS
        for(let pistaEliminar of preguntaPistasEliminar){
            if(pistaEliminar.imagen.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaEliminar.imagen}`);
            }
            if(pistaEliminar.video.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaEliminar.video}`);
            }
            if(pistaEliminar.audio.trim() !== ''){
                await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaEliminar.audio}`);
            }
        }   
        //ELIMINA DATOS
        await PreguntaPista.destroy({ 
            where: { 
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo: {[Op.notIn] : pistas.map(pista => pista.codigo)}},
                ]
            } 
        });

        for(let pista of pistas){

            const pistaPregunta = await PreguntaPista.findByPk(pista.codigo, {
                raw: true,
            });
        
            let imagen_pista = '';
            //Si la imagen no está vacía
            if(pista.imagen.trim() !== ''){
                //Si la imagen es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(pista.imagen)){
                    let imagen_pista_ext = pista.imagen.substr(
                        pista.imagen.lastIndexOf('.') + 1
                    )
                    imagen_pista = `img-pista-${pista.numero}.${imagen_pista_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/pistas/${pistaPregunta.imagen}`,
                        `${dir_pregunta}${codigo}/pistas/${imagen_pista}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual que pudo ser (imagen, audio o video).
                    if(pistaPregunta){
                        if(pistaPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.imagen}`);
                        }
                        if(pistaPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.video}`);
                        }
                        if(pistaPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let imagen_pista_ext = pista.imagen.substring("data:image/".length, pista.imagen.indexOf(";base64"));
                    imagen_pista = `img-pista-${pista.numero}.${imagen_pista_ext}`;
        
                    //Graba el archivo de la pista.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/pistas/${imagen_pista}`, 
                        pista.imagen.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }
        
            }

            let video_pista = '';
            //Si el video no está vacío
            if(pista.video.trim() !== ''){
                //Si el video es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(pista.video)){
                    let video_pista_ext = pista.video.substr(
                        pista.video.lastIndexOf('.') + 1
                    )
                    video_pista = `vd-pista-${pista.numero}.${video_pista_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/pistas/${pistaPregunta.video}`,
                        `${dir_pregunta}${codigo}/pistas/${video_pista}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual.
                    if(pistaPregunta){
                        if(pistaPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.imagen}`);
                        }
                        if(pistaPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.video}`);
                        }
                        if(pistaPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let video_pista_ext = pista.video.substring("data:image/".length, pista.video.indexOf(";base64"));
                    video_pista = `vd-pista-${pista.numero}.${video_pista_ext}`;

                    //Graba el archivo de la pregunta.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/pistas/${video_pista}`, 
                        pista.video.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }

            }

            let audio_pista = '';
            //Si el audio no está vacío
            if(pista.audio.trim() !== ''){
                //Si el audio es una url (No se modificó pero pudo cambiar el número de solución)
                if(isUrl(pista.audio)){
                    let audio_pista_ext = pista.audio.substr(
                        pista.audio.lastIndexOf('.') + 1
                    )
                    audio_pista = `ad-pista-${pista.numero}.${audio_pista_ext}`
                    await fs.promises.rename(
                        `${dir_pregunta}${codigo}/pistas/${pistaPregunta.audio}`,
                        `${dir_pregunta}${codigo}/pistas/${audio_pista}`,
                    )
                //Sino, es un base64 y debo procesarlo.
                }else{
                    //Elimina el archivo actual.
                    if(pistaPregunta){
                        if(pistaPregunta.imagen.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.imagen}`);
                        }
                        if(pistaPregunta.video.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.video}`);
                        }
                        if(pistaPregunta.audio.trim() !== ''){
                            await fs.promises.unlink(`${dir_pregunta}${codigo}/pistas/${pistaPregunta.audio}`);
                        }
                    }
                    //Obtiene la extension del archivo desde el base64.
                    let audio_pista_ext = pista.audio.substring("data:image/".length, pista.audio.indexOf(";base64"));
                    audio_pista = `ad-pista-${pista.numero}.${audio_pista_ext}`;

                    //Graba el archivo de la pregunta.
                    await fs.promises.writeFile(
                        `${dir_pregunta}${codigo}/pistas/${audio_pista}`, 
                        pista.audio.split(';base64,').pop(), 
                        {encoding: 'base64'}
                    );                    
                }

            }

            if(pistaPregunta){
                await PreguntaPista.update({
                    numero: pista.numero,
                    texto: pista.texto,
                    imagen: imagen_pista,
                    audio: audio_pista,
                    video: video_pista,
                },{
                    where:{
                        codigo: pista.codigo,
                    }
                });
            }else{
                await PreguntaPista.create({
                    codigo: pista.codigo,
                    codigo_pregunta: codigo,
                    numero: pista.numero,
                    texto: pista.texto,
                    imagen: imagen_pista,
                    audio: audio_pista,
                    video: video_pista,
                });
            }       
        
        }

        
        //MODULOS
        await PreguntaModulo.destroy({
            where: {
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo_modulo: {[Op.notIn] : modulos.map(modulo => modulo.codigo)}},
                ]
            }
        });

        for(let modulo of modulos){
            const {codigo, codigo_pregunta} = modulo;
            await creaPreguntaModulo(codigo_pregunta, codigo);
        }
       
        //CONTENIDOS
        await PreguntaModuloContenido.destroy({ 
            where:{
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo_modulo_contenido: {[Op.notIn] : contenidos.map(contenido => contenido.codigo)}},
                ]
            }
        });

        for(let contenido of contenidos){
            const {codigo, codigo_pregunta} = contenido;
            await creaPreguntaModuloContenido(codigo_pregunta, codigo);
        }

        //TEMAS
        await PreguntaModuloContenidoTema.destroy({
            where:{
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo_modulo_contenido_tema: {[Op.notIn] : temas.map(tema => tema.codigo)}},
                ]
            } 
        });

        for(let tema of temas){
            const {codigo, codigo_pregunta} = tema;
            await creaPreguntaModuloContenidoTema(codigo_pregunta, codigo);
        }

        //CONCEPTOS
        await PreguntaModuloContenidoTemaConcepto.destroy({
            where:{
                [Op.and]:[
                    {codigo_pregunta: { [Op.eq] : codigo}},
                    {codigo_modulo_contenido_tema_concepto: {[Op.notIn] : conceptos.map(concepto => concepto.codigo)}},
                ] 
            }
        });

        for(let concepto of conceptos){
            const {codigo, codigo_pregunta} = concepto;
            await creaPreguntaModuloContenidoTemaConcepto(codigo_pregunta, codigo);
        }

        res.json({
            pregunta
        });
     
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}