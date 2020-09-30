module.exports = (sequelize, type, Usuario) =>{

    return sequelize.define('institucion', {
        
        codigo:{
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false
        },
        descripcion:{
            type: type.STRING,
            allowNull: false
        },
        rut_usuario_rector: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        rut_usuario_administrador: {
            type: type.STRING(12),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        direccion:{
            type: type.STRING,
            allowNull: true
        },
        email:{
            type: type.STRING,
            allowNull: true
        },
        telefono:{
            type: type.INTEGER,
            allowNull: true
        },
        website:{
            type: type.STRING,
            allowNull: true
        },
        logo:{
            type: type.TEXT('long'),
            allowNull: false
        },
        inactivo:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'instituciones'
    })
}