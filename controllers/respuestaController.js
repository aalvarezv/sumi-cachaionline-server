const { 
    Respuesta, 
    RespuestaAlternativa,
    RespuestaPista,
    RespuestaSolucion,
    Single, 
    Ring,
    RingPregunta, 
    Pregunta, 
    PreguntaAlternativa, 
    PreguntaPista,
    PreguntaSolucion,
    Usuario,
    sequelize,
} = require('../database/db');
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');

const { QueryTypes } = require('sequelize');


exports.guardarRespuesta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {
                
        let {
            rut_usuario,
            codigo_single,
            codigo_ring,
            codigo_pregunta,
            alternativas,
            tiempo,
            omitida,
            timeout,
            vio_pista,
            pistas,
            vio_solucion,
            soluciones,
        } = req.body;

        alternativas = alternativas.filter(alternativa => alternativa !== '')
        pistas = pistas.filter(pista => pista !== '')
        soluciones = soluciones.filter(solucion => solucion !== '')

        tiempo = Number(tiempo)
        if(typeof tiempo !== "number"){
            return res.status(400).send({
                msg: 'El campo tiempo debe ser numérico.'
            })
        }

        omitida = (omitida === "true")
        if(typeof omitida !== "boolean"){
            return res.status(400).send({
                msg: 'El campo omitida debe ser booleano.'
            })
        }

        timeout = (timeout === "true")
        if(typeof timeout !== "boolean"){
            return res.status(400).send({
                msg: 'El campo timeout debe ser booleano.'
            })
        }

        //Si envía omitida y timeout, lanzo mensaje de error ya que no pueden ser ambas true.
        if(omitida && timeout){
            return res.status(400).send({
                msg: 'La respuesta no puede ser omitida y timeout al mismo tiempo.'
            })
        }

        vio_pista = (vio_pista === "true")
        if(typeof vio_pista !== "boolean"){
            return res.status(400).send({
                msg: 'El campo vio_pista debe ser booleano.'
            })
        }

        vio_solucion = (vio_solucion === "true")
        if(typeof vio_solucion !== "boolean"){
            return res.status(400).send({
                msg: 'El campo vio_solucion debe ser booleano.'
            })
        }

        let usuario = await Usuario.findByPk(rut_usuario);
        if(!usuario){
            return res.status(400).json({
                msg: `El rut usuario ${rut_usuario} no es válido.`
            });
        } 

        if(codigo_ring && codigo_ring.trim() !== ''){
            //verifica que el ring es válido
            let ring = await Ring.findByPk(codigo_ring)
            if(!ring){
                return res.status(400).json({
                    msg: 'El código ring no es válido.'
                });
            }

        }else if(codigo_single && codigo_single.trim() !== ''){
            //verifica que el single sea válido.
            let single = await Single.findByPk(codigo_single);
            if (!single) {
                return res.status(400).json({
                    msg: 'El código single no es válido.'
                });
            }
        }else{
            return res.status(400).json({
                msg: 'Debe enviar un código single o un código ring.'
            })
        }   

        //verifica que la pregunta sea valida
        let pregunta = await Pregunta.findByPk(codigo_pregunta);
        if (!pregunta) {
            return res.status(400).json({
                msg: 'El código pregunta no es válido.'
            });
        }
        //Obtiene la cantidad de respuestas correctas que tiene la pregunta.
        let alternativasCorrectasPregunta = await PreguntaAlternativa.count({
            where: {
                codigo_pregunta,
                correcta: true,
            }
        })

        let alternativasCorrectasRespuesta = 0

        if(!omitida && !timeout){

            if(alternativas.length === 0){
                return res.status(400).json({
                    msg: 'Debe enviar los códigos de alternativa(s) elegidas por el usuario.'
                });
            }

            //verifica que las alternativas sean válidas.
            for(let alternativa of alternativas){
                
                const alternativaValida = await PreguntaAlternativa.findOne({
                    where: {
                        codigo: alternativa,
                        codigo_pregunta, 
                    },
                    raw: true,
                    nested: false,
                }); 

                if (!alternativaValida) {
                    return res.status(400).json({
                        msg: `Código alternativa ${alternativa} no es válido.`
                    });
                }

                if(alternativaValida.correcta === 1){
                    alternativasCorrectasRespuesta++
                }

            }
            
        }

        let correcta = 0;
        //La pregunta será correcta si la cantidad de alternativas recibidas es igual a la cantidad de alternativas correctas de la respuesta.
        if(alternativasCorrectasPregunta === alternativasCorrectasRespuesta && alternativas.length === alternativasCorrectasPregunta){
            correcta = 1
        }

        if(vio_pista){

            if(pistas.length === 0){
                return res.status(400).json({
                    msg: 'Debe enviar los códigos de pistas vistas por el usuario.'
                });
            }
            //valida que las pistas sean válidas.
            for(let pista of pistas){
                
                const pistaValida = await PreguntaPista.findOne({
                    where: {
                        codigo: pista,
                        codigo_pregunta, 
                    }
                }); 

                if (!pistaValida) {
                    return res.status(400).json({
                        msg: `Código pista ${pista} no es válido.`
                    });
                }

            }

        }

        if(vio_solucion){

            if(soluciones.length === 0){
                return res.status(400).json({
                    msg: 'Debe enviar los códigos de soluciones vistas por el usuario.'
                });
            }

            for(let solucion of soluciones){

                const solucionValida = await PreguntaSolucion.findOne({
                    where: {
                        codigo: solucion,
                        codigo_pregunta,
                    }
                });

                if (!solucionValida) {
                    return res.status(400).json({
                        msg: `Código solución ${solucion} no es válido.`
                    });
                }

            }

        }

        let respuestaExiste = await Respuesta.findOne({
            where:{
                rut_usuario,
                codigo_pregunta,
                codigo_single: !codigo_single || codigo_single === '' ? null : codigo_single,
                codigo_ring: !codigo_ring || codigo_ring === '' ? null : codigo_ring,
            },
            raw: true,
        })

        //Puntajes de acuerdo a ring pregunta
        let puntos = 0
        if(codigo_ring && codigo_ring !== ''){

            let puntajesRingPregunta = await RingPregunta.findOne({
                where:{
                    codigo_pregunta,
                    codigo_ring,
                },
                raw: true
            })

            if(omitida){
                puntos = puntajesRingPregunta.puntos_respuesta_omitida
            }else if(timeout){
                puntos = puntajesRingPregunta.puntos_respuesta_timeout
            }else if(correcta === 1){
                puntos = puntajesRingPregunta.puntos_respuesta_correcta
            }else if(correcta === 0){
                puntos = puntajesRingPregunta.puntos_respuesta_incorrecta
            }else{
                puntos = 0
            }

            puntos = puntos * puntajesRingPregunta.puntos_factor

        }
        
        if(respuestaExiste){

            await Respuesta.update({
                tiempo,
                correcta: omitida || timeout ? 0 : correcta,
                omitida,
                timeout,
                puntos,
                vio_pista: vio_pista === true ? vio_pista : respuestaExiste.vio_pista,
                vio_solucion: vio_solucion === true ? vio_solucion : respuestaExiste.vio_solucion,
            },{
                where:{
                    codigo: respuestaExiste.codigo
                }
            });

            await RespuestaAlternativa.destroy({
                where: {
                    codigo_respuesta: respuestaExiste.codigo,
                }
            });

            if(!omitida && !timeout){
                for(let alternativa of alternativas){

                    await RespuestaAlternativa.create({
                        codigo_respuesta: respuestaExiste.codigo,
                        codigo_alternativa: alternativa,    
                    });
            
                }
            }

            if(vio_pista){

                for(let pista of pistas){

                    let pistaExiste = await RespuestaPista.findOne({
                        where:{
                            codigo_respuesta: respuestaExiste.codigo,
                            codigo_pista: pista,
                        }
                    })

                    if(!pistaExiste){
                        await RespuestaPista.create({
                            codigo_respuesta: respuestaExiste.codigo,
                            codigo_pista: pista,
                        })
                    }
                    
                }  

            }

            if(vio_solucion){

                for(let solucion of soluciones){

                    let solucionExiste = await RespuestaSolucion.findOne({
                        where:{
                            codigo_respuesta: respuestaExiste.codigo,
                            codigo_solucion: solucion,
                        }                        
                    })

                    if(!solucionExiste){
                        await RespuestaSolucion.create({
                            codigo_respuesta: respuestaExiste.codigo,
                            codigo_solucion: solucion,
                        })
                    }
                    
                }   
            }

            respuestaExiste = await Respuesta.findByPk(respuestaExiste.codigo)


            const resultados = await getResultadosPorUsuario(rut_usuario, codigo_single, codigo_ring);

            res.json({
                msg: 'Respuesta actualizada',
                respuesta: respuestaExiste,
                resultados,
            })

        }else{
            //Guarda la respuesta.
            let codigo = uuidv4()
            let respuesta = await Respuesta.create({
                codigo,
                rut_usuario,
                codigo_single: !codigo_single || codigo_single === '' ? null : codigo_single,
                codigo_ring: !codigo_ring || codigo_ring === '' ? null : codigo_ring,
                codigo_pregunta,
                tiempo,
                correcta: omitida || timeout ? 0 : correcta,
                omitida,
                timeout,
                puntos,
                vio_pista,
                vio_solucion,
            }); 

            if(!omitida && !timeout){
                for(let alternativa of alternativas){
                    await RespuestaAlternativa.create({
                        codigo_respuesta: codigo,
                        codigo_alternativa: alternativa,    
                    });
                }
            }
            

            if(vio_pista){
                for(let pista of pistas){
                    await RespuestaPista.create({
                        codigo_respuesta: codigo,
                        codigo_pista: pista,
                    });
                }   
            }

            if(vio_solucion){
                for(let solucion of soluciones){
                    await RespuestaSolucion.create({
                        codigo_respuesta: codigo,
                        codigo_solucion: solucion,
                    });
                }   
            }

            const resultados = await getResultadosPorUsuario(rut_usuario, codigo_single, codigo_ring);

            //envía la respuesta
            res.json({
                msg: 'Respuesta grabada',
                respuesta,
                resultados,
            });

        }
       
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

const getResultadosPorUsuario = (rut_usuario, codigo_single, codigo_ring) => {

    return new Promise(async(resolve, reject) => {

        try {
            
            const resultados = await sequelize.query(`
                SELECT 
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = '${rut_usuario}' 
                        AND ${codigo_single ? "codigo_single='"+codigo_single+"'" : "codigo_ring ='"+codigo_ring+"'"} 
                        AND correcta = 1 
                        AND omitida = 0
                        AND timeout = 0) AS total_correctas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = '${rut_usuario}' 
                        AND ${codigo_single ? "codigo_single='"+codigo_single+"'" : "codigo_ring ='"+codigo_ring+"'"} 
                        AND correcta = 0 
                        AND omitida = 0
                        AND timeout = 0) AS total_incorrectas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = '${rut_usuario}' 
                        AND ${codigo_single ? "codigo_single='"+codigo_single+"'" : "codigo_ring ='"+codigo_ring+"'"} 
                        AND correcta = 0
                        AND omitida = 1
                        AND timeout = 0) AS total_omitidas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = '${rut_usuario}' 
                        AND ${codigo_single ? "codigo_single='"+codigo_single+"'" : "codigo_ring ='"+codigo_ring+"'"} 
                        AND correcta = 0 
                        AND omitida = 0
                        AND timeout = 1) AS total_timeout,
                    CAST((SELECT SUM(puntos) 
                        FROM respuestas 
                        WHERE rut_usuario = '${rut_usuario}' 
                        AND ${codigo_single ? "codigo_single='"+codigo_single+"'" : "codigo_ring ='"+codigo_ring+"'"}
                        ) AS SIGNED) AS total_puntos
            `, { type: QueryTypes.SELECT })

            resolve(resultados[0]);

        } catch (error) {
            reject(error);
        }

    })


}

