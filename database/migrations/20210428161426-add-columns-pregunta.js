'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('preguntas', 'imagen_ancho', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      after: 'imagen',
    })

    await queryInterface.addColumn('preguntas', 'imagen_alto', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      after: 'imagen_ancho',
    })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('preguntas', 'imagen_ancho')
    await queryInterface.removeColumn('preguntas', 'imagen_alto')

  }
};
