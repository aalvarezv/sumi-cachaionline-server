module.exports = (sequelize, type, Modulo) =>{

    return sequelize.define('modulo_contenido',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING(),
            allownull: false
        },
        codigo_modulo:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Modulo,
                key: 'codigo'
            }
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'modulo_contenidos'
    })
}