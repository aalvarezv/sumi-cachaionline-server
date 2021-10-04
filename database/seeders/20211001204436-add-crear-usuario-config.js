'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    let configuracionCrearUsuario = [{
      seccion: 'CREAR_USUARIO',
      clave: 'ASUNTO',
      valor: 'CachaiOnline Nuevo Usuario',
      createdAt: moment().format('YYYY-MM-DD HH:mm'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
      seccion: 'CREAR_USUARIO',
      clave: 'MENSAJE',
      valor: 'Estimado ${nombre_usuario} tu usuario es ${codigo_usuario} y tu clave es ${clave}',
      createdAt: moment().format('YYYY-MM-DD HH:mm'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('configuraciones', configuracionCrearUsuario, {});

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('configuraciones', {
      seccion: 'CREAR_USUARIO'
    })

  }
};
