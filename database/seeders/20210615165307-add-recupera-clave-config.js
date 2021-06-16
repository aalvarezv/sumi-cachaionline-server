'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let configuracionRecuperaClave = [{
      seccion: 'RECUPERA_CLAVE',
      clave: 'ASUNTO',
      valor: 'Recuperar Clave',
    },{
      seccion: 'RECUPERA_CLAVE',
      clave: 'MENSAJE',
      valor: 'Mensaje Recupera Clave ${codigo_recupera_clave}',
    }]

    await queryInterface.bulkInsert('configuraciones', configuracionRecuperaClave, {});

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('configuraciones', {
        seccion: 'RECUPERA_CLAVE'
      })
  }
};
