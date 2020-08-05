const {Usuario, Rol} = require('../config/db');
const bcrypt = require('bcryptjs');
//llama el resultado de la validación
const { validationResult } = require('express-validator');


exports.crearUsuario = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
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
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarUsuarios = async (req, res) => {
    
    try {

        const usuarios = await Usuario.findAll();
        res.json({
            usuarios
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarUsuario = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{

        const {rut, nombre, email, telefono, codigo_rol} = req.body;

        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if(!usuario){
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }
        //verifica que el rol del usuario a actualizar existe.
        let rol = await Rol.findByPk(codigo_rol);
        if(!rol){
            return res.status(404).send({
                msg: `El codigo rol ${codigo_rol} no existe`
            })
        }

        //actualiza los datos.
        usuario = await Usuario.update({
                nombre,
                email,
                telefono,
                codigo_rol
        },{ where: {
                rut
        }})

        res.json({
            msg: "Usuario actualizado exitosamente"
        });

     } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarUsuario = async (req, res) => {

    try{    
        //obtengo el rut del request
        const {rut} = req.params;
        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if(!usuario){
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }
        //elimino el registro.
        usuario = await Usuario.destroy({
            where: {
                rut
            }
        });

        //envío una respuesta informando que el registro fue eliminado
        res.json({
            msg: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosUsuario = async (req, res) => {

    try {
        //obtiene el parametro desde la url
        const {rut} = req.params
        //consulta por el usuario
        const usuario = await Usuario.findByPk(rut, 
            { attributes: { exclude: ['clave'] }}
            );
        //si el usuario no existe
        if(!usuario){
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }
        //envia la información del usuario
        res.json({
            usuario
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}