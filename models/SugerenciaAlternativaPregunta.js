module.exports = (sequelize, type) =>{

    return sequelize.define('sugerencia_alternativa_pregunta',{
        
        codigo_pregunta: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        alternativa: {
            type: type.STRING(128),
            primaryKey: true,
            allowNull: false,
        },
        alternativa_correcta: {
            type: type.BOOLEAN,
            defaultValue: true,
        },
        link_1: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        link_2: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        link_3: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        link_4: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        link_5: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        imagen_1: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        imagen_2: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        imagen_3: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        imagen_4: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        imagen_5: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        video_1: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        video_2: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        video_3: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        video_4: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        },
        video_5: {
            type: type.STRING(512),
            allowNull: false,
            defaultValue: ''
        }

    },{
        //agrega atributos timestamp (updatedAt, createdAt).
        timestamps: true,
        //evita que sequelize ponga el nombre de la tabla en plural.
        freezeTableName: true, 
        //agrega el nombre de la tabla.
        tableName: 'sugerencias_alternativa_pregunta'
    })
}