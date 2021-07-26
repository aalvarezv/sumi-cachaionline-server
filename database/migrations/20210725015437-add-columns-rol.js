'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('roles', 'sys_admin', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'descripcion',
    })

    await queryInterface.addColumn('roles', 'ver_submenu_cursos', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'ver_submenu_usuarios',
  })

    await queryInterface.addColumn('roles', 'ver_menu_cuestionarios', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'ver_menu_rings',
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('roles', 'sys_admin')
    await queryInterface.removeColumn('roles', 'ver_submenu_cursos')
    await queryInterface.removeColumn('roles', 'ver_menu_cuestionarios')
  }
};
