const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { validRefreshTokens } = require("../helpers");


const tokenRefresh = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    const { rut, tokenRefresh } = req.body

    //verifica si el tokenRefresh + usuario existe en el arreglo de token válidos.
    if(validRefreshTokens.find(item => item.rut === rut && item.tokenRefresh === tokenRefresh)){
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

}


module.exports = {
    tokenRefresh,
}