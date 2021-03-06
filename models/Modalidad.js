module.exports = (sequelize, type) => {

    return sequelize.define('modalidad',{
        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        descripcion:{
            type: type.STRING(),
            allownull: false,
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
        tableName: 'modalidades'
    })
}