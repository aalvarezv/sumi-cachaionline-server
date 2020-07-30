module.exports = (sequelize, type, RespuestaResumen, Unidad) =>{
    
    return sequelize.define('respuesta_unidad',{
        codigo: {
            type: type.STRING(12),
            primaryKey: true,
            allownull: false
        },
        codigo_respuesta_resumen:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: RespuestaResumen,
                key: 'codigo'
            }
        },
        codigo_unidad:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Unidad,
                key: 'codigo'
            }
        },
        cantidad_preguntas:{
            type: type.INTEGER,
            allownull: false
        },
        tiempo_total:{
            type: type.DATE(6),
            allownull: false
        },
        respuestas_correctas:{
            type: type.INTEGER,
            allownull: false
        },
        respuestas_incorrectas:{
            type: type.INTEGER,
            allownull: false
        },
        respuestas_omitidas:{
            type: type.INTEGER,
            allownull: false
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'respuestas_unidad'
    })
}