const {Usuario, Rol} = require('../config/db');
const bcrypt = require('bcryptjs');


exports.crearUsuario = async (req, res) => {
    
    try{
    
        const {rut, clave, nombre, email, telefono, codigo_rol} = req.body;

        //verifica que el usuario no existe.
        let usuario = await Usuario.findByPk(rut);
        if (usuario) {
            console.log('El usuario ya existe');
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }

        //verifica que el rol sea válido.
        let rol = await Rol.findByPk(codigo_rol);
        if(!rol){
            console.log('El rol ingresado no es válido');
            return res.status(400).json({
                msg: 'El rol ingresado no es válido'
            });
        }

        //genero un hash para el password
        let salt = bcrypt.genSaltSync(10);
        let clave_hash = bcrypt.hashSync(clave, salt);
       
        //Guarda el nuevo usuario
        usuario = await Usuario.create({
            rut, 
            clave: clave_hash, 
            nombre, 
            email, 
            telefono, 
            codigo_rol
        });

        //envía la respuesta
        res.json({
            usuario
        });
    
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        })
    }


}

exports.listarUsuarios = (req, res) => {

    res.send({
        msg: 'Lista de usuarios'
    })
}