'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.addColumn('respuestas', 'timeout', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'omitida',
      })

      await queryInterface.addColumn('respuestas', 'puntos', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'timeout',
      })
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('respuestas', 'timeout')
    await queryInterface.removeColumn('respuestas', 'puntos')

  }
  
};
