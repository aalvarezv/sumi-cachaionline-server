module.exports = (sequelize, type, Respuesta, PreguntaPista) =>{

    return sequelize.define('respuesta_pista', {
        codigo_respuesta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Respuesta,
                key: 'codigo'
            }
        },
        codigo_pista: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: PreguntaPista,
                key: 'codigo'
            }
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'respuesta_pistas'
    })

}