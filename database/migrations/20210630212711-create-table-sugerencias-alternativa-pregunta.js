'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('sugerencias_alternativa_pregunta', {
      codigo_pregunta: {
          type: Sequelize.STRING(128),
          primaryKey: true,
          allowNull: true,
      },
      alternativa: {
          type: Sequelize.STRING(128),
          primaryKey: true,
          allowNull: false,
      },
      alternativa_correcta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      link_1: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      link_2: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      link_3: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      link_4: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      link_5: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      imagen_1: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      imagen_2: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      imagen_3: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      imagen_4: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      imagen_5: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      video_1: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      video_2: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      video_3: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      video_4: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
      },
      video_5: {
          type: Sequelize.STRING(512),
          allowNull: false,
          defaultValue: ''
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
      await queryInterface.dropTable('sugerencias_alternativa_pregunta');
  }
};
