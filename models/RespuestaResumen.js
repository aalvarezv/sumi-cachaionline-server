module.exports = (sequelize, type, Usuario, Materia) =>{

    return sequelize.define('respuesta_resumen',{
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allownull: false
        },
        estado:{
            type: type.STRING(12),
            allownull: false
        },
        rut_usuario:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Usuario,
                key: 'rut'
            }
        },
        codigo_materia:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Materia,
                key: 'codigo'
            }
        },
        fecha:{
            type: type.DATEONLY,
            allownull: false,
        },
        hora_inicio:{
            type: type.DATE(6),
            allownull: false
        },
        hora_termino:{
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
        },
        cantidad_preguntas:{
            type: type.INTEGER,
            allownull: false
        },
        puntaje_total:{
            type: type.INTEGER,
            allownull: false
        },
        tiempo_seleccionado:{
            type: type.DATE(6),
            allownull: false
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'respuestas_resumen'
    })
}