module.exports = (sequelize, type, nivelAcademico) =>{

    return sequelize.define('modulo',{
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING(),
            allownull: false
        },
        codigo_nivel_academico:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: nivelAcademico,
                key: 'codigo'
            }
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
        tableName: 'niveles_academicos'
    })
}