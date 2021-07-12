'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('token_refresh', {
      rut_usuario: {
          type: Sequelize.STRING(12),
          primaryKey: true,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'rut'
          }
      },
      token_refresh: {
          type: Sequelize.STRING(256),
          allowNull: false,
      },
      createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
      }, 
      updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW'),
      }

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('token_refresh');
  }
};