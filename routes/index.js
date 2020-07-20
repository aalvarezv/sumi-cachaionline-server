const express = require('express');
const app = express();

app.use('/api/usuarios/', require('./usuarios'));
app.use('/api/materias/', require('./materias'));
app.use('/api/alternativas/', require('./alternativas'));
app.use('/api/nivel-academico/', require('./nivelesAcademicos'));
app.use('/api/preguntas/', require('./preguntas'))
app.use('/api/roles/', require('./roles'));


module.exports = app; 
