'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    let instituciones = [{
        codigo: '1',
        descripcion: 'CLAUDIO MATTE',
        direccion: '',
        email: '',
        telefono: 0,
        website: '',
        logo: ''
    }, {
        codigo: '2',
        descripcion: 'COLEGIO MANANTIAL',
        direccion: '',
        email: '',
        telefono: 0,
        website: '',
        logo: ''
    }]

    await queryInterface.bulkInsert('instituciones', instituciones, {});

    let roles = [{
        codigo: '1',
        descripcion: 'ADMINISTRADOR SISTEMA',
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
    }, {
        codigo: '2',
        descripcion: 'ALUMNO',
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
    }, {
        codigo: '3',
        descripcion: 'PROFESOR',
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
    }, {
        codigo: '4',
        descripcion: 'RECTOR',
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
    }, {
        codigo: '5',
        descripcion: 'ADMINISTRADOR INSTITUCIÓN',
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
    }]

    await queryInterface.bulkInsert('roles', roles, {});

    let usuarios = [{
        rut: 'SYSTEM',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'SYSTEM',
        email: 'info@cachaionline.com',
        telefono: '12345678',
        imagen: ''
    }, {
        rut: '93733991',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Eduardo Patricio Alvarez Opazo',
        email: 'ed.alvarezv@gmail.com',
        telefono: '12345678',
        imagen: ''
    }, {
        rut: '92622908',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Maria Gloria Vargas Hernandez',
        email: 'mar.vargash@gmail.com',
        telefono: '12345678',
        imagen: ''
    }, {
        rut: '18999799K',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Eduardo Nicolas Alvarez Vargas',
        email: 'ed.alvarezv@gmail.com',
        telefono: '12345698',
        imagen: ''
    }, {
        rut: '162323695',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Alan Patricio Alvarez Vargas',
        email: 'alvarez.vargas@gmail.com',
        telefono: '12345633',
        imagen: ''
    }, {
        rut: '18380233K',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Wendy Perez Reyes',
        email: 'wen.preyes@gmail.com',
        telefono: '12345633',
        imagen: ''
    }, {
        rut: '241568628',
        clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
        nombre: 'Juan Perez',
        email: 'admin.institucion@gmail.com',
        telefono: '12345633',
        imagen: ''
    }]

    await queryInterface.bulkInsert('usuarios', usuarios, {});
    
    let usuarioInstitucionRoles = [{
        codigo: '1',
        rut_usuario: '162323695',
        codigo_institucion: '1',
        codigo_rol: '1'
    }]

    await queryInterface.bulkInsert('usuarios_instituciones_roles', usuarioInstitucionRoles, {});

    let nivelesAcademicos = [{
        codigo: '1',
        descripcion: 'PRIMERO MEDIO',
        nivel: 1
    }, {
        codigo: '2',
        descripcion: 'SEGUNDO MEDIO',
        nivel: 2
    }, {
        codigo: '3',
        descripcion: 'TERCERO MEDIO',
        nivel: 3
    }, {
        codigo: '4',
        descripcion: 'CUARTO MEDIO',
        nivel: 4
    }]

    await queryInterface.bulkInsert('niveles_academicos', nivelesAcademicos, {});

    let materias = [{
        codigo: 'MAT',
        nombre: 'MATEMÁTICAS',
        descripcion: 'Las matemáticas son la ciencia de los números y los cálculos. Desde la antigüedad, el hombre utiliza las matemáticas para hacer la vida más fácil y organizar la sociedad. La matemática fue utilizada por los egipcios en la construcción de las pirámides, presas, canales de riego y estudios de astronomía. Los antiguos griegos también desarrollaron varios conceptos matemáticos.',
        imagen: 'http://localhost/materias/matematicas.jpg'
    }, {
        codigo: 'CIE',
        nombre: 'CIENCIAS',
        descripcion: 'La ciencia en un sentido amplio, existía antes de la era moderna y en muchas civilizaciones.1​ La ciencia moderna es distinta en su enfoque y exitosa en sus resultados, por lo que ahora define lo que es la ciencia en el sentido más estricto del término.2​3​ "Ciencia" era una palabra para categorizar un tipo de conocimiento específico, más que una palabra que define la búsqueda de dicho conocimiento. En particular, era el tipo de conocimiento que las personas pueden comunicarse entre sí y compartir. Por ejemplo, el conocimiento sobre el funcionamiento de las cosas naturales se acumuló mucho antes de que se registrara la historia y condujo al desarrollo de un pensamiento abstracto complejo.',
        imagen: 'http://localhost/materias/ciencias.jpg'

    }, {
        codigo: 'LEN',
        nombre: 'LENGUAJE Y COMUNICACIÓN',
        descripcion: 'El lenguaje oral constituye el grado más alto de evolución lingüística, alcanzando únicamente por el ser humano. Es utilizado como instrumento de comunicación, representación y de relación social y es de vital importancia para el desarrollo cognitivo, social y afectivo del individuo, de aquí, el papel primordial que el lenguaje oral tiene dentro de la nueva legislación del sistema educativo y más concretamente en la definición de competencia de comunicación lingüística.',
        imagen: 'http://localhost/materias/lenguaje_comunicacion.jpg'
    }]

    await queryInterface.bulkInsert('materias', materias, {});

    let cursos = [{
        codigo: '1',
        letra: 'A',
        codigo_institucion: '1',
        codigo_nivel_academico: '1'
    }, {
        codigo: '2',
        letra: 'B',
        codigo_institucion: '1',
        codigo_nivel_academico: '2'
    }, {
        codigo: '3',
        letra: 'C',
        codigo_institucion: '1',
        codigo_nivel_academico: '3'
    }, {
        codigo: '4',
        letra: 'D',
        codigo_institucion: '1',
        codigo_nivel_academico: '4'
    }]

    await queryInterface.bulkInsert('cursos', cursos, {});

    let tipoJuegos = [{
        codigo: '1',
        descripcion: 'PREGUNTADOS',
    },{
        codigo: '2',
        descripcion: 'CARRERA DE CABALLOS',
    },{
        codigo: '3',
        descripcion: 'ELIMINACIÓN',
    }]

    await queryInterface.bulkInsert('tipo_juegos', tipoJuegos, {});

    let modalidades = [{
        codigo: '1',
        descripcion: 'USUARIO VS SISTEMA',
    }, {
        codigo: '2',
        descripcion: 'USUARIO VS USUARIO',
    }, {
        codigo: '3',
        descripcion: 'GRUPO VS GRUPO',
    }, {
        codigo: '4',
        descripcion: 'DIRECTA',
    }, {
        codigo: '5',
        descripcion: 'DOBLE',
    }]

    await queryInterface.bulkInsert('modalidades', modalidades, {});

    let tipoJuegoModalidades = [{
        codigo_tipo_juego: '1',
        codigo_modalidad: '1',
    },{
        codigo_tipo_juego: '1',
        codigo_modalidad: '2',
    },{
        codigo_tipo_juego: '1',
        codigo_modalidad: '3',
    },{
        codigo_tipo_juego: '2',
        codigo_modalidad: '1',
    },{
        codigo_tipo_juego: '2',
        codigo_modalidad: '2',
    },{
        codigo_tipo_juego: '2',
        codigo_modalidad: '3',
    },{
        codigo_tipo_juego: '3',
        codigo_modalidad: '4',
    },{
        codigo_tipo_juego: '3',
        codigo_modalidad: '5',
    }]

    await queryInterface.bulkInsert('tipo_juego_modalidades', tipoJuegoModalidades, {});

    let estados = [{
        codigo: '1',
        descripcion: 'INICIADO',
    },{
        codigo: '2',
        descripcion: 'PAUSA',
    },{
        codigo: '3',
        descripcion: 'FINALIZADO',
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
