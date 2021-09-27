module.exports = (sequelize, type, Ring, Pregunta) => {

    return sequelize.define('ring_pregunta', {
        codigo_ring: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Ring,
                key: 'codigo'
            }
        },
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Pregunta,
                key: 'codigo'
            }
        },
        puntos_factor:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_correcta:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_incorrecta:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_omitida:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_timeout:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_preguntas',

    })

}