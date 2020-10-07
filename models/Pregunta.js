module.exports = (sequelize, type, Modulo) =>{

    return sequelize.define('pregunta',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        pregunta_texto:{
            type: type.STRING,
            allownull: false
        },
        pregunta_imagen:{
            type: type.STRING,
            allownull: false
        },
        pregunta_audio:{
            type: type.STRING,
            allownull: false
        },
        pregunta_video:{
            type: type.STRING,
            allownull: false
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
        tableName: 'preguntas'
    })
}