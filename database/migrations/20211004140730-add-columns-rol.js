'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      
      return Promise.all([
        queryInterface.addColumn('roles', 'ver_menu_carga_masiva', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          allowNull: false,
          after: 'ver_submenu_conceptos'
        }, { transaction: t }),
        queryInterface.addColumn('roles', 'ver_submenu_carga_masiva_unidades', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          allowNull: false,
          after: 'ver_menu_carga_masiva'
        }, { transaction: t }),
        queryInterface.addColumn('roles', 'ver_submenu_carga_masiva_usuarios', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: 0,
          allowNull: false,
          after: 'ver_submenu_carga_masiva_unidades'
        }, { transaction: t}),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('roles', 'ver_menu_carga_masiva', { transaction: t }),
        queryInterface.removeColumn('roles', 'ver_submenu_carga_masiva_unidades', { transaction: t }),
        queryInterface.removeColumn('roles', 'ver_submenu_carga_masiva_usuarios', { transaction: t }),
      ]);
    });
  }
};
