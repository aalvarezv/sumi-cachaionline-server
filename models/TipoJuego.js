module.exports = (sequelize, type) => {

    return sequelize.define('tipo_juego', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        descripcion: {
            type: type.STRING,
            allowNull: false,
        },
        inactivo: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'tipo_juegos'
    })
}