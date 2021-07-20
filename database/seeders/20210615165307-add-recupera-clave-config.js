'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let configuracionRecuperaClave = [{
      seccion: 'RECUPERA_CLAVE',
      clave: 'ASUNTO',
      valor: 'Recuperar Clave',
      createdAt: moment().format('YYYY-MM-DD HH:mm'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
      seccion: 'RECUPERA_CLAVE',
      clave: 'MENSAJE',
      valor: 'Mensaje Recupera Clave ${codigo_recupera_clave}',
      createdAt: moment().format('YYYY-MM-DD HH:mm'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('configuraciones', configuracionRecuperaClave, {});

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('configuraciones', {
        seccion: 'RECUPERA_CLAVE'
      })
  }
};
