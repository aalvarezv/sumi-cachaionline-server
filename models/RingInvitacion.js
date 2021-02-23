module.exports = (sequelize, type, Ring, Usuario) => {

    return sequelize.define('ring_invitacion', {
        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false
        },
        codigo_ring: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Ring,
                key: 'codigo'
            }
        },
        rut_usuario_emisor: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        rut_usuario_receptor: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        estado:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        inactivo: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_invitaciones',
        
    })
}