'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario_recupera_claves', {
      rut_usuario: {
        type: Sequelize.STRING(12),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'rut'
        }
      },
      codigo_recupera_clave: {
        type: Sequelize.STRING(128),
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuario_recupera_claves');
  }
};