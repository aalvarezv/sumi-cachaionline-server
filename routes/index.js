const express = require('express');
const app = express();
 
app.use('/api/auth/', require('./auth'));
app.use('/api/usuarios/', require('./usuarios'));

app.use('/api/tipo-juegos', require('./tipoJuegos'));
app.use('/api/materias/', require('./materias'));
app.use('/api/unidades/', require('./unidades'));
app.use('/api/modulos/', require('./modulos'));
app.use('/api/contenidos/', require('./moduloContenidos'));
app.use('/api/temas/', require('./moduloContenidoTemas'));
app.use('/api/conceptos', require('./moduloContenidoTemaConceptos'));

app.use('/api/nivel-academico/', require('./nivelesAcademicos'));
app.use('/api/preguntas/', require('./preguntas'))
app.use('/api/roles/', require('./roles'));
app.use('/api/instituciones/', require('./instituciones'));
app.use('/api/cursos/', require('./cursos'));
app.use('/api/cursos-modulos/', require('./cursoModulos'));
app.use('/api/cursos-usuarios-roles/', require('./cursoUsuariosRol'));
app.use('/api/usuario-instituciones-roles/', require('./usuarioInstitucionRol'));
app.use('/api/modalidades/', require('./modalidades'));

app.use('/api/rings/', require('./rings')); 
app.use('/api/ring-usuarios/', require('./ringUsuarios'));
app.use('/api/ring-preguntas/',require('./ringPreguntas'));
app.use('/api/ring-invitaciones/',require('./ringInvitaciones'));

app.use('/api/pregunta-pistas/', require('./preguntaPistas'));
app.use('/api/pregunta-soluciones/', require('./preguntaSoluciones'));
app.use('/api/pregunta-modulos/', require('./preguntaModulos'));
app.use('/api/pregunta-modulo-contenidos/', require('./preguntaModuloContenidos'));
app.use('/api/tipo-juego-modalidades/', require('./tipoJuegoModalidades'));

app.use('/api/carga-masiva/', require('./cargaMasiva'));

app.use('/api/single/', require('./singles'));
app.use('/api/respuesta/', require('./respuestas'));

app.use('/api/token', require('./token'));

app.use('/api/politicas-condiciones', require('./politicasCondiciones'));

app.use('/api/recupera-clave/', require('./usuarioRecuperaClave'))

app.use('/api/estadistica/', require('./estadistica'))

app.use('/api/cuestionario-sugerencias/', require('./cuestionarioSugerencias'))
app.use('/api/cuestionario-respuestas/', require('./cuestionarioRespuestas'))
app.use('/api/cuestionario-estadisticas/', require('./cuestionarioEstadisticas'))
app.use('/api/multifiltros/', require('./multiFiltros'))

app.use('/api/carga-masiva-usuarios/', require('./cargaMasivaUsuarios'))
app.use('/api/carga-masiva-mineduc/', require('./cargaMasivaMineduc'))

app.use('/api/mineduc-tablero-objetivo/', require('./mineducTableroObjetivo'))
app.use('/api/mineduc-tablero-habilidad/', require('./mineducTableroHabilidad'))

app.use('/api/unidad-mineduc/', require('./unidadesMineduc'))

module.exports = app;
