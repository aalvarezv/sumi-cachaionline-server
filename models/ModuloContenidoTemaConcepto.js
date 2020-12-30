module.exports = (sequelize, type, ModuloContenidoTema) =>{

    return sequelize.define('modulo_contenido_tema_concepto',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING(),
            allownull: false
        },
        codigo_modulo_contenido_tema:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: ModuloContenidoTema,
                key: 'codigo'
            }
        },
        inactivo:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'modulo_contenidos_temas_conceptos'
    })
}