const  { Sequelize } = require('sequelize');
require('dotenv').config({ path: './variables.env' });


const UsuarioModel = require('../models/Usuario');
const MateriaModel = require('../models/Materia');
const AlternativaModel = require('../models/Alternativa');
const NivelAcademicoModel = require('../models/NivelAcademico');
const PreguntaModel = require('../models/Pregunta');
const RolModel = require('../models/Rol');
const UnidadModel = require('../models/Unidad');

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
const Usuario = UsuarioModel(sequelize, Sequelize);
const Materia = MateriaModel(sequelize,Sequelize);
const Alternativa = AlternativaModel(sequelize,Sequelize);
const NivelAcademico = NivelAcademicoModel(sequelize,Sequelize);
const Pregunta = PreguntaModel(sequelize,Sequelize);
const Rol = RolModel(sequelize,Sequelize);
const Unidad = UnidadModel(sequelize,Sequelize);

sequelize.sync({ force: true })
  .then( async () => {
    try{
        console.log('**** CONECTADO A LA BASE DE DATOS ****');
    
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
    Unidad
}