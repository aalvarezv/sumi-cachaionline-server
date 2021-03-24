const { text } = require("express")

module.exports = (sequelize, type, Pregunta) => {

    return sequelize.define('pregunta_pista', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false
        },
        codigo_pregunta: {
            type: type.STRING(128),
            allowNull: false,
            references:{
                model: Pregunta,
                key: 'codigo'
            }
        },
        numero: {
            type: type.INTEGER,
            allownull: false
        },
        texto: {
            type: type.STRING
        },
        imagen: {
            type: type.STRING
        },
        audio: {
            type: type.STRING
        },
        video: {
            type: type.STRING
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
        tableName: 'pregunta_pistas'
    })
}