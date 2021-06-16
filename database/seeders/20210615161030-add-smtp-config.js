'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      let configuracionSMTP = [{
          seccion: 'SMTP',
          clave: 'SERVER',
          valor: 'smtp.gmail.com',
        },{
          seccion: 'SMTP',
          clave: 'PORT',
          valor: '465',
        },{
          seccion: 'SMTP',
          clave: 'SSL',
          valor: 1,
        },{
          seccion: 'SMTP',
          clave: 'USER',
          valor: 'desarrollo@suministra.cl',
        },{
          seccion: 'SMTP',
          clave: 'PASSWORD',
          valor: 'juancanete',
      }]

      await queryInterface.bulkInsert('configuraciones', configuracionSMTP, {});
    
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('configuraciones', {
          seccion: 'SMTP'
      })
  }

};
