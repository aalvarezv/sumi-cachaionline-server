'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('unidades_mineduc_conocimientos_previos', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      codigo_unidad_mineduc: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'unidades_mineduc',
          key: 'codigo',
        }
      },
      numero_conocimiento_previo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descripcion_conocimiento_previo: {
        type: Sequelize.STRING(2028),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('unidades_mineduc_conocimientos_previos');
  }
};