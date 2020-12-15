module.exports = (sequelize, type, Pregunta, ModuloContenidoTemaConcepto) => {

    return sequelize.define('pregunta_modulo_contenido_tema_concepto', {
        
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Pregunta,
                key: 'codigo'
            }
        },
        codigo_modulo_contenido_tema_concepto: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: ModuloContenidoTemaConcepto,
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
        tableName: 'pregunta_modulos_contenidos_temas_conceptos',

    })

}