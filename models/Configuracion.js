module.exports = (sequelize, type) =>{

    return sequelize.define('configuracion', {
        seccion:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        clave:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        valor:{
            type: type.STRING(128),
            allownull: false,
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'configuracion'
    })
}