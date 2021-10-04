module.exports = (sequelize, type, UnidadMineduc) =>{

  return sequelize.define('unidad_mineduc_conocimiento_previo', {
    codigo:{
      type: type.STRING(128),
      primaryKey: true,
      allowNull: false,
    },
    codigo_unidad_mineduc: {
      type: type.STRING(128),
      allowNull: false,
      references:{
        model: UnidadMineduc,
        key: 'codigo'
      }
    },
    numero_conocimiento_previo: {
      type: type.INTEGER,
      allowNull: false
    },
    descripcion_conocimiento_previo: {
      type: type.STRING(2028),
      allowNull: false
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'unidades_mineduc_conocimientos_previos'
  })

}