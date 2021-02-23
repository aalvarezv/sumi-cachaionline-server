module.exports = (sequelize, type, Usuario, TipoJuego, 
                  Materia, Institucion, Modalidad) => {

    return sequelize.define('ring', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        nombre: {
            type: type.STRING,
            allowNull: false,
        },
        descripcion: {
            type: type.TEXT('long'),
            allowNull: false,
        },
        rut_usuario_creador: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut',
            }
        },
        codigo_institucion:{
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Institucion,
                key: 'codigo',
            }
        },
        codigo_materia: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Materia,
                key: 'codigo',
            }
        },
        codigo_tipo_juego: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: TipoJuego,
                key: 'codigo',
            }
        },
        codigo_modalidad:{
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Modalidad,
                key: 'codigo',
            }
        },
        fecha_hora_inicio: {
            type: type.DATE,
            allowNull: false,
        },
        fecha_hora_fin: {
            type: type.DATE,
            allowNull: false,
        },
        tipo_duracion_pregunta: {
            type: type.INTEGER,
            allowNull: false,
        },
        duracion_pregunta: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        revancha: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        revancha_cantidad: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        retroceder: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pistas: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        privado: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        inactivo: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'rings',
    })
}