const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './variables.env' });

const RolModel = require('../models/Rol');
const UsuarioModel = require('../models/Usuario');
const InstitucionModel = require('../models/Institucion');
const UsuarioInstitucionRolModel = require('../models/UsuarioInstitucionRol');
const NivelAcademicoModel = require('../models/NivelAcademico');
const CursoModel = require('../models/Curso');
const MateriaModel = require('../models/Materia');
const UnidadModel = require('../models/Unidad');
const ModuloModel = require('../models/Modulo');
const ModuloPropiedadModel = require('../models/ModuloPropiedad');
const CursoModuloModel = require('../models/CursoModulo');
const CursoUsuarioRolModel = require('../models/CursoUsuarioRol');
const PreguntaModel = require('../models/Pregunta');
const PreguntaAlternativaModel = require('../models/PreguntaAlternativa');
const RingModel = require('../models/Ring');
const RingUsuarioModel = require('../models/RingUsuario');
const RingPreguntaModel = require('../models/RingPregunta');
const PreguntaPistaModel = require('../models/PreguntaPista');
const PreguntaSolucionModel = require('../models/PreguntaSolucion');
const PreguntaModuloModel = require('../models/PreguntaModulo');
const PreguntaModuloPropiedadModel = require ('../models/PreguntaModuloPropiedad');

//conexión a la bd
const sequelize = new Sequelize(process.env.DB_URI, {
    define: { 
        timestamps: false
    },
    dialect: 'mysql',
    logging: false, //console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
    },
    timezone: '-03:00'
});

//Crea el modelo
const Rol = RolModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const Institucion = InstitucionModel(sequelize, Sequelize, Usuario);
const NivelAcademico = NivelAcademicoModel(sequelize, Sequelize);
const Curso = CursoModel(sequelize, Sequelize, Institucion, NivelAcademico);
const UsuarioInstitucionRol = UsuarioInstitucionRolModel(sequelize, Sequelize, Usuario, Institucion, Rol);
const Materia = MateriaModel(sequelize, Sequelize);
const Unidad = UnidadModel(sequelize, Sequelize, Materia);
const Modulo = ModuloModel(sequelize, Sequelize, Unidad);
const ModuloPropiedad = ModuloPropiedadModel(sequelize, Sequelize, Modulo);
const CursoModulo = CursoModuloModel(sequelize, Sequelize, Curso, Modulo);
const CursoUsuarioRol = CursoUsuarioRolModel(sequelize, Sequelize, Curso, Usuario, Rol);
const Pregunta = PreguntaModel(sequelize, Sequelize, Modulo);
const PreguntaAlternativa = PreguntaAlternativaModel(sequelize, Sequelize, Pregunta);
const Ring = RingModel(sequelize, Sequelize, Usuario);
const RingUsuario = RingUsuarioModel(sequelize, Sequelize, Ring, Usuario);
const RingPregunta = RingPreguntaModel(sequelize, Sequelize, Ring, Pregunta);
const PreguntaPista = PreguntaPistaModel(sequelize, Sequelize, Pregunta);
const PreguntaSolucion = PreguntaSolucionModel(sequelize, Sequelize, Pregunta);
const PreguntaModulo = PreguntaModuloModel(sequelize, Sequelize, Pregunta, Modulo);
const PreguntaModuloPropiedad = PreguntaModuloPropiedadModel(sequelize, Sequelize, Pregunta, ModuloPropiedad);

//Relaciones
Usuario.hasMany(UsuarioInstitucionRol, { foreignKey: 'rut_usuario' });
UsuarioInstitucionRol.belongsTo(Usuario, { foreignKey: 'rut_usuario' });
Institucion.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_institucion' });
UsuarioInstitucionRol.belongsTo(Institucion, { foreignKey: 'codigo_institucion' });
Rol.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_rol' });
UsuarioInstitucionRol.belongsTo(Rol, { foreignKey: 'codigo_rol' });

Curso.belongsTo(NivelAcademico, { foreignKey: 'codigo_nivel_academico' });
Modulo.belongsTo(Unidad, { foreignKey: 'codigo_unidad' });

Curso.hasMany(CursoUsuarioRol, { foreignKey: 'codigo_curso' });
Usuario.hasMany(CursoUsuarioRol, { foreignKey: 'codigo_usuario' });
Rol.hasMany(CursoUsuarioRol, { foreignKey: 'codigo_rol' });

Curso.belongsToMany(Modulo, { through: CursoModulo, foreignKey: 'codigo_curso' })
Modulo.belongsToMany(Curso, { through: CursoModulo, foreignKey: 'codigo_modulo' })


sequelize.sync({ force: true })
    .then(async() => {
        try {
            console.log('**** CONECTADO A LA BASE DE DATOS ****');
            const roles = await Rol.bulkCreate([{
                    codigo: '1',
                    descripcion: 'ADMINISTRADOR SISTEMA'
                }, {
                    codigo: '2',
                    descripcion: 'ALUMNO'
                }, {
                    codigo: '3',
                    descripcion: 'PROFESOR'
                }, {
                    codigo: '4',
                    descripcion: 'RECTOR'
                }, {
                    codigo: '5',
                    descripcion: 'ADMINISTRADOR INSTITUCIÓN'
                }

            ]);
            console.log('ROLES INSERTADOS');

            const usuarios = await Usuario.bulkCreate([{
                rut: '93733991',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Eduardo Patricio Alvarez Opazo',
                email: 'ed.alvarezv@gmail.com',
                telefono: '12345678',
                codigo_rol: '2',
                imagen: ''
            }, {
                rut: '92622908',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Maria Gloria Vargas Hernandez',
                email: 'mar.vargash@gmail.com',
                telefono: '12345678',
                codigo_rol: '2',
                imagen: ''
            }, {
                rut: '18999799K',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Eduardo Nicolas Alvarez Vargas',
                email: 'ed.alvarezv@gmail.com',
                telefono: '12345698',
                codigo_rol: '1',
                imagen: ''
            }, {
                rut: '162323695',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Alan Patricio Alvarez Vargas',
                email: 'alvarez.vargas@gmail.com',
                telefono: '12345633',
                codigo_rol: '3',
                imagen: ''
            }, {
                rut: '18380233K',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Wendy Perez Reyes',
                email: 'wen.preyes@gmail.com',
                telefono: '12345633',
                codigo_rol: '4',
                imagen: ''
            }, {
                rut: '241568628',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Juan Perez',
                email: 'admin.institucion@gmail.com',
                telefono: '12345633',
                codigo_rol: '5',
                imagen: ''
            }]);
            console.log('USUARIOS INSERTADOS');

            const niveles = await NivelAcademico.bulkCreate([{
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
            }])
            console.log('NIVELES ACADEMICOS INSERTADOS');

            const materias = await Materia.bulkCreate([{
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
            }]);
            console.log('MATERIAS INSERTADAS');

            const unidades = await Unidad.bulkCreate([{
                codigo: '1',
                descripcion: 'NUMEROS',
                codigo_materia: 'MAT'
            }, {
                codigo: '2',
                descripcion: 'ALGEBRA',
                codigo_materia: 'MAT'
            }, {
                codigo: '3',
                descripcion: 'GEOMETRÍA',
                codigo_materia: 'MAT'
            }, {
                codigo: '4',
                descripcion: 'DATOS Y AZAR',
                codigo_materia: 'MAT'
            }]);
            console.log('UNIDADES INSERTADAS');

            const modulos = await Modulo.bulkCreate([{
                codigo: '1',
                descripcion: 'NUMEROS NATURALES',
                codigo_unidad: '1',
            }, {
                codigo: '2',
                descripcion: 'NUMEROS CARDINALES',
                codigo_unidad: '1',
            }, {
                codigo: '3',
                descripcion: 'NUMEROS ENTEROS',
                codigo_unidad: '1',
            }, {
                codigo: '4',
                descripcion: 'CUADRADO DE TRINOMIO',
                codigo_unidad: '2',
            }, {
                codigo: '5',
                descripcion: 'IDENTIDAD DE GAUSS',
                codigo_unidad: '2',
            }, {
                codigo: '6',
                descripcion: 'TEOREMA DE LAGRANGE 1',
                codigo_unidad: '2',
            }, {
                codigo: '7',
                descripcion: 'TEOREMA DE LAGRANGE 2',
                codigo_unidad: '2',
            }, {
                codigo: '8',
                descripcion: 'TEOREMA DE LAGRANGE 3',
                codigo_unidad: '2',
            }, {
                codigo: '9',
                descripcion: 'TEOREMA DE LAGRANGE 4',
                codigo_unidad: '2',
            }, {
                codigo: '10',
                descripcion: 'TEOREMA DE LAGRANGE 5',
                codigo_unidad: '2',
            }, {
                codigo: '11',
                descripcion: 'TEOREMA DE LAGRANGE 6',
                codigo_unidad: '2',
            }, {
                codigo: '12',
                descripcion: 'TEOREMA DE LAGRANGE 7',
                codigo_unidad: '2',
            }, {
                codigo: '13',
                descripcion: 'TEOREMA DE LAGRANGE 8',
                codigo_unidad: '2',
            }, {
                codigo: '14',
                descripcion: 'TEOREMA DE LAGRANGE 9',
                codigo_unidad: '2',
            }, {
                codigo: '15',
                descripcion: 'TEOREMA DE LAGRANGE 10',
                codigo_unidad: '2',
            }, {
                codigo: '16',
                descripcion: 'TEOREMA DE LAGRANGE 11',
                codigo_unidad: '2',
            }]);
            console.log('MODULOS INSERTADOS');

            const instituciones = await Institucion.bulkCreate([{
                codigo: '1',
                descripcion: 'CLAUDIO MATTE',
                rut_usuario_rector: '18380233K',
                rut_usuario_administrador: '241568628',
                direccion: '',
                email: '',
                telefono: 0,
                website: '',
                logo: ''
            }, {
                codigo: '2',
                descripcion: 'COLEGIO MANANTIAL',
                rut_usuario_rector: '18380233K',
                rut_usuario_administrador: '241568628',
                direccion: '',
                email: '',
                telefono: 0,
                website: '',
                logo: ''
            }])
            console.log('INSTITUCIONES INSERTADAS');

            const cursos = await Curso.bulkCreate([{
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
            }]);
            console.log('CURSOS INSERTADOS');

        } catch (error) {
            console.log(error);
        }

    })

module.exports = {
    Usuario,
    Rol,
    Institucion,
    NivelAcademico,
    Curso,
    UsuarioInstitucionRol,
    Materia,
    Pregunta,
    PreguntaAlternativa,
    Unidad,
    Modulo,
    ModuloPropiedad,
    CursoModulo,
    CursoUsuarioRol,
    sequelize,
    Ring,
    RingUsuario,
    RingPregunta,
    PreguntaPista,
    PreguntaSolucion,
    PreguntaModulo,
    PreguntaModuloPropiedad
}