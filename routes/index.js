const express = require('express');
const app = express();


app.use('/api/auth/', require('./auth'));
app.use('/api/usuarios/', require('./usuarios'));
app.use('/api/materias/', require('./materias'));
app.use('/api/unidades/', require('./unidades'));
app.use('/api/modulos/', require('./modulos'));
app.use('/api/alternativas/', require('./alternativas'));
app.use('/api/nivel-academico/', require('./nivelesAcademicos'));
app.use('/api/preguntas/', require('./preguntas'))
app.use('/api/roles/', require('./roles'));
app.use('/api/cursos/', require('./cursos'));
app.use('/api/instituciones/', require('./instituciones'));


module.exports = app;