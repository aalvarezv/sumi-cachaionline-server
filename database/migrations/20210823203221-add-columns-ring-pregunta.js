'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('ring_preguntas', 'puntos_factor', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'codigo_pregunta',
    })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('ring_preguntas', 'puntos_factor')

  }
};
