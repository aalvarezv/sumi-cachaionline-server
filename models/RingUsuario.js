module.exports = (sequelize, type, Ring, Usuario, Institucion, Curso) => {

    return sequelize.define('ring_usuario', {
        codigo_ring: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Ring,
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
        codigo_institucion: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Institucion,
                key: 'codigo'
            }
        },
        codigo_curso: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Curso,
                key: 'codigo'
            }
        },
        grupo: {
            type: type.STRING(128),
            allowNull: false,
        },
        finalizado: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_usuarios',

    })

}