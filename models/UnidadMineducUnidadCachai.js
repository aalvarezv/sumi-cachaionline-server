module.exports = (sequelize, type, UnidadMineduc, Unidad, Modulo, ModuloContenido, ModuloContenidoTema, ModuloContenidoTemaConcepto) =>{

  return sequelize.define('unidad_mineduc_unidad_cachai', {
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
    descripcion_unidad_mineduc:{
        type: type.STRING(128),
        allownull: true
    },
    codigo_unidad_cachai: {
      type: type.STRING(128),
      allowNull: true,
      references:{
        model: Unidad,
        key: 'codigo'
      }
    },
    codigo_modulo_cachai: {
      type: type.STRING(128),
      allowNull: true,
      references: {
        model: Modulo,
        key: 'codigo',
      }
    },
    codigo_contenido_cachai: {
      type: type.STRING(128),
      allowNull: true,
      references: {
        model: ModuloContenido,
        key: 'codigo',
      }
    },
    codigo_tema_cachai: {
      type: type.STRING(128),
      allowNull: true,
      references: {
        model: ModuloContenidoTema,
        key: 'codigo',
      }
    },
    codigo_concepto_cachai: {
      type: type.STRING(128),
      allowNull: true,
      references: {
        model: ModuloContenidoTemaConcepto,
        key: 'codigo',
      }
    }
  },{
      //agrega atributos timestamp (updatedAt, createdAt).
      timestamps: true,
      //evita que sequelize ponga el nombre de la tabla en plural.
      freezeTableName: true, 
      //agrega el nombre de la tabla.
      tableName: 'unidades_mineduc_unidades_cachai'
  })

}