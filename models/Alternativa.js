module.exports = (sequelize, type, Pregunta) =>{

    return sequelize.define('Alternativa',{
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING,
            allownull: false
        },
        correcta:{
            type: type.BOOLEAN,
            allownull: false
        },
        codigo_pregunta:{
            type: type.STRING(12),
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
        tableName: 'Alternativas'
    })
}