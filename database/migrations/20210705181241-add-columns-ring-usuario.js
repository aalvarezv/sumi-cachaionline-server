'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.addColumn('ring_usuarios', 'finalizado', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'grupo',
      })

  },

  down: async (queryInterface, Sequelize) => {

      await queryInterface.removeColumn('ring_usuarios', 'finalizado')

  }
};
