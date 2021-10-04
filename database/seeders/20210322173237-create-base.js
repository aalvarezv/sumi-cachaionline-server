'use strict';
const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    let instituciones = [{
        codigo: '1',
        descripcion: 'COLEGIO DEMO',
        direccion: '',
        email: '',
        telefono: 0,
        website: '',
        logo: '',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),

    }]

    await queryInterface.bulkInsert('instituciones', instituciones, {});

    let roles = [{
        codigo: '1',
        descripcion: 'ADMINISTRADOR SISTEMA',
        sys_admin: true,
        ver_menu_administrar: true,
        ver_submenu_instituciones: true,
        ver_submenu_niveles_academicos: true,
        ver_submenu_roles: true,
        ver_submenu_usuarios: true,
        ver_menu_asignaturas: true,
        ver_submenu_materias: true,
        ver_submenu_unidades: true,
        ver_submenu_modulos: true,
        ver_submenu_temas: true,
        ver_submenu_conceptos: true,
        ver_menu_preguntas: true,
        ver_menu_rings: true,
        ver_menu_cuestionarios: true,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '2',
        descripcion: 'ALUMNO',
        sys_admin: false,
        ver_menu_administrar: false,
        ver_submenu_instituciones: false,
        ver_submenu_niveles_academicos: false,
        ver_submenu_roles: false,
        ver_submenu_usuarios: false,
        ver_menu_asignaturas: false,
        ver_submenu_materias: false,
        ver_submenu_unidades: false,
        ver_submenu_modulos: false,
        ver_submenu_temas: false,
        ver_submenu_conceptos: false,
        ver_menu_preguntas: false,
        ver_menu_rings: false,
        ver_menu_cuestionarios: false,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '3',
        descripcion: 'PROFESOR',
        sys_admin: false,
        ver_menu_administrar: false,
        ver_submenu_instituciones: false,
        ver_submenu_niveles_academicos: false,
        ver_submenu_roles: false,
        ver_submenu_usuarios: false,
        ver_menu_asignaturas: false,
        ver_submenu_materias: false,
        ver_submenu_unidades: false,
        ver_submenu_modulos: false,
        ver_submenu_temas: false,
        ver_submenu_conceptos: false,
        ver_menu_preguntas: true,
        ver_menu_rings: true,
        ver_menu_cuestionarios: true,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '4',
        descripcion: 'RECTOR',
        sys_admin: false,
        ver_menu_administrar: false,
        ver_submenu_instituciones: false,
        ver_submenu_niveles_academicos: false,
        ver_submenu_roles: false,
        ver_submenu_usuarios: false,
        ver_menu_asignaturas: false,
        ver_submenu_materias: false,
        ver_submenu_unidades: false,
        ver_submenu_modulos: false,
        ver_submenu_temas: false,
        ver_submenu_conceptos: false,
        ver_menu_preguntas: false,
        ver_menu_rings: false,
        ver_menu_cuestionarios: false,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '5',
        descripcion: 'ADMINISTRADOR INSTITUCIÓN',
        sys_admin: false,
        ver_menu_administrar: true,
        ver_submenu_instituciones: true,
        ver_submenu_niveles_academicos: true,
        ver_submenu_roles: true,
        ver_submenu_usuarios: true,
        ver_menu_asignaturas: true,
        ver_submenu_materias: true,
        ver_submenu_unidades: true,
        ver_submenu_modulos: true,
        ver_submenu_temas: true,
        ver_submenu_conceptos: true,
        ver_menu_preguntas: true,
        ver_menu_rings: true,
        ver_menu_cuestionarios: true,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('roles', roles, {});

    let usuarios = [{
        rut: 'SYSTEM',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'SYSTEM',
        email: 'info@cachaionline.com',
        telefono: 1,
        imagen: '',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        rut: '162323695',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Alan Patricio Alvarez Vargas',
        email: 'alvarez.vargas@gmail.com',
        telefono: 1,
        imagen: '',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        rut: '19',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Usuario Demo',
        email: 'demo@gmail.com',
        telefono: 1,
        imagen: '',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('usuarios', usuarios, {});
    
    let usuarioInstitucionRoles = [{
        codigo: '1',
        rut_usuario: '162323695',
        codigo_institucion: '1',
        codigo_rol: '1',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '2',
        rut_usuario: '19',
        codigo_institucion: '1',
        codigo_rol: '2',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('usuarios_instituciones_roles', usuarioInstitucionRoles, {});

    let nivelesAcademicos = [{
        codigo: '1',
        descripcion: 'PRIMERO MEDIO',
        nivel: 1,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '2',
        descripcion: 'SEGUNDO MEDIO',
        nivel: 2,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '3',
        descripcion: 'TERCERO MEDIO',
        nivel: 3,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '4',
        descripcion: 'CUARTO MEDIO',
        nivel: 4,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('niveles_academicos', nivelesAcademicos, {});

    let materias = [{
        codigo: 'MAT',
        nombre: 'MATEMÁTICAS',
        descripcion: 'Las matemáticas son la ciencia de los números y los cálculos. Desde la antigüedad, el hombre utiliza las matemáticas para hacer la vida más fácil y organizar la sociedad. La matemática fue utilizada por los egipcios en la construcción de las pirámides, presas, canales de riego y estudios de astronomía. Los antiguos griegos también desarrollaron varios conceptos matemáticos.',
        imagen: 'http://localhost/materias/matematicas.jpg',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('materias', materias, {});

    let cursos = [{
        codigo: '1',
        letra: 'A',
        codigo_institucion: '1',
        codigo_nivel_academico: '1',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '2',
        letra: 'A',
        codigo_institucion: '1',
        codigo_nivel_academico: '2',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '3',
        letra: 'A',
        codigo_institucion: '1',
        codigo_nivel_academico: '3',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '4',
        letra: 'A',
        codigo_institucion: '1',
        codigo_nivel_academico: '4',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('cursos', cursos, {});

    let tipoJuegos = [{
        codigo: '1',
        descripcion: 'TRIVIA',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('tipo_juegos', tipoJuegos, {});

    let modalidades = [{
        codigo: '1',
        descripcion: 'USUARIO VS SISTEMA',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }, {
        codigo: '2',
        descripcion: 'USUARIO VS USUARIO',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('modalidades', modalidades, {});

    let tipoJuegoModalidades = [{
        codigo_tipo_juego: '1',
        codigo_modalidad: '1',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo_tipo_juego: '1',
        codigo_modalidad: '2',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('tipo_juego_modalidades', tipoJuegoModalidades, {});

    let estados = [{
        codigo: '1',
        descripcion: 'INICIADO',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '2',
        descripcion: 'PAUSA',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '3',
        descripcion: 'FINALIZADO',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '4',
        descripcion: 'PENDIENTE',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '5',
        descripcion: 'EN PROCESO',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    },{
        codigo: '6',
        descripcion: 'TERMINADO',
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm'),
    }]

    await queryInterface.bulkInsert('estados', estados, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
    
    await queryInterface.bulkDelete('usuarios_instituciones_roles', null, {});
    await queryInterface.bulkDelete('tipo_juego_modalidades', null, {});
    await queryInterface.bulkDelete('tipo_juegos', null, {});
    await queryInterface.bulkDelete('modalidades', null, {});
    await queryInterface.bulkDelete('configuraciones', null, {});
    await queryInterface.bulkDelete('estados', null, {});
    await queryInterface.bulkDelete('materias', null, {});
    await queryInterface.bulkDelete('cursos', null, {});
    await queryInterface.bulkDelete('niveles_academicos', null, {});
    await queryInterface.bulkDelete('instituciones', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }

};
