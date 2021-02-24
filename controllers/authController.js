const {Usuario, UsuarioInstitucionRol, Institucion, Rol} = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { limpiaTextoObjeto } = require('../helpers');

const autenticarUsuario = async (req, res) => {
    
    try { 

      
        const { rut, clave } = req.body

        //revisa que el usuario existe
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
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
        const passCorrecto = await bcrypt.compare(clave, usuario.clave)
        if(!passCorrecto){
            return res.status(401).json({
                msg: 'El password es incorrecto'
            })
        }

        //revisa que el usuario tenga al menos un rol asignado.
        const usuario_institucion_rol = await UsuarioInstitucionRol.findAll({
            where:{
                rut_usuario: rut,
            }
        });
       
        if(usuario_institucion_rol.length === 0){
            return res.status(401).json({
                msg: 'El usuario no se encuentra asociado a una institución con un perfil asignado, comuniquese con un administrador.'
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
            expiresIn: 86400, //86400 segundos 1 día.
        }, (error, token) => {
            if (error) throw error
            res.json({ token })
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}

const datosUsuarioAutenticado = async (req, res) => {

    try {
        //obtiene el parametro desde la url
        const {rut} = req.usuario

        //consulta por el usuario
        const usuario = await Usuario.findByPk(rut, {
            attributes: { exclude: ['clave', 'createdAt', 'updatedAt'] },
            raw: true,
            nested: false,
        });

        //si el usuario no existe
        if(!usuario){
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //obtiene las instituciones del usuario.
        let usuarioInstituciones = await UsuarioInstitucionRol.findAll({
            attributes:['codigo_institucion'],
            include:[{
                model:Institucion,
                attributes: ['descripcion'],
            }],
            where:{
                rut_usuario: rut,
            },
            group: ['codigo_institucion'],
            raw: true,
            nested: false,
        })

        let institucionRoles = []

        if(usuarioInstituciones.length > 0){
          
            //Obtiene los roles por institucion.
            for(let usuarioInstitucion of usuarioInstituciones){

                let rolesUsuarioInstitucion = await UsuarioInstitucionRol.findAll({
                    attributes:['codigo_rol'],
                    include: [{
                        model: Rol,
                        attributes: { exclude: ['codigo','createdAt', 'updatedAt'] },
                    }],
                    where:{
                        rut_usuario: rut,
                        codigo_institucion: usuarioInstitucion.codigo_institucion,
                    },
                    raw:true,
                    nested: true,
                    //order: ['rol.descripcion', 'ASC']
                })

                rolesUsuarioInstitucion = limpiaTextoObjeto(rolesUsuarioInstitucion, 'rol.')

                institucionRoles.push({
                    codigo_institucion: usuarioInstitucion.codigo_institucion,
                    descripcion_institucion: usuarioInstitucion["institucion.descripcion"],
                    roles: rolesUsuarioInstitucion,
                })
                
            }
        }

        //envia la información del usuario
        res.json({
            ...usuario,
            institucion_roles: institucionRoles
        })
       

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    
}

module.exports = {
    autenticarUsuario,
    datosUsuarioAutenticado
}