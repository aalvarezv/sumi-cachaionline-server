module.exports = (sequelize, type, Ring, Usuario, Pregunta) => {

    return sequelize.define('ring_usuario_respuesta',{
        codigo_ring: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Ring,
                key: 'codigo'
            },
        },
        rut_usuario: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            },
        },
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Pregunta,
                key: 'codigo'
            },
        },
        correcta: {
            type: type.BOOLEAN,
            primaryKey: true,
            allowNull: false,
        },
        erronea: {
            type: type.BOOLEAN,
            primaryKey: true,
            allowNull: false,
        },
        omitida: {
            type: type.BOOLEAN,
            primaryKey: true,
            allowNull: false,
        },
        inactivo: {
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false
        }
        
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_usuario_respuestas',

    })

}