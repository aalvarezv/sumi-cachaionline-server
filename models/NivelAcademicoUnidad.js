module.exports = (sequelize, type, NivelAcademico, Unidad) =>{

    return sequelize.define('nivel_academico_unidad',{
        codigo_nivel_academico:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: NivelAcademico,
                key: 'codigo'
            }   
        },
        codigo_unidad:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Unidad,
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
        tableName: 'niveles_academicos_unidades'
    })
}