const { Usuario, Rol, sequelize, Institucion, Curso } = require('../config/db');
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

        const { rut, clave, nombre, email, telefono, imagen, inactivo } = req.body;

        //verifica que el usuario no existe.
        let usuario = await Usuario.findByPk(rut);
        if (usuario) {
            console.log('El usuario ya existe');
            return res.status(400).json({
                msg: 'El usuario ya existe'
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
            imagen,
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
                SELECT 
                    rut_rol,
                    rut,
                    nombre,
                    codigo_rol,
                    descripcion_rol,
                    codigo_institucion,
                    descripcion_institucion,
                    existe_usr_rol_en_actual_curso AS item_select,
                    existe_usr_rol_en_actual_curso,
                    existe_usr_rol_en_otro_curso
                FROM (
                    SELECT 
                        usr.rut, 
                        usr.nombre, 
                        rl.codigo AS codigo_rol,
                        CONCAT(usr.rut, rl.codigo) AS rut_rol,
                        rl.descripcion AS descripcion_rol,
                        uir.codigo_institucion,
                        it.descripcion AS  descripcion_institucion,
                        #EXISTE EN EL CURSO ACTUAL DE LA INSTITUCION.
                        (SELECT COUNT(*) 
                            FROM cursos_usuarios_roles cur 
                            INNER JOIN cursos c ON c.codigo = cur.codigo_curso
                            WHERE cur.rut_usuario = rut 
                                AND cur.codigo_curso = '${codigo_curso}'
                                AND c.codigo_institucion = '${codigo_institucion}' #EL CODIGO DEL CURSO ES PROPIO DE LA INSTITUCIÓN.
                                AND cur.codigo_rol = rl.codigo
                        ) AS existe_usr_rol_en_actual_curso,
                        #EXISTE EN OTRO CURSO DE LA MISMA INSTITUCIÓN.
                        (SELECT COUNT(*) 
                            FROM cursos_usuarios_roles cur 
                            INNER JOIN cursos c ON c.codigo = cur.codigo_curso
                            WHERE cur.rut_usuario = rut 
                                AND cur.codigo_curso <> '${codigo_curso}'
                                AND c.codigo_institucion = '${codigo_institucion}' #EL CODIGO DEL CURSO ES PROPIO DE LA INSTITUCIÓN.
                                AND cur.codigo_rol = rl.codigo
                        ) AS existe_usr_rol_en_otro_curso
                    FROM usuarios usr
                    INNER JOIN usuarios_instituciones_roles uir ON usr.rut = uir.rut_usuario 
                    INNER JOIN roles rl ON rl.codigo = uir.codigo_rol
                    INNER JOIN instituciones it ON it.codigo = uir.codigo_institucion
                    WHERE 
                        usr.inactivo = 0 
                        AND usr.nombre LIKE '%${nombre}%'
                        AND uir.codigo_institucion = '${codigo_institucion}' 
                        AND rl.codigo IN (2,3) 
                        AND rl.codigo LIKE '%${codigo_rol}%'
                )tb
                    WHERE (existe_usr_rol_en_actual_curso = 0 AND existe_usr_rol_en_otro_curso = 0) #SIN CURSO.
                        OR (existe_usr_rol_en_actual_curso = 1 AND existe_usr_rol_en_otro_curso = 0)#EN CURSO ACTUAL.
                        OR (codigo_rol = 3) #PROFESOR.
            `, { type: QueryTypes.SELECT });
            
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

        let { rut, clave, nombre, email, telefono, imagen, inactivo } = req.body;

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

        //actualiza los datos.
        usuario = await Usuario.update({
            nombre,
            clave,
            email,
            telefono,
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
        const usuario = await Usuario.findByPk(rut, {
            attributes: { exclude: ['clave'] } 
        });
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