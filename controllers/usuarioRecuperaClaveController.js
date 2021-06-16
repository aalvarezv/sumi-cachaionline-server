const { Usuario, UsuarioRecuperaClave, Configuracion } = require('../database/db')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const { sendMail, generaCodigo4Digitos } = require('../helpers')

exports.obtieneEmailUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { rut } = req.query;

        const usuario = await Usuario.findByPk(rut)
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //Revisa que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'El usuario se encuentra inactivo'
            })
        }

        const email = usuario.email

        res.json({
            rut,
            email
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}

exports.enviaEmailUsuario = async(req, res) => {


     //si hay errores de la validación
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
     }

    try{

        const { rut } = req.body;

        //Reviso si existe el usuario.
        const usuario = await Usuario.findByPk(rut)
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //Revisa que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'El usuario se encuentra inactivo'
            })
        }
        //Recupero el email del usuario a quien enviaré el codigo de recuperación por email.
        const emailUsuario = usuario.email

        
        //Reviso si existe un registro previo de recuperación.
        let usuarioRecuperaClave = await UsuarioRecuperaClave.findOne({
            where:{
                rut_usuario: rut,
            }
        });
       
        //Si existe, lo borro para crear uno nuevo.
        if(usuarioRecuperaClave){
            await UsuarioRecuperaClave.destroy({
                where: {
                    rut_usuario: rut,
                }
            })
        }
        

        //Genero el código que enviaré por email al usuario.
        let codigoRecuperaClave = generaCodigo4Digitos()

        //Guardo el registro
        await UsuarioRecuperaClave.create({
            rut_usuario: rut,
            codigo_recupera_clave: codigoRecuperaClave,
        });


       //Obtengo el asunto del email configurable en la base de datos.
        const configRecuperaClaveAsunto = await Configuracion.findOne({
            where:{
                seccion: 'RECUPERA_CLAVE',
                clave: 'ASUNTO'
            }
        })

        if(!configRecuperaClaveAsunto){
            return res.status(404).send({
                msg: 'seccion=RECUPERA_CLAVE clave=ASUNTO No existe en la configuración'
            })
        }

        let asuntoRecuperaClave = configRecuperaClaveAsunto.valor

        if(asuntoRecuperaClave.trim() === ''){
            return res.status(404).send({
                msg: 'seccion=RECUPERA_CLAVE clave=ASUNTO no tiene un valor definido en la configuración'
            })
        }

        //Obtengo el mensaje del email configurable en la base de datos.
        const configRecuperaClaveMensaje = await Configuracion.findOne({
            where:{
                seccion: 'RECUPERA_CLAVE',
                clave: 'MENSAJE'
            }
        })

        if(!configRecuperaClaveMensaje){
            return res.status(404).send({
                msg: 'seccion=RECUPERA_CLAVE clave=MENSAJE No existe en la configuración'
            })
        }

        let mensajeRecuperaClave = configRecuperaClaveMensaje.valor

        if(mensajeRecuperaClave.trim() === ''){
            return res.status(404).send({
                msg: 'seccion=RECUPERA_CLAVE clave=MENSAJE no tiene un valor definido en la configuración'
            })
        }

        //Valido que tiene un texto para reemplazar el código.
        if(!mensajeRecuperaClave.includes('${codigo_recupera_clave}')){
            return res.status(404).send({
                msg: 'seccion=RECUPERA_CLAVE clave=MENSAJE no tiene definida la variable ${codigo_recupera_clave}'
            })
        }

        mensajeRecuperaClave = mensajeRecuperaClave.replace('${codigo_recupera_clave}', codigoRecuperaClave)

        //Envío el email.
        await sendMail(emailUsuario, asuntoRecuperaClave, '', mensajeRecuperaClave, [])

        //Envío los datos de respuesta al front.
        res.json({
            rut,
            emailUsuario,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizaClave = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { rut, clave, codigoRecuperaClave } = req.body;
        
        //revisa que el usuario existe
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).json({
                msg: `El usuario ${rut} no existe`
            })
        }
    
        //revisa que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'El usuario se encuentra inactivo'
            })
        }

        let usuarioRecuperaClave = await UsuarioRecuperaClave.findOne({
            where: {
                rut_usuario: rut,
                codigo_recupera_clave: codigoRecuperaClave,
            }
        })

        if(!usuarioRecuperaClave){
            return res.status(404).json({
                msg: `No existe un registro de recuperación de clave para el usuario ${rut} con el código ingresado ${codigoRecuperaClave}`
            })
        }

        //Genero un hash para el password
        let salt = bcrypt.genSaltSync(10);
        let clave_hash = bcrypt.hashSync(clave, salt);
        
        usuario = await Usuario.update({
            clave: clave_hash,
        }, {
            where: {
                rut
            }
        })

        //Elimino el registro de recuperación de clave, ya que la clave se actualizó correctamente y ya no lo necesito.
        await UsuarioRecuperaClave.destroy({
            where: {
                rut_usuario: rut,
            }
        })

        res.json({
            msg: `Clave actualizada correctamente para el usuario rut ${rut}`
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}