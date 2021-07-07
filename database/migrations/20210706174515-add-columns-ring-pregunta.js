'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.addColumn('ring_preguntas', 'puntos_respuesta_correcta', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'codigo_pregunta',
      })

      await queryInterface.addColumn('ring_preguntas', 'puntos_respuesta_incorrecta', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_correcta',
      })

      await queryInterface.addColumn('ring_preguntas', 'puntos_respuesta_omitida', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_incorrecta',
      })

      await queryInterface.addColumn('ring_preguntas', 'puntos_respuesta_timeout', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        after: 'puntos_respuesta_omitida',
      })      
      
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('ring_preguntas', 'puntos_respuesta_correcta')
    await queryInterface.removeColumn('ring_preguntas', 'puntos_respuesta_incorrecta')
    await queryInterface.removeColumn('ring_preguntas', 'puntos_respuesta_omitida')
    await queryInterface.removeColumn('ring_preguntas', 'puntos_respuesta_timeout')

  }
};
