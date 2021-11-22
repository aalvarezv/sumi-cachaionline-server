'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.addColumn('mineduc_tablero_objetivos', 'fecha_inicio', {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
        after: 'codigo_estado',
      })
      await queryInterface.addColumn('mineduc_tablero_objetivos', 'fecha_termino', {
          type: Sequelize.DataTypes.DATEONLY,
          allowNull: true,
          after: 'fecha_inicio',
      })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('mineduc_tablero_objetivos', 'fecha_inicio')
    await queryInterface.removeColumn('mineduc_tablero_objetivos', 'fecha_termino')
  }
};
