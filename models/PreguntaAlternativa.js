module.exports = (sequelize, type, Pregunta) =>{

    return sequelize.define('pregunta_alternativa',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        letra:{
            type: type.STRING(1),
            allownull: false
        },
        correcta:{
            type: type.BOOLEAN,
            allownull: false
        },
        numero:{
            type: type.INTEGER,
            allownull: false
        },        
        codigo_pregunta:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Pregunta,
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
        tableName: 'pregunta_alternativas'
    })
}