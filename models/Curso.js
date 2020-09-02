module.exports = (sequelize, type, NivelAcademico) => {

    return sequelize.define('curso', {
        codigo: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false
        },
        letra: {
            type: type.STRING(12),
            allowNull: false
        },
        codigo_nivel_academico: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: NivelAcademico,
                key: 'codigo'
            }
        },
        inactivo: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'cursos'
    })
}