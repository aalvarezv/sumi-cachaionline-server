module.exports = (sequelize, type) =>{

    return sequelize.define('cuestionario_respuesta',{
        
        email:{
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        codigo_cuestionario_sugerencia: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        alternativa: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },

    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'cuestionario_respuestas'
    })
}