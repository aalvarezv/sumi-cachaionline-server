'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

        await queryInterface.addColumn('ring_usuarios', 'codigo_institucion', {
            type: Sequelize.DataTypes.STRING(12),
            allowNull: false,
            after: 'rut_usuario',
            references: {
              model: 'instituciones',
              key: 'codigo'
            }
        })

        await queryInterface.addColumn('ring_usuarios', 'codigo_curso', {
            type: Sequelize.DataTypes.STRING(128),
            allowNull: false,
            after: 'codigo_institucion',
            references: {
              model: 'cursos',
              key: 'codigo'
            }
        })
        
        await queryInterface.sequelize.query('ALTER TABLE ring_usuarios DROP PRIMARY KEY, ADD PRIMARY KEY(codigo_ring, rut_usuario, codigo_institucion, codigo_curso)')

  },

  down: async (queryInterface, Sequelize) => {
   
        await queryInterface.removeColumn('ring_usuarios', 'codigo_institucion')
        await queryInterface.removeColumn('ring_usuarios', 'codigo_curso')
        await queryInterface.sequelize.query('ALTER TABLE ring_usuarios DROP PRIMARY KEY, ADD PRIMARY KEY(codigo_ring, rut_usuario)')
       
  }
  
}
