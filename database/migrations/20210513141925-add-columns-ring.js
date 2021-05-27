'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.addColumn('rings', 'codigo_conexion', {
          type: Sequelize.DataTypes.STRING(8),
          allowNull: false,
          after: 'codigo',
      })

      await queryInterface.addColumn('rings', 'mostrar_cantidad_usuarios', {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: false,
          after: 'pistas',
      })

      await queryInterface.addColumn('rings', 'nota_alta', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          after: 'revancha_cantidad',
      })

      await queryInterface.addColumn('rings', 'nota_alta_mensaje', {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          after: 'nota_alta',
      })

      await queryInterface.addColumn('rings', 'nota_media', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          after: 'nota_alta_mensaje',
      })

      await queryInterface.addColumn('rings', 'nota_media_mensaje', {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          after: 'nota_media',
      })

      await queryInterface.addColumn('rings', 'nota_baja', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          after: 'nota_media_mensaje',
      })

      await queryInterface.addColumn('rings', 'nota_baja_mensaje', {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: false,
          after: 'nota_baja',
      })

  },

  down: async (queryInterface, Sequelize) => {

      await queryInterface.removeColumn('rings', 'codigo_conexion')
      await queryInterface.removeColumn('rings', 'mostrar_cantidad_usuarios')
      await queryInterface.removeColumn('rings', 'nota_alta')
      await queryInterface.removeColumn('rings', 'nota_alta_mensaje')
      await queryInterface.removeColumn('rings', 'nota_media')
      await queryInterface.removeColumn('rings', 'nota_media_mensaje')
      await queryInterface.removeColumn('rings', 'nota_baja')
      await queryInterface.removeColumn('rings', 'nota_baja_mensaje')

  }
};
