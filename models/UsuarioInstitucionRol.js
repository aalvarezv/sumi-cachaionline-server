module.exports = (sequelize, type, Usuario, Institucion, Rol) =>{

    return sequelize.define('usuario_institucion_rol', {
        
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false
        },
        rut_usuario:{
            type: type.STRING(128),
            allowNull: false,
            references:{
                model: Usuario,
                key: 'rut'
            }
        },
        codigo_institucion:{
            type: type.STRING(128),
            allowNull: false,
            references:{
                model: Institucion,
                key: 'codigo'
            }
        },
        codigo_rol:{
            type: type.STRING(128),
            allowNull: false,
            references:{
                model: Rol,
                key: 'codigo'
            }
        }
    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'usuarios_instituciones_roles'
    })

}