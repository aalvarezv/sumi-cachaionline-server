module.exports = (sequelize, type) =>{

    return sequelize.define('usuario', {
        rut:{
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false 
        },
        clave:{
            type: type.STRING,
            allowNull: false
        },
        nombre:{
            type: type.STRING,
            allowNull: false
        },
        email:{
            type: type.STRING,
            allowNull: false
        },
        telefono:{
            type: type.INTEGER,
            allowNull: false
        },
        imagen:{
            type: type.TEXT('long'),
            allownull: false
        },
        avatar_color:{
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        avatar_textura:{
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        avatar_sombrero:{
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        avatar_accesorio:{
            type: type.INTEGER,
            defaultValue: 0,
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
        tableName: 'usuarios'
    })

}