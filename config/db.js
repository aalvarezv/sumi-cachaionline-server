const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './variables.env' });


const UsuarioModel = require('../models/Usuario');
const MateriaModel = require('../models/Materia');
const AlternativaModel = require('../models/Alternativa');
const NivelAcademicoModel = require('../models/NivelAcademico');
const PreguntaModel = require('../models/Pregunta');
const RolModel = require('../models/Rol');
const UnidadModel = require('../models/Unidad');
const ModuloModel = require('../models/Modulo');
const CursoModel = require('../models/Curso');
const InstitucionModel = require('../models/Institucion');

const RespuestaDetalleModel = require('../models/RespuestaDetalle');
const RespuestaResumenModel = require('../models/RespuestaResumen');
const RespuestaUnidadModel = require('../models/RespuestaUnidad');


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
    timezone: '-04:00'
});
//crea el modelo
const Rol = RolModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize, Rol);
const Materia = MateriaModel(sequelize, Sequelize);
const Unidad = UnidadModel(sequelize, Sequelize, Materia);
const NivelAcademico = NivelAcademicoModel(sequelize, Sequelize);
const Modulo = ModuloModel(sequelize, Sequelize, Unidad, NivelAcademico);
const Pregunta = PreguntaModel(sequelize, Sequelize, Unidad);
const Alternativa = AlternativaModel(sequelize, Sequelize, Pregunta);
const Curso = CursoModel(sequelize, Sequelize, NivelAcademico);
const Institucion = InstitucionModel(sequelize, Sequelize);

/*
const RespuestaResumen = RespuestaResumenModel(sequelize, Sequelize, Usuario, Materia);
const RespuestaUnidad = RespuestaUnidadModel(sequelize, Sequelize, RespuestaResumen, Unidad);
const RespuestaDetalle = RespuestaDetalleModel(sequelize, Sequelize, Pregunta, Alternativa); 
*/

//Relaciones
Rol.hasMany(Usuario, { foreignKey: 'codigo_rol' });
Usuario.belongsTo(Rol, { foreignKey: 'codigo_rol' });

Materia.hasMany(Unidad, { foreignKey: 'codigo_materia' });
Unidad.belongsTo(Materia, { foreignKey: 'codigo_materia' });

Unidad.hasMany(Modulo, { foreignKey: 'codigo_unidad' });
Modulo.belongsTo(Unidad, { foreignKey: 'codigo_unidad' });

NivelAcademico.hasMany(Modulo, { foreignKey: 'codigo_nivel_academico' });
Modulo.belongsTo(NivelAcademico, { foreignKey: 'codigo_nivel_academico' });

Modulo.hasMany(Pregunta, { foreignKey: 'codigo_modulo' });
Pregunta.belongsTo(Modulo, { foreignKey: 'codigo_modulo' });

Pregunta.hasMany(Alternativa, { foreignKey: 'codigo_pregunta' });
Alternativa.belongsTo(Pregunta, { foreignKey: 'codigo_pregunta' });

NivelAcademico.hasMany(Curso, { foreingKey: 'codigo_nivel_academico' });
Curso.belongsTo(NivelAcademico, { foreignKey: 'codigo_nivel_academico' });



/*
Usuario.hasMany(RespuestaResumen, {foreignKey: 'rut_usuario'});
Materia.hasMany(RespuestaResumen, {foreignKey: 'codigo_materia'});

RespuestaResumen.hasMany(RespuestaUnidad, {foreignKey: 'codigo_respuesta_resumen'});
Unidad.hasMany(RespuestaUnidad, {foreignKey: 'codigo_unidad'});

Pregunta.hasMany(RespuestaDetalle, {foreignKey: 'codigo_pregunta'});
Alternativa.hasMany(RespuestaDetalle, {foreignKey: 'codigo_alternativa'});
RespuestaResumen.hasMany(RespuestaDetalle, {foreignKey: 'codigo_respuesta_resumen'});
*/

sequelize.sync({ force: true })
    .then(async() => {
        try {
            console.log('**** CONECTADO A LA BASE DE DATOS ****');
            const roles = await Rol.bulkCreate([{
                codigo: '1',
                descripcion: 'ADMINISTRADOR'
            }, {
                codigo: '2',
                descripcion: 'ALUMNO'
            }, {
                codigo: '3',
                descripcion: 'PROFESOR'
            }]);
            console.log('ROLES INSERTADOS');

            const usuarios = await Usuario.bulkCreate([{
                rut: '93733991',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Eduardo Patricio Alvarez Opazo',
                email: 'ed.alvarezv@gmail.com',
                telefono: 12345678,
                codigo_rol: '2'
            }, {
                rut: '92622908',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Maria Gloria Vargas Hernandez',
                email: 'mar.vargash@gmail.com',
                telefono: 12345678,
                codigo_rol: '2'
            }, {
                rut: '18999799K',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Eduardo Nicolas Alvarez Vargas',
                email: 'ed.alvarezv@gmail.com',
                telefono: 12345698,
                codigo_rol: '1'
            }, {
                rut: '162323695',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'Alan Patricio Alvarez Vargas',
                email: 'alvarez.vargas@gmail.com',
                telefono: 12345633,
                codigo_rol: '3'
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
                codigo_nivel_academico: '1'
            }, {
                codigo: '2',
                descripcion: 'NUMEROS CARDINALES',
                codigo_unidad: '1',
                codigo_nivel_academico: '1'
            }, {
                codigo: '3',
                descripcion: 'NUMEROS ENTEROS',
                codigo_unidad: '1',
                codigo_nivel_academico: '2'
            }, {
                codigo: '4',
                descripcion: 'CUADRADO DE TRINOMIO',
                codigo_unidad: '2',
                codigo_nivel_academico: '3'
            }, {
                codigo: '5',
                descripcion: 'IDENTIDAD DE GAUSS',
                codigo_unidad: '2',
                codigo_nivel_academico: '4'
            }, {
                codigo: '6',
                descripcion: 'TEOREMA DE LAGRANGE 1',
                codigo_unidad: '2',
                codigo_nivel_academico: '4'
            }, {
                codigo: '7',
                descripcion: 'TEOREMA DE LAGRANGE 2',
                codigo_unidad: '2',
                codigo_nivel_academico: '4'
            }]);
            console.log('MODULOS INSERTADOS');

            const cursos = await Curso.bulkCreate([{
                codigo: '1',
                letra: 'A',
                codigo_nivel_academico: '1'
            }, {
                codigo: '2',
                letra: 'B',
                codigo_nivel_academico: '2'
            }, {
                codigo: '3',
                letra: 'C',
                codigo_nivel_academico: '3'
            }, {
                codigo: '4',
                letra: 'D',
                codigo_nivel_academico: '4'
            }]);
            console.log('CURSOS INSERTADOS')

            const instituciones = await Institucion.bulkCreate([{
                codigo: '1',
                descripcion: 'CLAUDIO MATTE',
                logo: 'CM'
            }, {
                codigo: '2',
                descripcion: 'COLEGIO MANANTIAL',
                logo: 'CM'
            }, {
                codigo: '3',
                descripcion: 'HISPANO AMERICANO',
                logo: 'HA'
            }])
            console.log('INSTITUCIONES INSERTADAS')

        } catch (error) {
            console.log(error);
        }

    })

module.exports = {
    Usuario,
    Materia,
    Alternativa,
    NivelAcademico,
    Pregunta,
    Rol,
    Unidad,
    Modulo,
    Curso,
    Institucion
}