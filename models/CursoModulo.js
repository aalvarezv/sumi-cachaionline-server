module.exports = (sequelize, type, Curso, Modulo) => {

    return sequelize.define('curso_modulo', {
        codigo_curso: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Curso,
                key: 'codigo'
            }
        },
        codigo_modulo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Modulo,
                key: 'codigo'
            }
        },
        
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'cursos_modulos',
        
    })
}