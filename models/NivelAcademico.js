module.exports = (sequelize, type) => {

    return sequelize.define('nivel_academico', {
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING,
            allownull: false
        },
        nivel:{
            type: type.INTEGER,
            allownull: false,
            defaultValue: 0
        },
        inactivo:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false
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