'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    let configuracionPoliticas = [{
        seccion: 'POLITICAS',
        clave: 'CONDICIONES',
        valor: 'Texto Políticas y Condiciones',
      }]

    await queryInterface.bulkInsert('configuraciones', configuracionPoliticas, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configuraciones', {
      seccion: 'POLITICAS'
    })
  }
};
