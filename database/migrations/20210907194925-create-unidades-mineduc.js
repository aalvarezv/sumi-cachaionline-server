'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('unidades_mineduc', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      codigo_nivel_academico:{
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'niveles_academicos',
          key: 'codigo'
      }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('unidades_mineduc');
  }
};