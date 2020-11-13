module.exports = (sequelize, type, Usuario, TipoJuego, NivelAcademico, Materia) => {

    return sequelize.define('ring', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: type.STRING,
            allowNull: false
        },
        descripcion: {
            type: type.TEXT('long'),
            allowNull: false
        },
        fecha_hora_inicio: {
            type: type.DATE,
            allowNull: false
        },
        fecha_hora_fin: {
            type: type.DATE,
            allowNull: false
        },
        rut_usuario_creador: {
            type: type.STRING(12),
            allowNull: false,
            references: {
                model: Usuario,
                key: 'rut'
            }
        },
        cantidad_usuarios: {
            type: type.INTEGER,
            allowNull: false,
        },
        codigo_nivel_academico: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: NivelAcademico,
                key: 'codigo'
            }
        },
        codigo_materia: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: Materia,
                key: 'codigo'
            }
        },
        tipo_duracion_pregunta: {
            type: type.INTEGER,
        },
        duracion_pregunta: {
            type: type.INTEGER,
        },
        codigo_tipo_juego: {
            type: type.STRING(128),
            allowNull: false,
            references: {
                model: TipoJuego,
                key: 'codigo'
            }
        },
        privado: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        inactivo: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true,
        //agrega el nombre de la tabla.
        tableName: 'rings'
    })
}