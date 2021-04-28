module.exports = (sequelize, type, Usuario, Single, Ring, Pregunta) =>{

    return sequelize.define('respuesta', {
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false 
        },
        rut_usuario:{
            type: type.STRING(128),
            allowNull: false,
            references:{
                model: Usuario,
                key: 'rut',
            }
        },
        codigo_single:{
            type: type.STRING(128),
            allownull: true,
            defaultValue: null,
            references:{
                model: Single,
                key: 'codigo'
            }
        },
        codigo_ring:{
            type: type.STRING(128),
            allownull: true,
            defaultValue: null,
            references:{
                model: Ring,
                key: 'codigo'
            }
        },
        codigo_pregunta:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Pregunta,
                key: 'codigo'
            }
        },
        tiempo:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        correcta:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        omitida:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        vio_pista:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        vio_solucion:{
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: 'respuestas'
    })

}