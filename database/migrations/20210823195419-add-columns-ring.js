'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('rings', 'puntos_factor', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'nota_baja_mensaje',
    })

    await queryInterface.addColumn('rings', 'recordar_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'puntos_respuesta_timeout',
    })

    await queryInterface.addColumn('rings', 'comprender_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'recordar_porcent',
    })
  
    await queryInterface.addColumn('rings', 'aplicar_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'comprender_porcent',
    })

    await queryInterface.addColumn('rings', 'analizar_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'aplicar_porcent',
    })

    await queryInterface.addColumn('rings', 'evaluar_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'analizar_porcent',
    })

    await queryInterface.addColumn('rings', 'crear_porcent', {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      after: 'evaluar_porcent',
    })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('rings', 'puntos_factor')
    await queryInterface.removeColumn('rings', 'recordar_porcent')
    await queryInterface.removeColumn('rings', 'comprender_porcent')
    await queryInterface.removeColumn('rings', 'aplicar_porcent')
    await queryInterface.removeColumn('rings', 'analizar_porcent')
    await queryInterface.removeColumn('rings', 'evaluar_porcent')
    await queryInterface.removeColumn('rings', 'crear_porcent')

  }

};
