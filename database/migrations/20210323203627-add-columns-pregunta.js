'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('preguntas', 'recordar', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'duracion'
        }, { transaction: t }),
        queryInterface.addColumn('preguntas', 'comprender', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'recordar'
        }, { transaction: t }),
        queryInterface.addColumn('preguntas', 'aplicar', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'comprender'
        }, { transaction: t}),
        queryInterface.addColumn('preguntas', 'analizar', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'aplicar'
        }, { transaction: t }),
        queryInterface.addColumn('preguntas', 'evaluar', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'analizar'
        }, { transaction: t }),
        queryInterface.addColumn('preguntas', 'crear', {
          type: Sequelize.DataTypes.FLOAT,
          after: 'evaluar'
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('preguntas', 'recordar', { transaction: t }),
        queryInterface.removeColumn('preguntas', 'comprender', { transaction: t }),
        queryInterface.removeColumn('preguntas', 'aplicar', { transaction: t }),
        queryInterface.removeColumn('preguntas', 'analizar', { transaction: t }),
        queryInterface.removeColumn('preguntas', 'evaluar', { transaction: t }),
        queryInterface.removeColumn('preguntas', 'crear', { transaction: t })
      ]);
    });
  }
};
