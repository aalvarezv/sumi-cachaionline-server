'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.addColumn('roles', 'ver_inicio_unidades_mineduc', {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          after: 'sys_admin',
      })

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('roles', 'ver_inicio_unidades_mineduc')

  }
};
