module.exports = (sequelize, type, Usuario, Institucion, NivelAcademico, Estado) =>{

    return sequelize.define('single', {
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false 
        },
        filtro_materia:{
            type: type.STRING,
            allowNull: false
        },
        filtro_unidad:{
            type: type.STRING,
            allowNull: false
        },
        filtro_modulo:{
            type: type.STRING,
            allowNull: false
        },
        filtro_contenido:{
            type: type.STRING,
            allowNull: false
        },
        filtro_tema:{
            type: type.STRING,
            allowNull: false
        },
        filtro_concepto:{
            type: type.STRING,
            allowNull: false
        },
        cantidad_preguntas:{
            type: type.INTEGER,
            allowNull: false
        },
        tiempo:{
            type: type.INTEGER,
            allownull: false
        },
        rut_usuario:{
            type: type.STRING(12),
            allownull: false,
            references:{
                model: Usuario,
                key: 'rut'
            }
        },
        codigo_institucion:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Institucion,
                key: 'codigo'
            }
        },
        codigo_nivel_academico:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: NivelAcademico,
                key: 'codigo'
            }
        },
        codigo_estado:{
            type: type.STRING(128),
            allownull: false,
            references:{
                model: Estado,
                key: 'codigo'
            }
        },
        fecha_hora_inicio: {
            type: type.DATE,
            allowNull: false,
        },
        fecha_hora_fin: {
            type: type.DATE,
            allowNull: true,
            defaultValue: null,
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
        tableName: 'singles'
    })

}