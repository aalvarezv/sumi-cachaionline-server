'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mineduc_tablero_habilidades', {
      codigo: {
        type: Sequelize.STRING(128),
        primaryKey: true,
        allowNull: false,
      },
      rut_usuario: {
        type: Sequelize.STRING(12),
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'rut',
        }
      },
      codigo_curso: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'cursos',
          key: 'codigo',
        }
      },
      codigo_unidad_mineduc: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'unidades_mineduc',
          key: 'codigo',
        }
      },
      numero_habilidad: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      codigo_estado: {
        type: Sequelize.STRING(128),
        allowNull: false,
        references: {
          model: 'estados',
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
    await queryInterface.dropTable('mineduc_tablero_habilidades');
  }
};