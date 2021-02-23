module.exports = (sequelize, type, Ring, NivelAcademico) => {

    return sequelize.define('ring_nivel_academico', {
        codigo_ring: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Ring,
                key: 'codigo'
            }
        },
        codigo_nivel_academico: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: NivelAcademico,
                key: 'codigo'
            }
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'ring_niveles_academicos',

    })

}