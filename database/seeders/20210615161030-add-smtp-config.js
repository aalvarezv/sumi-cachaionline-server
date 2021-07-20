'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {

      let configuracionSMTP = [{
          seccion: 'SMTP',
          clave: 'SERVER',
          valor: 'smtp.gmail.com',
          createdAt: moment().format('YYYY-MM-DD HH:mm'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm'),
        },{
          seccion: 'SMTP',
          clave: 'PORT',
          valor: '465',
          createdAt: moment().format('YYYY-MM-DD HH:mm'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm'),
        },{
          seccion: 'SMTP',
          clave: 'SSL',
          valor: 1,
          createdAt: moment().format('YYYY-MM-DD HH:mm'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm'),
        },{
          seccion: 'SMTP',
          clave: 'USER',
          valor: 'desarrollo@suministra.cl',
          createdAt: moment().format('YYYY-MM-DD HH:mm'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm'),
        },{
          seccion: 'SMTP',
          clave: 'PASSWORD',
          valor: 'juancanete',
          createdAt: moment().format('YYYY-MM-DD HH:mm'),
          updatedAt: moment().format('YYYY-MM-DD HH:mm'),
      }]

      await queryInterface.bulkInsert('configuraciones', configuracionSMTP, {});
    
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('configuraciones', {
          seccion: 'SMTP'
      })
  }

};
