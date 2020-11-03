const { text } = require("express")

module.exports = (sequelize, type, Usuario) => {

    return sequelize.define('ring', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: type.STRING,
            allowNull: false
        },
        descripcion: {
            type: type.TEXT('long'),
            allowNull: false
        },
        fecha_hora_inicio: {
            type: type.DATE,
            allowNull: false
        },
        fecha_hora_fin: {
            type: type.DATE,
            allowNull: false
        },
        rut_usuario_creador: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        privado: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: 'rings'
    })
}