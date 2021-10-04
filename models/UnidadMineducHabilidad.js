module.exports = (sequelize, type, UnidadMineduc, Unidad) =>{

  return sequelize.define('unidad_mineduc_habilidad', {
    codigo: {
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
    numero_habilidad: {
      type: type.INTEGER,
      allowNull: false
    },
    descripcion_habilidad: {
      type: type.STRING(2028),
      allowNull: false
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'unidades_mineduc_habilidades'
  })

}