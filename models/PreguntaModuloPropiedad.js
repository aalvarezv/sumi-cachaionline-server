module.exports = (sequelize, type, Pregunta, ModuloPropiedad) => {

    return sequelize.define('pregunta_modulo_propiedad', {
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Pregunta,
                key: 'codigo'
            }
        },
        codigo_modulo_propiedad: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: ModuloPropiedad,
                key: 'codigo'
            }
        },
        inactivo: {
            type: type.BOOLEAN,
            allownull: false,
            defaultvalue: false
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'pregunta_modulo_propiedades',

    })

}