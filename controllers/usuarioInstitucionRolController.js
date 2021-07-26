const { UsuarioInstitucionRol, Institucion, Rol } = require('../database/db');
const { validationResult } = require('express-validator');
const uuidv4 = require('uuid').v4;

exports.crearUsuarioInstitucionRol = async(req, res, next) => {

    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        
        const { rut_usuario, codigo_institucion, codigo_rol } = req.body;

        //Verifica si existe la combinación curso vs usuario
        let usuario_instituciones_roles = await UsuarioInstitucionRol.findAll({
            where: {
                rut_usuario,
                codigo_institucion,
                codigo_rol
            }
        });

        if (usuario_instituciones_roles.length > 0) {
            return res.status(400).json({
                msg: 'El usuario ya tiene asignado el rol'
            });
        }

        //Guarda la nueva relación entre curso y usuario
        usuario_instituciones_roles = await UsuarioInstitucionRol.create({
            codigo: uuidv4(),
            rut_usuario,
            codigo_institucion,
            codigo_rol
        });
        
        //next para pasar a listarUsuarioInstitucionRol 
        req.query.rut_usuario = rut_usuario;
        req.query.codigo_institucion = codigo_institucion;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.listarUsuarioInstitucionRol = async(req, res) => {

    try {
       
        const { rut_usuario, codigo_institucion } = req.query;
        
        const usuario_instituciones_roles = await UsuarioInstitucionRol.findAll({
            include:[{
                model: Rol,
                attributes: ['codigo', 'descripcion']
            },{
                model: Institucion,
                attributes: ['codigo', 'descripcion']
            }],
            where: {
                rut_usuario,
                codigo_institucion
            },
            order: [
                ['rol', 'descripcion','ASC']
            ]
        });

        res.json({
            usuario_instituciones_roles
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarUsuarioInstitucionRol = async(req, res, next) => {


    //Si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { rut_usuario, codigo_institucion, codigo_rol } = req.query;
        
        //Elimino el registro
        await UsuarioInstitucionRol.destroy({
            where: {
                rut_usuario,
                codigo_institucion,
                codigo_rol,
            }
        });

        //next para pasar a listarUsuarioInstitucionRol 
        req.query.rut_usuario = rut_usuario;
        req.query.codigo_institucion = codigo_institucion;
        next();
        

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}