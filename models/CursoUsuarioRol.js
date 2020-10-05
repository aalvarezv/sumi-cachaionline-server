module.exports = (sequelize, type, Curso, Usuario, Rol) => {

    return sequelize.define('curso_usuario_rol', {
        codigo_curso: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Curso,
                key: 'codigo'
            }
        },
        rut_usuario: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        codigo_rol: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Rol,
                key: 'codigo'
            }
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'cursos_usuarios_roles',

    })


}