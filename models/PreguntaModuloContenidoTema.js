module.exports = (sequelize, type, Pregunta, ModuloContenidoTema) => {

    return sequelize.define('pregunta_modulo_contenido_tema', {
        
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Pregunta,
                key: 'codigo'
            }
        },
        codigo_modulo_contenido_tema: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: ModuloContenidoTema,
                key: 'codigo'
            }
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
        tableName: 'pregunta_modulos_contenidos_temas',

    })

}