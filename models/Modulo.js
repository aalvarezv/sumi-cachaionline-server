module.exports = (sequelize, type, Unidad, NivelAcademico) =>{

    return sequelize.define('modulo',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING(),
            allownull: false
        },
        codigo_unidad:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Unidad,
                key: 'codigo'
            }
        },
        inactivo:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'modulos'
    })
}