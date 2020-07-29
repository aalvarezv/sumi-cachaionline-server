const  {Sequelize} = require('sequelize');
require('dotenv').config({ path: './variables.env' });


const UsuarioModel = require('../models/Usuario');
const MateriaModel = require('../models/Materia');
const AlternativaModel = require('../models/Alternativa');
const NivelAcademicoModel = require('../models/NivelAcademico');
const PreguntaModel = require('../models/Pregunta');
const RolModel = require('../models/Rol');
const UnidadModel = require('../models/Unidad');
const NivelAcademicoUnidadModel = require('../models/NivelAcademicoUnidad');

//conexión a la bd
const sequelize = new Sequelize(process.env.DB_URI,{
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
const Rol = RolModel(sequelize,Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize,Rol);
const Materia = MateriaModel(sequelize,Sequelize);
const Unidad = UnidadModel(sequelize,Sequelize,Materia);
const NivelAcademico = NivelAcademicoModel(sequelize, Sequelize);
const NivelAcademicoUnidad = NivelAcademicoUnidadModel(sequelize,Sequelize,NivelAcademico,Unidad);
const Pregunta = PreguntaModel(sequelize,Sequelize,Unidad);
const Alternativa = AlternativaModel(sequelize,Sequelize,Pregunta);

//Relaciones
Rol.hasMany(Usuario, {foreignKey: 'codigo_rol'});
Usuario.belongsTo(Rol, {foreignKey: 'codigo_rol'});

Materia.hasMany(Unidad, {foreignKey: 'codigo_materia'});
Unidad.belongsTo(Materia, {foreignKey: 'codigo_materia'});

Unidad.hasMany(Pregunta, {foreignKey: 'codigo_unidad'});
Pregunta.belongsTo(Unidad, {foreignKey: 'codigo_unidad'});

Pregunta.hasMany(Alternativa, {foreignKey: 'codigo_pregunta'});
Alternativa.belongsTo(Pregunta, {foreignKey: 'codigo_pregunta'});

NivelAcademico.hasMany(NivelAcademicoUnidad, {foreignKey: 'codigo_nivel_academico'});
NivelAcademicoUnidad.belongsTo(NivelAcademico, {foreignKey: 'codigo_nivel_academico'});
Unidad.hasMany(NivelAcademicoUnidad, {foreignKey: 'codigo_unidad'});
NivelAcademicoUnidad.belongsTo(Unidad, {foreignKey: 'codigo_unidad'}); 


sequelize.sync({ force: true })
  .then( async () => {
    try{
        console.log('**** CONECTADO A LA BASE DE DATOS ****');
        const roles = await Rol.bulkCreate([
        {
            codigo: '1',
            descripcion: 'ADMINISTRADOR'
        },{
            codigo: '2',
            descripcion: 'ALUMNO'
        },{
            codigo: '3',
            descripcion: 'PROFESOR'
        }])
        console.log('ROLES INSERTADOS')

        const usuarios = await Usuario.bulkCreate([
        {
            rut: '93733991',
            clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
            nombre: 'Eduardo Patricio Alvarez Opazo',
            email: 'ed.alvarezv@gmail.com',
            telefono: 12345678,
            codigo_rol: '2'
        },{
            rut: '92622908',
            clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
            nombre: 'Maria Gloria Vargas Hernandez',
            email: 'mar.vargash@gmail.com',
            telefono: 12345678,
            codigo_rol: '2'
        },{
            rut: '18999799K',
            clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
            nombre: 'Eduardo Nicolas Alvarez Vargas',
            email: 'ed.alvarezv@gmail.com',
            telefono: 12345698,
            codigo_rol: '1'
        },{
            rut: '162323695',
            clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
            nombre: 'Alan Patricio Alvarez Vargas',
            email: 'alvarez.vargas@gmail.com',
            telefono: 12345633,
            codigo_rol: '3'
        }])
        console.log('USUARIOS INSERTADOS')
        const materias = await Materia.bulkCreate([
            {
            codigo: '1',
            descripcion: 'MATEMATICAS'
        },{
            codigo: '3',
            descripcion: 'LENGUAJE'
        },{
            codigo: '2',
            descripcion: 'HISTORIA'
        }])
        console.log('MATERIAS INSERTADAS')
        const unidades = await Unidad.bulkCreate([
            {
            codigo: '1',
            descripcion: 'SUMAS',
            codigo_materia: '1'
        },{
            codigo: '3',
            descripcion: 'MULTIPLICACIONES',
            codigo_materia: '1'
        },{
            codigo: '2',
            descripcion: 'CONECTORES',
            codigo_materia: '3'
        },{
            codigo: '4',
            descripcion: 'LITERATURA',
            codigo_materia: '3'
        },{
            codigo: '5',
            descripcion: 'HISTORIA DE CHILE',
            codigo_materia: '2'
        },{
            codigo: '6',
            descripcion: 'PRIMERA GUERRA MUNDIAL',
            codigo_materia: '2'
        }])
        console.log ('UNIDADES INSERTADAS')
        const preguntas = await Pregunta.bulkCreate([
            {
            codigo: '1',
            descripcion: '¿CUANTO ES 2+2?',
            imagen: 'jpn',
            puntaje: 2,
            codigo_unidad: '1'
        },{
            codigo: '3',
            descripcion: '¿CUANTO ES 5+12?',
            imagen: 'jpn',
            puntaje: 1,
            codigo_unidad: '1'
        },{
            codigo: '2',
            descripcion: '¿CUANTO ES 12X5?',
            imagen: 'png',
            puntaje: 3,
            codigo_unidad: '3'
        },{
            codigo: '4',
            descripcion: '¿CUANTO ES 1x0?',
            imagen: 'png',
            puntaje: 2,
            codigo_unidad: '3'
        }])
        console.log('PREGUNTAS INSERTADAS');
        const alternativas = Alternativa.bulkCreate([{
            codigo: '1',
            descripcion: '4',
            correcta: true,
            codigo_pregunta: '1'
        },{
            codigo: '2',
            descripcion: '20',
            correcta: false,
            codigo_pregunta: '1'
        },{
            codigo: '3',
            descripcion: '2',
            correcta: false,
            codigo_pregunta: '1'
        },{
            codigo: '4',
            descripcion: '15',
            correcta: false,
            codigo_pregunta: '3'
        },{
            codigo: '5',
            descripcion: '17',
            correcta: true,
            codigo_pregunta: '3'
        },{
            codigo: '6',
            descripcion: '10',
            correcta: false,
            codigo_pregunta: '3'
        },{
            codigo: '7',
            descripcion: '12',
            correcta: false,
            codigo_pregunta: '2'
        },{
            codigo: '8',
            descripcion: '55',
            correcta: false,
            codigo_pregunta: '2'
        },{
            codigo: '9',
            descripcion: '60',
            correcta: true,
            codigo_pregunta: '2'
        },{
            codigo: '10',
            descripcion: '1',
            correcta: false,
            codigo_pregunta: '4'
        },{
            codigo: '11',
            descripcion: '0',
            correcta: true,
            codigo_pregunta: '4'
        },{
            codigo: '12',
            descripcion: '10',
            correcta: false,
            codigo_pregunta: '4'
        }])
        console.log('ALTERNATIVAS INSERTADAS')
        const niveles = await NivelAcademico.bulkCreate([{
            codigo: '1',
            descripcion: 'PRIMERO MEDIO'
        },{
            codigo: '2',
            descripcion: 'SEGUNDO MEDIO'
        },{
            codigo: '3',
            descripcion: 'TERCERO MEDIO'
        },{
            codigo: '4',
            descripcion: 'CUARTO MEDIO'
        }])
        console.log('NIVELES ACADEMICOS INSERTADOS')
        const nivelacademico_unidad = NivelAcademicoUnidad.bulkCreate([{
            codigo_nivel_academico: '1',
            codigo_unidad: '1'
        },{
            codigo_nivel_academico: '2',
            codigo_unidad: '3'
        },{
            codigo_nivel_academico: '3',
            codigo_unidad: '1'
        },{
            codigo_nivel_academico: '3',
            codigo_unidad: '3'
        },{
            codigo_nivel_academico: '4',
            codigo_unidad: '2'
        },{
            codigo_nivel_academico: '4',
            codigo_unidad: '4'
        }])
        console.log('NIVELES ACADEMICOS POR UNIDADES INSERTADOS')
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
    NivelAcademicoUnidad
}