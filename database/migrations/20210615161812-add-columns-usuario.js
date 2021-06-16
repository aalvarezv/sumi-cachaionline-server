'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      
      return Promise.all([
        queryInterface.addColumn('usuarios', 'avatar_color', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          after: 'imagen'
        }, { transaction: t }),
        queryInterface.addColumn('usuarios', 'avatar_textura', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          after: 'avatar_color'
        }, { transaction: t }),
        queryInterface.addColumn('usuarios', 'avatar_sombrero', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          after: 'avatar_textura'
        }, { transaction: t}),
        queryInterface.addColumn('usuarios', 'avatar_accesorio', {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
          after: 'avatar_sombrero'
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('usuarios', 'avatar_color', { transaction: t }),
        queryInterface.removeColumn('usuarios', 'avatar_textura', { transaction: t }),
        queryInterface.removeColumn('usuarios', 'avatar_sombrero', { transaction: t }),
        queryInterface.removeColumn('usuarios', 'avatar_accesorio', { transaction: t }),
      ]);
    });
  }
};
