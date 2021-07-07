'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.addColumn('rings', 'puntos_respuesta_correcta', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'nota_baja_mensaje',
      })

      await queryInterface.addColumn('rings', 'puntos_respuesta_incorrecta', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_correcta',
      })

      await queryInterface.addColumn('rings', 'puntos_respuesta_omitida', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_incorrecta',
      })

      await queryInterface.addColumn('rings', 'puntos_respuesta_timeout', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_omitida',
      })

  },

  down: async (queryInterface, Sequelize) => {

      await queryInterface.removeColumn('rings', 'puntos_respuesta_correcta')
      await queryInterface.removeColumn('rings', 'puntos_respuesta_incorrecta')
      await queryInterface.removeColumn('rings', 'puntos_respuesta_omitida')
      await queryInterface.removeColumn('rings', 'puntos_respuesta_timeout')
    
  }
};
