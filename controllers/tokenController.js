const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { TokenRefresh } = require('../database/db');


const tokenRefresh = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try{

        const { rut, tokenRefresh } = req.body

        const tokenRefeshExist = await TokenRefresh.findOne({
            where: {
                rut_usuario: rut,
                token_refresh: tokenRefresh
            }
        })

        //verifica si el tokenRefresh + usuario existe en la tabla.
        if(tokenRefeshExist){
            
            const payload = {
                usuario: {
                    rut,
                }
            }

            //firmar el jsonwebtoken 
            jwt.sign(payload, process.env.SECRETA, {
                expiresIn: 86400, //86400 segundos 1 día.
            }, (error, token) => {
                if (error) throw error
                res.json({ 
                    token,
                })
            })

        }else{
            res.status(400).send({
                msg: 'No se puede refrescar el token con datos incorrectos'
            })
        }
    
    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }

}


module.exports = {
    tokenRefresh,
}