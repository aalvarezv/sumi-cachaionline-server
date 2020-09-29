const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    //leer token del header
    const token = req.header('x-auth-token')
    //revisar si no hay token
    if(!token){
        return res.status(401).json({
            msg: 'TokenMissingError'
        })
    }
    //validar el token
    try {
        //verifica si el token es valido
        const cifrado = jwt.verify(token, process.env.SECRETA)
        //agrega el usuario al request, 
        //cuando creamos el token (al hacer login) en la parte del payload, agregamos el usuario
        //y este payload es parte del token, con eso disponibilizamos el id del usuario en el token.
        req.usuario = cifrado.usuario

        next() //permite que avance al siguiente middleware
        
    } catch (error) {
        console.log(error);
        res.status(401).json({msg: error.name})
    }

}


module.exports = auth
