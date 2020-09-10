module.exports = (sequelize, type) =>{

    return sequelize.define('institucion', {
        
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false
        },
        descripcion:{
            type: type.STRING,
            allowNull: false
        },
        logo:{
            type: type.TEXT('long'),
            allowNull: false
        },
        inactivo:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'instituciones'
    })
}