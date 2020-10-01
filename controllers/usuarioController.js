const { Usuario, Rol, sequelize, CursoUsuario, Curso } = require('../config/db');
const { Sequelize, Op, QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
//llama el resultado de la validación
const { validationResult } = require('express-validator');



exports.crearUsuario = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { rut, clave, nombre, email, telefono, codigo_rol, inactivo } = req.body;

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
        if (!rol) {
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
            codigo_rol,
            inactivo
        });

        //envía la respuesta
        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarUsuarios = async(req, res, next) => {

    try {

        setTimeout(async() => {

            const { filtro } = req.query;

            const usuarios = await Usuario.findAll({
                where: {
                    nombre: {
                        [Op.like]: '%' + filtro + '%',
                    },
                    inactivo: false
                },
                order: [
                    ['nombre', 'ASC'],
                ]
            });

            res.model_name = "usuarios";
            res.model_data = usuarios;

            next();

        }, 500);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.listarUsuariosInscritosDisponiblesCurso = async(req, res, next) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log('listarUsuariosInscritosDisponiblesCurso');

    try {

        setTimeout(async() => {

            const { nombre, codigo_institucion, codigo_curso } = JSON.parse(req.query.filters);
            let { codigo_rol } = JSON.parse(req.query.filters);

            if (codigo_rol === '0') codigo_rol = ''

            const usuarios = await sequelize.query(`
            SELECT rut, nombre, codigo_rol, 
                   existe_en_institucion, 
                   existe_en_curso AS item_select 
            FROM (
                SELECT rut, nombre, codigo_rol,
                    (SELECT COUNT(*) 
                    FROM cursos_usuarios cu1
                    LEFT JOIN cursos c1 ON c1.codigo = cu1.codigo_curso
                    WHERE cu1.rut_usuario = rut 
                          AND c1.codigo_institucion = '${codigo_institucion}'
                    ) AS existe_en_institucion,
                    (SELECT count(*) 
                        FROM cursos_usuarios
                     WHERE rut_usuario = rut 
                           AND codigo_curso = '${codigo_curso}'
                    ) AS existe_en_curso
                FROM usuarios
                WHERE inactivo = 0 
                      AND nombre LIKE '%${nombre}%'
                      AND (codigo_rol IN ('2','3') AND codigo_rol LIKE '%${codigo_rol}%')
            ) tb 
            WHERE (existe_en_institucion = 0 AND existe_en_curso = 0) 
               OR (existe_en_institucion = 1 AND existe_en_curso = 1)
               OR (codigo_rol = '3');`, { type: QueryTypes.SELECT });

            res.model_name = "usuarios";
            res.model_data = usuarios;

            next();

        }, 500);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarUsuario = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { rut, clave, nombre, email, telefono, codigo_rol, imagen, inactivo } = req.body;

        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
            return res.status(404).send({
                msg: `El usuario ${rut} no existe`
            })
        }

        //compara la clave recibida con la almacenada en la base de datos
        //si son distintas entonces el usuario la actualizó y aplica el salt a la nueva clave
        if (clave !== usuario.clave) {
            console.log('Actualiza la clave')
                //genero un hash para el password
            let salt = bcrypt.genSaltSync(10);
            clave = bcrypt.hashSync(clave, salt);
        }

        //verifica que el rol del usuario a actualizar existe.
        let rol = await Rol.findByPk(codigo_rol);
        if (!rol) {
            return res.status(404).send({
                msg: `El codigo rol ${codigo_rol} no existe`
            })
        }

        //actualiza los datos.
        usuario = await Usuario.update({
            nombre,
            clave,
            email,
            telefono,
            codigo_rol,
            imagen,
            inactivo
        }, {
            where: {
                rut
            }
        })

        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarUsuario = async(req, res) => {

    try {
        //obtengo el rut del request
        const { rut } = req.params;
        //verifica que el usuario a actualizar existe.
        let usuario = await Usuario.findByPk(rut);
        if (!usuario) {
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

exports.datosUsuario = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { rut } = req.params
            //consulta por el usuario
        const usuario = await Usuario.findByPk(rut, { attributes: { exclude: ['clave'] } });
        //si el usuario no existe
        if (!usuario) {
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

exports.busquedaUsuarios = async(req, res) => {

    try {
        //obtiene el parametro desde la url
        const { filtro } = req.params
            //consulta por el usuario
        const usuarios = await Usuario.findAll({
            include: [{
                model: Curso,
                attributes: ['codigo',
                    'letra',
                    'codigo_institucion', [Sequelize.literal('(SELECT descripcion FROM instituciones WHERE codigo = `cursos`.`codigo_institucion`)'),
                        'descripcion_institucion'
                    ],
                    'codigo_nivel_academico', [Sequelize.literal('(SELECT descripcion FROM niveles_academicos WHERE codigo = `cursos`.`codigo_nivel_academico`)'), 'descripcion_nivel_academico']
                ],
                required: false,
            }],
            /*
            include: [{
                model: CursoUsuario,
                as: 'curso_usuarios',
                attributes: ['codigo_curso'],
                required: false,
                include:[{
                    model: Curso,
                    as: 'curso',
                    attributes: ['codigo',
                                 'letra', 
                                 'codigo_institucion',
                                 */
            /*
                                                 [Sequelize.literal('(SELECT descripcion FROM instituciones WHERE codigo = `curso_usuarios->curso`.`codigo_institucion`)'), 
                                                 'descripcion_institucion'],
                                                 'codigo_nivel_academico',
                                                 [Sequelize.literal('(SELECT descripcion FROM niveles_academicos WHERE codigo = `curso_usuarios->curso`.`codigo_nivel_academico`)'),'descripcion_nivel_academico']*/
            /*
                                                ],
                                    required: false,
                                }],
                            }],*/
            where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("rut"), Sequelize.col("nombre")), {
                [Op.like]: `%${filtro}%`
            })
        });

        //envia la información del usuario
        res.json({
            usuarios
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}