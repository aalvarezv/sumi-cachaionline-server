'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('pregunta_pistas', 'imagen_ancho', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      after: 'imagen',
    })

    await queryInterface.addColumn('pregunta_pistas', 'imagen_alto', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      after: 'imagen_ancho',
    })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('pregunta_pistas', 'imagen_ancho')
    await queryInterface.removeColumn('pregunta_pistas', 'imagen_alto')

  }
};
