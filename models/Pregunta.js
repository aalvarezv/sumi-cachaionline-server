module.exports = (sequelize, type, Modulo) =>{

    return sequelize.define('pregunta',{
        codigo:{
            type: type.STRING(12),
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
        respuesta_texto:{
            type: type.STRING,
            allownull: false
        },
        respuesta_imagen:{
            type: type.STRING,
            allownull: false
        },
        respuesta_audio:{
            type: type.STRING,
            allownull: false
        },
        respuesta_video:{
            type: type.STRING,
            allownull: false
        },
        codigo_modulo:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Modulo,
                key: 'codigo'
            }
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