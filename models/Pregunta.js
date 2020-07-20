module.exports = (sequelize, type) =>{

    return sequelize.define('pregunta',{
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allownull: false
        },
        pregunta:{
            type: type.STRING(),
            allownull: false
        },
        imagen:{
            type: type.STRING(),
            allownull: false
        },
        puntaje:{
            type: type.INTEGER,
            allownull: false
        },
        inactivo:{
            type: type.BOOLEAN,
            allownull: false
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