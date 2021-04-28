'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('ring_usuarios', 'grupo', {
      type: Sequelize.DataTypes.STRING(128),
      allowNull: false,
      after: 'codigo_curso',
    })

  },
  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('ring_usuarios', 'grupo')

  }
  
};
