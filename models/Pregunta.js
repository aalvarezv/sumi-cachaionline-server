module.exports = (sequelize, type, Usuario) =>{

    return sequelize.define('pregunta',{
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        rut_usuario_creador: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        texto:{
            type: type.STRING,
            allownull: false
        },
        imagen:{
            type: type.STRING,
            allownull: false
        },
        audio:{
            type: type.STRING,
            allownull: false
        },
        video:{
            type: type.STRING,
            allownull: false
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
        tableName: 'preguntas'
    })
}