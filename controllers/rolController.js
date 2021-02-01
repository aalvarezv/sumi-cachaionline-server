const { Rol, UsuarioInstitucionRol } = require('../config/db');
const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.crearRol = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        const { codigo, descripcion, ver_menu_administrar,
            ver_submenu_instituciones, ver_submenu_niveles_academicos,
            ver_submenu_roles, ver_submenu_usuarios,
            ver_menu_asignaturas, ver_submenu_materias,
            ver_submenu_unidades, ver_submenu_modulos,
            ver_submenu_contenidos, ver_submenu_temas, ver_submenu_conceptos,
            ver_menu_preguntas, ver_menu_rings, inactivo } = req.body;

        let rol = await Rol.findByPk(codigo);
        if (rol) {
            return res.status(400).json({
                msg: 'El rol ya existe'
            });
        }

        rol = await Rol.create({
            codigo,
            descripcion,
            ver_menu_administrar,
            ver_submenu_instituciones,
            ver_submenu_niveles_academicos,
            ver_submenu_roles,
            ver_submenu_usuarios,
            ver_menu_asignaturas,
            ver_submenu_materias,
            ver_submenu_unidades,
            ver_submenu_modulos,
            ver_submenu_contenidos,
            ver_submenu_temas,
            ver_submenu_conceptos,
            ver_menu_preguntas,
            ver_menu_rings,
            inactivo
        });

        res.json(rol);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }
}

exports.listarRoles = async(req, res) => {

    try {
        const rol = await Rol.findAll();
        res.json({
            rol
        });
    } catch (error) {
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.actualizarRoles = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {
        const { codigo, descripcion, ver_menu_administrar,
            ver_submenu_instituciones, ver_submenu_niveles_academicos,
            ver_submenu_roles, ver_submenu_usuarios,
            ver_menu_asignaturas, ver_submenu_materias,
            ver_submenu_unidades, ver_submenu_modulos,
            ver_submenu_contenidos, ver_submenu_temas, ver_submenu_conceptos,
            ver_menu_preguntas, ver_menu_rings, inactivo } = req.body;

        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(400).send({
                msg: `El rol ${codigo} no existe`
            });
        }

        rol = await Rol.update({
            descripcion,
            ver_menu_administrar,
            ver_submenu_instituciones,
            ver_submenu_niveles_academicos,
            ver_submenu_roles,
            ver_submenu_usuarios,
            ver_menu_asignaturas,
            ver_submenu_materias,
            ver_submenu_unidades,
            ver_submenu_modulos,
            ver_submenu_contenidos,
            ver_submenu_temas,
            ver_submenu_conceptos,
            ver_menu_preguntas,
            ver_menu_rings,
            inactivo
        }, {
            where: {
                codigo
            }
        });

        res.json({
            msg: "Rol actualizado exitosamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.eliminarRoles = async(req, res) => {

    try {

        const { codigo } = req.params;

        let rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            });
        }

        let rol_usuario_institucion = await UsuarioInstitucionRol.findOne({
            where: {
                codigo_rol: codigo,
            }
        });

        if (rol_usuario_institucion) {
            return res.status(404).send({
                msg: 'El rol tiene usuarios asociados, no se puede eliminar'
            });
        }

        rol = await Rol.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: "Rol eliminado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.datosRol = async(req, res) => {

    try {

        const { codigo } = req.params;
        const rol = await Rol.findByPk(codigo);
        if (!rol) {
            return res.status(404).send({
                msg: `El rol ${codigo} no existe`
            });
        }

        res.json({
            rol
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }
}

exports.busquedaRoles = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.query
            //consulta por el rol
        const roles = await Rol.findAll({

            where: 
                Sequelize.where(Sequelize.fn("concat", Sequelize.col("codigo"), Sequelize.col("descripcion")), {[Op.like]: `%${filtro}%`}),
                order: [
                    ['descripcion', 'ASC'],
                ]
        });

        //envia la información del rol
        res.json({
            roles
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}