'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('cuestionario_respuestas', {
      email:{
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      codigo_cuestionario_sugerencia: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      codigo_pregunta: {
          type: Sequelize.STRING(128),
          primaryKey: true,
          allowNull: false,
      },
      alternativa: {
          type: Sequelize.STRING(128),
          primaryKey: true,
          allowNull: false,
      },
      createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
      }, 
      updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
      }

    });

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('cuestionario_respuestas');
  }
};
