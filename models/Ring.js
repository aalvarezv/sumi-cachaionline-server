module.exports = (sequelize, type, Usuario, TipoJuego, 
                  Materia, Institucion, Modalidad) => {

    return sequelize.define('ring', {

        codigo: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        codigo_conexion: {
            type: type.STRING(8),
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
        nota_alta: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        nota_alta_mensaje: {
            type: type.STRING(128),
            allowNull: false,
        },
        nota_media: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        nota_media_mensaje: {
            type: type.STRING(128),
            allowNull: false,
        },
        nota_baja: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        nota_baja_mensaje: {
            type: type.STRING(128),
            allowNull: false,
        },
        puntos_factor:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_correcta:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_incorrecta:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_omitida:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        puntos_respuesta_timeout:{
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        recordar_porcent: {
            type: type.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        comprender_porcent: {
            type: type.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        aplicar_porcent: {
            type: type.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        analizar_porcent: {
            type: type.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        evaluar_porcent: {
            type: type.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        crear_porcent: {
            type: type.FLOAT,
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
        mostrar_cantidad_usuarios: {
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