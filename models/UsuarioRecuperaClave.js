module.exports = (sequelize, type, Usuario) =>{

  return sequelize.define('usuario_recupera_clave', {

      rut_usuario:{
          type: type.STRING(12),
          primaryKey: true,
          allowNull: false,
          references: {
              model: Usuario,
              key: 'rut'
          } 
      },
      codigo_recupera_clave:{
          type: type.STRING(128),
          allowNull: false
      }
      
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'usuario_recupera_claves'
  })

}