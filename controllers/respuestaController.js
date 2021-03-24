const { 
    Respuesta, 
    Single, 
    Ring, 
    Pregunta, 
    PreguntaAlternativa, 
    RespuestaPista,
    RespuestaSolucion,
    Usuario,
} = require('../database/db');
const uuidv4 = require('uuid').v4;
//llama el resultado de la validación
const { validationResult } = require('express-validator');

exports.guardarRespuesta = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {
                
        const {
            rut_usuario,
            codigo_single,
            codigo_ring,
            codigo_pregunta,
            codigo_alternativa,
            tiempo,
            correcta,
            omitida,
            vio_pista,
            pistas,
            vio_solucion,
            soluciones,
        } = req.body;

        let usuario = await Usuario.findByPk(rut_usuario);
        if(!usuario){
            return res.status(400).json({
                msg: 'El rut usuario no es válido.'
            });
        } 

        if(codigo_ring && codigo_ring.trim() !== ''){
            //verifica que el ring es válidog
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

        if(!omitida){
            //verifica que la alternativa sea válida.
            let alternativa = await PreguntaAlternativa.findByPk(codigo_alternativa);
            if (!alternativa) {
                return res.status(400).json({
                    msg: 'El código alternativa no es válido.'
                });
            }
        }

        if(vio_pista){
            if(pistas.length === 0){
                return res.status(400).json({
                    msg: 'Debe enviar los códigos de pistas vistas por el usuario.'
                });
            }
        }

        if(vio_solucion){
            if(soluciones.length === 0){
                return res.status(400).json({
                    msg: 'Debe enviar los códigos de soluciones vistas por el usuario.'
                });
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

        if(respuestaExiste){

            await Respuesta.update({
                codigo_alternativa,
                tiempo,
                correcta,
                omitida,
                vio_pista,
                vio_solucion,
            },{
                where:{
                    codigo: respuestaExiste.codigo
                }
            });

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
                            codigo_respuesta: codigo,
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
                            codigo_respuesta: codigo,
                            codigo_solucion: solucion,
                        })
                    }
                    
                }   
            }

            res.json({
                msg: 'Respuesta actualizada',
                respuesta: respuestaExiste,
            })


        }else{

            //Guarda el nuevo ring
            let codigo = uuidv4()
            let respuesta = await Respuesta.create({
                codigo,
                rut_usuario,
                codigo_single: !codigo_single || codigo_single === '' ? null : codigo_single,
                codigo_ring: !codigo_ring || codigo_ring === '' ? null : codigo_ring,
                codigo_pregunta,
                codigo_alternativa,
                tiempo,
                correcta,
                omitida,
                vio_pista,
                vio_solucion,

            }); 

            if(vio_pista){
                for(let pista of pistas){
                    await RespuestaPista.create({
                        codigo_respuesta: codigo,
                        codigo_pista: pista,
                    })
                }   
            }

            if(vio_solucion){
                for(let solucion of soluciones){
                    await RespuestaSolucion.create({
                        codigo_respuesta: codigo,
                        codigo_solucion: solucion,
                    })
                }   
            }

            //envía la respuesta
            res.json({
                msg: 'Respuesta grabada',
                respuesta
            });

        }
       
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}