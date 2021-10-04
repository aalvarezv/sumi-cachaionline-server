module.exports = (sequelize, type, NivelAcademico)=>{

  return sequelize.define('unidad_mineduc', {   
      codigo:{
          type: type.STRING(128),
          primaryKey: true,
          allownull: false
      },
      descripcion:{
          type: type.STRING(128),
          allownull: false
      },
      codigo_nivel_academico:{
          type: type.STRING(128),
          allownull: false,
          references:{
              model: NivelAcademico,
              key: 'codigo'
          }
      }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'unidades_mineduc'
  })
}