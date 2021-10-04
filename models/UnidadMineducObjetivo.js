module.exports = (sequelize, type, UnidadMineduc, Unidad) =>{

  return sequelize.define('unidad_mineduc_objetivo', {
    codigo: {
      type: type.STRING(128),
      primaryKey: true,
      allowNull: false,
    },
    codigo_unidad_mineduc: {
      type: type.STRING(128),
      allowNull: true,
      references:{
        model: UnidadMineduc,
        key: 'codigo'
      }
    },
    numero_objetivo: {
      type: type.INTEGER,
      allowNull: true
    },
    descripcion_objetivo: {
      type: type.STRING(2028),
      allowNull: false
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'unidades_mineduc_objetivos'
  })

}