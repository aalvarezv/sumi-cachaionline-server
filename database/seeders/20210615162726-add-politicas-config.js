'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    let configuracionPoliticas = [{
        seccion: 'POLITICAS',
        clave: 'CONDICIONES',
        valor: 'Texto Políticas y Condiciones',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
      }]

    await queryInterface.bulkInsert('configuraciones', configuracionPoliticas, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configuraciones', {
      seccion: 'POLITICAS'
    })
  }
};
