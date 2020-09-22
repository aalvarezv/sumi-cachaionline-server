module.exports = (sequelize, type, Materia)=>{

    return sequelize.define('unidad', {
        
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        descripcion:{
            type: type.STRING(),
            allownull: false
        },
        codigo_materia:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Materia,
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
        tableName: 'unidades'
    })
}