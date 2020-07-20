module.exports = (sequelize, type) => {

    return sequelize.define('nivel_academico',{
        codigo:{
            type: type.STRING(12),
            primarykey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING,
            allownull: false
        },
        inactivo:{
            type: type.BOOLEAN,
            allownull: false
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'niveles_academicos'
    })
}