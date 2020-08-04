module.exports = (sequelize, type, RespuestaResumen, Pregunta, Alternativa) =>{

    return sequelize.define('respuesta_nodedetalle',{

        codigo:{
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
        codigo_pregunta:{
            type: type.STRING(12),
            allownull: false,
            reference:{
                model: Pregunta,
                key: 'codigo'
            }
        },
        codigo_alternativa:{
            type: type.STRING(12),
            allownull: false,
            refenrece:{
                model: Alternativa,
                key: 'codigo'
            }
        },
        fecha:{
            type: type.DATEONLY,
            allownull: false
        },
        hora:{
            type: type.DATE(6),
            allownull: false
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'respuestas_detalle'
    })
}