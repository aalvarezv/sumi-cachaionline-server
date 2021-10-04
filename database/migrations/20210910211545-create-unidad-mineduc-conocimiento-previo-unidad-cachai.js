'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('unidades_mineduc_conocimientos_previos_unidades_cachai', {
      codigo: {       
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      codigo_unidad_mineduc: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'unidades_mineduc',
          key: 'codigo',
        }
      },
      numero_conocimiento_previo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      codigo_unidad_cachai: {
        type: Sequelize.STRING(128),
        allowNull: true,
        references: {
          model: 'unidades',
          key: 'codigo',
        }
      },
      codigo_modulo_cachai: {
        type: Sequelize.STRING(128),
        allowNull: true,
        references: {
          model: 'modulos',
          key: 'codigo',
        }
      },
      codigo_contenido_cachai: {
        type: Sequelize.STRING(128),
        allowNull: true,
        references: {
          model: 'modulo_contenidos',
          key: 'codigo',
        }
      },
      codigo_tema_cachai: {
        type: Sequelize.STRING(128),
        allowNull: true,
        references: {
          model: 'modulo_contenidos_temas',
          key: 'codigo',
        }
      },
      codigo_concepto_cachai: {
        type: Sequelize.STRING(128),
        allowNull: true,
        references: {
          model: 'modulo_contenidos_temas_conceptos',
          key: 'codigo',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('unidades_mineduc_conocimientos_previos_unidades_cachai');
  }
};