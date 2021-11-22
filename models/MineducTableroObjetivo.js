module.exports = (sequelize, type, Usuario, Curso, UnidadMineduc, Estado) =>{

  return sequelize.define('mineduc_tablero_objetivo', {
    codigo:{
      type: type.STRING(128),
      primaryKey: true,
      allowNull: false 
    },
    rut_usuario: {
      type: type.STRING(12),
      allowNull: false,
      references: {
        model: Usuario,
        key: 'rut'
      }
    },
    codigo_curso: {
      type: type.STRING(128),
      allowNull: false,
      references: {
        model: Curso,
        key: 'codigo'
      }
    },
    codigo_unidad_mineduc: {
      type: type.STRING(128),
      allowNull: false,
      references: {
        model: UnidadMineduc,
        key: 'codigo'
      }
    },
    numero_objetivo: {
      type: type.INTEGER,
      allowNull:false,
    },
    codigo_estado: {
      type: type.STRING(128),
      allowNull: false,
      references: {
        model: Estado,
        key: 'codigo'
      }
    },
    fecha_inicio: {
      type: type.DATEONLY,
      allowNull:true,
    },
    fecha_termino: {
      type: type.DATEONLY,
      allowNull:true,
    },
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'mineduc_tablero_objetivos'
  })

}