const {Usuario} = require('../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res) => {

    //revisar si hay errores con el express-validator aplicado con el check en el routes/auth
    // const errores = validationResult(req)
    // if (!errores.isEmpty()) {
    //     return res.status(400).json({ errores: errores.array() })
    // }
    
    try { 
        const { rut, clave } = req.body
        //revisa que el usuario existe
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            console.log('El usuario no existe')
            return res.status(400).json({
                msg: 'El usuario no existe'
            })
        }
    
        //revisar que el usuario no se encuentre inactivo
        if(usuario.inactivo){
            return res.status(401).json({
                msg: 'El usuario se encuentra inactivo'
            })
        }
        
        //revisar el password ingresado vs el password de la bd
        const passCorrecto = await bcryptjs.compare(clave, usuario.clave)
        if(!passCorrecto){
            return res.status(401).json({
                msg: 'El password es incorrecto'
            })
        }
        
        //si el usuario es válido crear y firmar el jsonwebtoken
        const payload = {
            usuario: {
                rut: usuario.rut
            }
        }
        // //Obtiene el tiempo de expiracion del token.
        // const token = await Configuracion.findOne({
        //     where: {
        //         seccion: 'TOKEN',
        //         clave: 'EXPIRA'
        //     }
        // })

        //firmar el jsonwebtoken 
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 86400, //segundos 1 día.
        }, (error, token) => {
            if (error) throw error
            res.json({ token })
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}


module.exports = {
    autenticarUsuario,
}