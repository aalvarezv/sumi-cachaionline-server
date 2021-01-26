module.exports = (sequelize, type, TipoJuego, Modalidad) => {
    
    return sequelize.define('tipo_juego_modalidad',{
        codigo_tipo_juego: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: TipoJuego,
                key: 'codigo'
            },
        },
        codigo_modalidad: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Modalidad,
                key: 'codigo'
            },
        },
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'tipo_juego_modalidades'
    })
}