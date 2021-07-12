module.exports = (sequelize, type, Usuario) =>{

  return sequelize.define('token_refresh', {

      rut_usuario:{
          type: type.STRING(12),
          primaryKey: true,
          allowNull: false,
          references: {
              model: Usuario,
              key: 'rut'
          } 
      },
      token_refresh:{
          type: type.STRING(256),
          allowNull: false
      }
      
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'token_refresh'
  })

}