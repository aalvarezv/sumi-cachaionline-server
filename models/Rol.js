module.exports = (sequelize, type) =>{

    return sequelize.define('rol', {
        codigo:{
            type: type.STRING(128),
            primaryKey: true,
            allownull: false,
        },
        descripcion:{
            type: type.STRING(),
            allownull: false,
        },
        sys_admin:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_menu_administrar:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_instituciones:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_niveles_academicos:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_roles:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_usuarios:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_cursos:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_menu_asignaturas:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_materias:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_unidades:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_modulos:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_contenidos:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_temas:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_submenu_conceptos:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_menu_preguntas:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_menu_rings:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
        },
        ver_menu_cuestionarios:{
            type: type.BOOLEAN,
            allownull: false,
            defaultValue: false,
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
        tableName: 'roles'
    })
}