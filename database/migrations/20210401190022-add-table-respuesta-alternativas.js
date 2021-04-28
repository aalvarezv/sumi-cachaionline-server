'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('respuestas', 'codigo_alternativa')

    await queryInterface.createTable('respuesta_alternativas', {

      codigo_respuesta: {
          type: Sequelize.DataTypes.STRING(128),
          primaryKey: true,
          allowNull: false,
          references: {
              model: 'respuestas',
              key: 'codigo'
          }
      },
      codigo_alternativa: {
          type: Sequelize.DataTypes.STRING(128),
          primaryKey: true,
          allowNull: false,
          references: {
              model: 'pregunta_alternativas',
              key: 'codigo'
          }
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      }, 
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      }
      
    })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('respuestas', 'codigo_alternativa', {
      type: Sequelize.DataTypes.STRING(128),
      allowNull: false,
      after: 'codigo_pregunta',
      references: {
        model: 'pregunta_alternativas',
        key: 'codigo'
      }
    })

    await queryInterface.dropTable('respuesta_alternativas');

  }
};
