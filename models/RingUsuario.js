module.exports = (sequelize, type, Ring, Usuario) => {

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
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_usuarios',

    })

}