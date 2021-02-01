const { Pregunta, PreguntaAlternativa, PreguntaSolucion, 
        PreguntaPista, PreguntaModulo, PreguntaModuloContenido, 
        PreguntaModuloContenidoTema, PreguntaModuloContenidoTemaConcepto,
        ModuloContenidoTema, ModuloContenidoTemaConcepto, RingPregunta,
        Usuario, Modulo, ModuloContenido, Unidad, Materia, Configuracion, sequelize } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');
const fs = require('fs');
const findRemoveSync = require('find-remove');
const { creaPreguntaModulo, 
        creaPreguntaModuloContenido, 
        creaPreguntaModuloContenidoTema, 
        creaPreguntaModuloContenidoTemaConcepto,
        getDirPreguntas,
        fileToBase64,
        } = require('../helpers');

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

        let dir_pregunta = await getDirPreguntas();

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
            let audio_pregunta_ext = video.substring("data:audio/".length, audio.indexOf(";base64"));
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
                'imagen',
                'audio',
                'video',
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

        let dir_pregunta = await getDirPreguntas();

        let new_preguntas = [];
        for (let pregunta of JSON.parse(JSON.stringify(preguntas))){

            if(pregunta.imagen.trim() !== ''){
                let imagenBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.imagen}`);
                new_preguntas.push({
                    ...pregunta,
                    imagen : imagenBase64,
                });
            }else if(pregunta.audio.trim() !== ''){
                let audioBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.audio}`);
                new_preguntas.push({
                    ...pregunta,
                    audio: audioBase64,
                });
            }else if(pregunta.video.trim() !== ''){
                let videoBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.video}`);
                new_preguntas.push({
                    ...pregunta,
                    video: videoBase64,
                });
            }else{
                new_preguntas.push(pregunta);
            }

        }

        res.send({
            preguntas: new_preguntas,
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
                // [Sequelize.literal('CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END'),'imagen'],
                'imagen',
                'audio',
                'video',
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
            ],
        });

        let dir_pregunta = await getDirPreguntas();

        let new_preguntas = [];
        for (let pregunta of JSON.parse(JSON.stringify(preguntas))){

            if(pregunta.imagen.trim() !== ''){
                let imagenBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.imagen}`);
                new_preguntas.push({
                    ...pregunta,
                    imagen : imagenBase64,
                });
            }else if(pregunta.audio.trim() !== ''){
                let audioBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.audio}`);
                new_preguntas.push({
                    ...pregunta,
                    audio: audioBase64,
                });
            }else if(pregunta.video.trim() !== ''){
                let videoBase64 = await fileToBase64(`${dir_pregunta}${pregunta.codigo}/${pregunta.video}`);
                new_preguntas.push({
                    ...pregunta,
                    video: videoBase64,
                });
            }else{
                new_preguntas.push(pregunta);
            }

        }

        res.send({
            preguntas: new_preguntas,
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
        let dir_pregunta = await getDirPreguntas();
    
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
                'imagen',
                'audio',
                'video',
                'duracion',
            ],
            include:[{
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
            },{
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: ['codigo', 
                             'numero', 
                             'texto',
                             'imagen',
                             'audio',
                             'video',
                ],
            },{
                model: PreguntaPista,
                attributes: ['codigo', 
                             'numero', 
                             'texto', 
                             'imagen',
                             'audio',
                             'video',
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
                    'ASC',
                ],[{ model: PreguntaSolucion },
                    'numero',
                    'ASC',
                ],[{ model: PreguntaPista },
                    'numero',
                    'ASC',
                ],
            ],
        });

        if (!pregunta) {
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }

        let dir_pregunta = await getDirPreguntas();
        pregunta = JSON.parse(JSON.stringify(pregunta));

        if(pregunta.imagen.trim() !== ''){
            let imagenBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/${pregunta.imagen}`);
            pregunta = {
                ...pregunta,
                imagen : imagenBase64,
            }
        }
        if(pregunta.audio.trim() !== ''){
            let audioBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/${pregunta.audio}`);
            pregunta = {
                ...pregunta,
                audio: audioBase64,
            }
        }
        if(pregunta.video.trim() !== ''){
            let videoBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/${pregunta.video}`);
            pregunta = {
                ...pregunta,
                video: videoBase64,
            }
        }
        
        let new_soluciones = [];
        for(let solucion of pregunta.pregunta_solucion){

            if(solucion.imagen.trim() !== ''){
                let imagenBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/soluciones/${solucion.imagen}`);
                new_soluciones.push({
                    ...solucion,
                    imagen: imagenBase64
                });
            }else if(solucion.audio.trim() !== ''){
                let audioBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/soluciones/${solucion.audio}`);
                new_soluciones.push({
                    ...solucion,
                    audio: audioBase64
                });
            }else if(solucion.video.trim() !== ''){
                let videoBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/soluciones/${solucion.video}`);
                new_soluciones.push({
                    ...solucion,
                    video: videoBase64
                });
            }else{
                new_soluciones.push(solucion);
            }
        }
        
        let new_pistas = [];
        for(let pista of pregunta.pregunta_pista){
            if(pista.imagen.trim() !== ''){
                let imagenBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/pistas/${pista.imagen}`);
                new_pistas.push({
                    ...pista,
                    imagen: imagenBase64
                });
            }else if(pista.audio.trim() !== ''){
                let audioBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/pistas/${pista.audio}`);
                new_pistas.push({
                    ...pista,
                    audio: audioBase64
                });
            }else if(pista.video.trim() !== ''){
                let videoBase64 = await fileToBase64(`${dir_pregunta}/${codigo}/pistas/${pista.video}`);
                new_pistas.push({
                    ...pista,
                    video: videoBase64
                });
            }else{
                new_pistas.push(pista)
            }
        }

        pregunta = {
            ...pregunta,
            pregunta_solucion: new_soluciones,
            pregunta_pista: new_pistas,
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

        let pregunta = await Pregunta.findByPk(codigo);
        if (!pregunta) {
            return res.status(400).json({
                msg: 'La pregunta no existe, vuelva a intentar'
            });
        }

        //******ELIMINA LOS ARCHIVOS DE LA PREGUNTA SOLUCIONES, PISTAS, ETC.
        let dir_pregunta = await getDirPreguntas();

        findRemoveSync(dir_pregunta, { dir: codigo });

        //Crea el directorio (codigo pregunta) para almacenar los archivos de la pregunta.
        await fs.promises.mkdir(`${dir_pregunta}/${codigo}`, {recursive: true});

        let imagen_pregunta = ''
        if (imagen.trim() !== ''){
            //Obtiene la extension del archivo imagen de la pregunta.
            let imagen_pregunta_ext = imagen.substring("data:image/".length, imagen.indexOf(";base64"));
            imagen_pregunta = `img-pregunta.${imagen_pregunta_ext}`;
            
            //Graba el archivo de la pregunta.
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
            let audio_pregunta_ext = video.substring("data:audio/".length, audio.indexOf(";base64"));
            audio_pregunta = `ad-pregunta.${audio_pregunta_ext}`;
            //Escribe el archivo audio de la pregunta en disco.
            await fs.promises.writeFile(`${dir_pregunta}/${codigo}/${audio_pregunta}`, audio.split(';base64,').pop(), {encoding: 'base64'});
        }

        //Actualiza la pregunta en la base de datos.
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

        //******ELIMINA ALTERNATIVAS
        await PreguntaAlternativa.destroy({ where: { codigo_pregunta: codigo } });

        //******ELIMINA SOLUCIONES
        await PreguntaSolucion.destroy({ where: { codigo_pregunta: codigo } });

        //******ELIMINA PISTAS
        await PreguntaPista.destroy({ where: { codigo_pregunta: codigo } });

        //******ELIMINA MODULOS
        await PreguntaModulo.destroy({ where: { codigo_pregunta: codigo } });

        //******ELIMINA CONTENIDOS MODULO
        await PreguntaModuloContenido.destroy({ where: { codigo_pregunta: codigo }});

        //******ELIMINA TEMA CONTENIDOS MODULO
        await PreguntaModuloContenidoTema.destroy({ where: { codigo_pregunta: codigo } });

        //******ELIMINA CONCEPTO TEMA CONTENIDOS MODULO
        await PreguntaModuloContenidoTemaConcepto.destroy({ where: { codigo_pregunta: codigo } });


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