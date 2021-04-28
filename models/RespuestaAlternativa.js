module.exports = (sequelize, type, Respuesta, PreguntaAlternativa) =>{

    return sequelize.define('respuesta_alternativa', {
        codigo_respuesta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Respuesta,
                key: 'codigo'
            }
        },
        codigo_alternativa: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: PreguntaAlternativa,
                key: 'codigo'
            }
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'respuesta_alternativas'
    })

}