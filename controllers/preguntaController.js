const { Pregunta, PreguntaAlternativa, PreguntaSolucion, 
        PreguntaPista, PreguntaModulo, PreguntaModuloPropiedad, 
        Usuario, Modulo, ModuloPropiedad, Unidad, Materia, Configuracion, sequelize } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');
const fs = require('fs');
const findRemoveSync = require('find-remove');

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
            modulos,
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

        //Obtiene el directorio donde serán almacenados los archivos multimedia para la pregunta.
        //Imagen Pregunta, Imagen, Video y Audio para Solucion y Pistas.
        let dir_pregunta = await Configuracion.findOne({
            where:{
                seccion: 'PREGUNTAS',
                clave: 'DIR'
            }
        });
        dir_pregunta = dir_pregunta.dataValues.valor;
        if (!dir_pregunta) {
            return res.status(404).send({
                msg: `No existe sección PREGUNTAS clave DIR en la configuración, verifique.`
            })
        }

        //Crea el directorio (codigo pregunta) para almacenar los archivos de la pregunta.
        await fs.promises.mkdir(`${dir_pregunta}/${codigo}`, {recursive: true});
        
        //Obtiene la extension del archivo imagen de la pregunta.
        let imagen_pregunta_ext = imagen.substring("data:image/".length, imagen.indexOf(";base64"));
        let imagen_pregunta = `img-pregunta.${imagen_pregunta_ext}`;
        //Escribe el archivo de la pregunta en disco.
        await fs.promises.writeFile(`${dir_pregunta}/${codigo}/${imagen_pregunta}`, imagen.split(';base64,').pop(), {encoding: 'base64'});
        
        //Graba la pregunta en la base de datos.
        await Pregunta.create({
            codigo,
            rut_usuario_creador,
            texto,
            imagen: imagen_pregunta,
            audio,
            video,
        });

        //*********MODULOS Y PROPIEDADES
        //Recorre los modulos que pudieron ser asociados a la pregunta.
        for(let modulo of modulos){
            await PreguntaModulo.create({
                codigo_pregunta: modulo.codigo_pregunta,
                codigo_modulo: modulo.codigo,
            });
            //Si el modulo tiene propiedades, también las asigna.
            if(modulo.propiedades){
                for(let propiedad of modulo.propiedades){
                    await PreguntaModuloPropiedad.create({
                        codigo_pregunta: modulo.codigo_pregunta,
                        codigo_modulo_propiedad: propiedad.codigo,
                    })
                }
            }
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

            //Crea el registro en la base de datos.
            await PreguntaSolucion.create({
                codigo: solucion.codigo,
                codigo_pregunta: solucion.codigo_pregunta,
                numero: solucion.numero,
                texto: solucion.texto,
                imagen: imagen_solucion,
                audio: '',
                video: '',
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
        
            //Crea el registro en la base de datos.
            await PreguntaPista.create({
                codigo: pista.codigo,
                codigo_pregunta: pista.codigo_pregunta,
                numero: pista.numero,
                texto: pista.texto,
                imagen: imagen_pista,
                audio: '',
                video: '',
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

        const {  nombre_usuario_creador } = req.query;
        let { fecha_desde, fecha_hasta, codigo_materia, codigo_unidad, 
                codigo_modulo, codigo_propiedad_modulo } = req.query;
        //Estos campos son listas seleccionables, por lo que su valor por defecto es 0 = 'SELECCIONE'.
        //Si se envía seleccione, entonces se dejan vacíos para que funcione el like de la consulta y me traiga todos.
        if(codigo_materia.trim() === '0'){
            codigo_materia = '';
        }
        if(codigo_unidad.trim() === '0'){
            codigo_unidad = '';
        }
        if(codigo_modulo.trim() === '0'){
            codigo_modulo = '';
        }
        if(codigo_propiedad_modulo.trim() === '0'){
            codigo_propiedad_modulo = '';
        }

        //La fecha llega con hora, por lo tanto la formatea.
        fecha_desde = fecha_desde.split('T')[0];
        fecha_hasta = fecha_hasta.split('T')[0];

        const preguntas = await Pregunta.findAll({

            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal('CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END'),'imagen'],
                'audio',
                'video',
                'createdAt',
                'updatedAt',
            ],
            include:[{
                model: Usuario,
                attributes: ['rut', 'nombre'],
                required: false,
            },{
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
            },{
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: ['codigo', 'numero', 'texto', 
                            [Sequelize.literal('CASE WHEN pregunta_solucion.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta_solucion.codigo_pregunta,"/","soluciones","/",pregunta_solucion.imagen)) ELSE pregunta_solucion.imagen END'),'imagen']
                ],
            },{
                model: PreguntaPista,
                attributes: ['codigo', 'numero', 'texto', 
                            [Sequelize.literal('CASE WHEN pregunta_pista.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta_pista.codigo_pregunta,"/","pistas","/",pregunta_pista.imagen)) ELSE pregunta_pista.imagen END'),'imagen']
                ],
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
                model: PreguntaModuloPropiedad,
                as:'pregunta_modulo_propiedad',
                attributes: ['codigo_pregunta', 'codigo_modulo_propiedad'],
                as: 'pregunta_modulo_propiedad',
                include:[{
                    model: ModuloPropiedad,
                    attributes:['codigo', 'descripcion', 'codigo_modulo'],
                    include: [{
                        model: Modulo,
                        attributes: ['codigo', 'descripcion'],
                    }],
                }]
            }],
            where: {
                [Op.and]:[
                    sequelize.where( sequelize.fn('date', sequelize.col('pregunta.createdAt')), '>=', fecha_desde ),
                    sequelize.where( sequelize.fn('date', sequelize.col('pregunta.createdAt')), '<=', fecha_hasta ),
                    { inactivo: false },
                        sequelize.where(sequelize.col('usuario.nombre'),'LIKE','%'+nombre_usuario_creador+'%'),
                        //sequelize.where(sequelize.col('materia.codigo'),'LIKE','%'+codigo_materia+'%'),
                        {'$pregunta_modulos.modulo.unidad.materia.codigo$': { [Op.like]: `%${codigo_materia}%` } },
                        {'$pregunta_modulos.modulo.unidad.codigo$': { [Op.like]: `%${codigo_unidad}%` } },
                    //{[Op.or]:[
                        {'$pregunta_modulos.modulo.codigo$': { [Op.like]: `%${codigo_modulo}%` } },
                        {'$pregunta_modulo_propiedad.codigo_modulo_propiedad$': { [Op.like]: `%${codigo_propiedad_modulo}%` } },
                        //],
                    //}
                   
                ],   
            },
            order:[
                ['createdAt', 'DESC'],
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


        res.json({
            preguntas
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
        let dir_pregunta = await Configuracion.findOne({
            where:{
                seccion: 'PREGUNTAS',
                clave: 'DIR'
            }
        });
        dir_pregunta = dir_pregunta.dataValues.valor;
        if (!dir_pregunta) {
            return res.status(404).send({
                msg: `No existe sección PREGUNTAS clave DIR en la configuración, verifique.`
            })
        }

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

        //******PROPIEDADES MODULO
        await PreguntaModuloPropiedad.destroy({
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

        const pregunta = await Pregunta.findOne({
            attributes:[
                'codigo',
                'rut_usuario_creador',
                'texto',
                [Sequelize.literal('CASE WHEN pregunta.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta.codigo,"/",pregunta.imagen)) ELSE pregunta.imagen END'),'imagen'],
                'audio',
                'video',
                'createdAt',
                'updatedAt',
            ],
            include:[{
                model: PreguntaAlternativa,
                as: 'pregunta_alternativa',
                attributes: ['codigo', 'letra', 'correcta', 'numero'],
            },{
                model: PreguntaSolucion,
                as: 'pregunta_solucion',
                attributes: ['codigo', 'numero', 'texto', 
                            [Sequelize.literal('CASE WHEN pregunta_solucion.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta_solucion.codigo_pregunta,"/","soluciones","/",pregunta_solucion.imagen)) ELSE pregunta_solucion.imagen END'),'imagen']
                ],
            },{
                model: PreguntaPista,
                attributes: ['codigo', 'numero', 'texto', 
                            [Sequelize.literal('CASE WHEN pregunta_pista.imagen <> "" THEN (SELECT CONCAT((SELECT valor FROM configuraciones WHERE seccion="PREGUNTAS" AND clave="URL"),pregunta_pista.codigo_pregunta,"/","pistas","/",pregunta_pista.imagen)) ELSE pregunta_pista.imagen END'),'imagen']
                ],
            },{
                model: PreguntaModulo,
                attributes: ['codigo_pregunta', 'codigo_modulo'],
                include: [{
                    model: Modulo,
                    attributes: ['codigo', 'descripcion'],
                }]
            },{
                model: PreguntaModuloPropiedad,
                attributes: ['codigo_pregunta', 'codigo_modulo_propiedad'],
                as: 'pregunta_modulo_propiedad',
                include:[{
                    model: ModuloPropiedad,
                    attributes:['codigo', 'descripcion', 'codigo_modulo'],
                    include: [{
                        model: Modulo,
                        attributes: ['codigo', 'descripcion'],
                    }]
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

        res.json({
            pregunta
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}