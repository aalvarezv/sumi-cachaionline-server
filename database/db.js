const { Sequelize } = require('sequelize')
const config = require('../config/database')

const ConfiguracionModel = require('../models/Configuracion')
const RolModel = require('../models/Rol')
const UsuarioModel = require('../models/Usuario')
const ModalidadModel = require('../models/Modalidad')
const TipoJuegoModel = require ('../models/TipoJuego')
const InstitucionModel = require('../models/Institucion')
const UsuarioInstitucionRolModel = require('../models/UsuarioInstitucionRol')
const NivelAcademicoModel = require('../models/NivelAcademico')
const CursoModel = require('../models/Curso')
const MateriaModel = require('../models/Materia')
const UnidadModel = require('../models/Unidad')
const ModuloModel = require('../models/Modulo')
const ModuloContenidoModel = require('../models/ModuloContenido')
const ModuloContenidoTemaModel = require('../models/ModuloContenidoTema')
const ModuloContenidoTemaConceptoModel = require('../models/ModuloContenidoTemaConcepto')
const CursoModuloModel = require('../models/CursoModulo')
const CursoUsuarioRolModel = require('../models/CursoUsuarioRol')
const PreguntaModel = require('../models/Pregunta')
const PreguntaAlternativaModel = require('../models/PreguntaAlternativa')
const RingModel = require('../models/Ring')
const SingleModel = require('../models/Single')
const EstadoModel = require('../models/Estado')
const RespuestaModel = require('../models/Respuesta')
const RespuestaAlternativaModel = require('../models/RespuestaAlternativa')
const RespuestaPistaModel = require('../models/RespuestaPista')
const RespuestaSolucionModel = require('../models/RespuestaSolucion')
const RingUsuarioModel = require('../models/RingUsuario')
const RingPreguntaModel = require('../models/RingPregunta')
const RingNivelAcademicoModel = require('../models/RingNivelAcademico')
const RingInvitacioModel = require('../models/RingInvitacion')
const PreguntaPistaModel = require('../models/PreguntaPista')
const PreguntaSolucionModel = require('../models/PreguntaSolucion')
const PreguntaModuloModel = require('../models/PreguntaModulo')
const PreguntaModuloContenidoModel = require('../models/PreguntaModuloContenido')
const PreguntaModuloContenidoTemaModel = require('../models/PreguntaModuloContenidoTema')
const PreguntaModuloContenidoTemaConceptoModel = require('../models/PreguntaModuloContenidoTemaConcepto')
const TipoJuegoModalidadModel = require('../models/TipoJuegoModalidad')
const UsuarioRecuperaClaveModel = require('../models/UsuarioRecuperaClave')
const CuestionarioSugerenciaModel = require('../models/CuestionarioSugerencia')
const CuestionarioRespuestaModel = require('../models/CuestionarioRespuesta')
const TokenRefreshModel = require('../models/TokenRefresh')


//conexión a la bd
const sequelize = new Sequelize(config)

//Crea el modelo
const Configuracion = ConfiguracionModel(sequelize, Sequelize)
const Rol = RolModel(sequelize, Sequelize)
const Usuario = UsuarioModel(sequelize, Sequelize)
const TipoJuego = TipoJuegoModel(sequelize, Sequelize)
const Institucion = InstitucionModel(sequelize, Sequelize, Usuario)
const NivelAcademico = NivelAcademicoModel(sequelize, Sequelize)
const Curso = CursoModel(sequelize, Sequelize, Institucion, NivelAcademico)
const UsuarioInstitucionRol = UsuarioInstitucionRolModel(sequelize, Sequelize, Usuario, Institucion, Rol)
const Materia = MateriaModel(sequelize, Sequelize)
const Unidad = UnidadModel(sequelize, Sequelize, Materia)
const Modulo = ModuloModel(sequelize, Sequelize, Unidad)
const ModuloContenido = ModuloContenidoModel(sequelize, Sequelize, Modulo)
const ModuloContenidoTema = ModuloContenidoTemaModel(sequelize, Sequelize, ModuloContenido)
const ModuloContenidoTemaConcepto = ModuloContenidoTemaConceptoModel(sequelize, Sequelize, ModuloContenidoTema)

const Modalidad = ModalidadModel(sequelize, Sequelize)
const Estado = EstadoModel(sequelize, Sequelize)
const TipoJuegoModalidad = TipoJuegoModalidadModel(sequelize, Sequelize, TipoJuego, Modalidad)
const CursoModulo = CursoModuloModel(sequelize, Sequelize, Curso, Modulo)
const CursoUsuarioRol = CursoUsuarioRolModel(sequelize, Sequelize, Curso, Usuario, Rol)
const Pregunta = PreguntaModel(sequelize, Sequelize, Usuario)
const PreguntaAlternativa = PreguntaAlternativaModel(sequelize, Sequelize, Pregunta)
const Ring = RingModel(sequelize, Sequelize, Usuario, TipoJuego, Materia, Institucion, Modalidad)
const RingUsuario = RingUsuarioModel(sequelize, Sequelize, Ring, Usuario, Institucion, Curso)
const RingPregunta = RingPreguntaModel(sequelize, Sequelize, Ring, Pregunta)
const RingNivelAcademico = RingNivelAcademicoModel(sequelize, Sequelize, Ring, NivelAcademico)
const PreguntaPista = PreguntaPistaModel(sequelize, Sequelize, Pregunta)
const PreguntaSolucion = PreguntaSolucionModel(sequelize, Sequelize, Pregunta)
const PreguntaModulo = PreguntaModuloModel(sequelize, Sequelize, Pregunta, Modulo)
const PreguntaModuloContenido = PreguntaModuloContenidoModel(sequelize, Sequelize, Pregunta, ModuloContenido)
const PreguntaModuloContenidoTema = PreguntaModuloContenidoTemaModel(sequelize, Sequelize, Pregunta, ModuloContenidoTema)
const PreguntaModuloContenidoTemaConcepto = PreguntaModuloContenidoTemaConceptoModel(sequelize, Sequelize, Pregunta, ModuloContenidoTemaConcepto)
const RingInvitacion = RingInvitacioModel(sequelize, Sequelize, Ring, Usuario)
const Single = SingleModel(sequelize, Sequelize, Usuario, Institucion, NivelAcademico, Estado)
const Respuesta = RespuestaModel(sequelize, Sequelize, Usuario, Single, Ring, Pregunta)
const RespuestaAlternativa = RespuestaAlternativaModel(sequelize, Sequelize, Respuesta, PreguntaAlternativa)
const RespuestaPista = RespuestaPistaModel(sequelize, Sequelize, Respuesta, PreguntaPista)
const RespuestaSolucion = RespuestaSolucionModel(sequelize, Sequelize, Respuesta, PreguntaSolucion)
const UsuarioRecuperaClave = UsuarioRecuperaClaveModel(sequelize, Sequelize, Usuario)
const CuestionarioSugerencia = CuestionarioSugerenciaModel(sequelize, Sequelize)
const CuestionarioRespuesta = CuestionarioRespuestaModel(sequelize, Sequelize)
const TokenRefresh = TokenRefreshModel(sequelize, Sequelize, Usuario);


//RELACIONES
Usuario.hasMany(UsuarioInstitucionRol, { foreignKey: 'rut_usuario' })
UsuarioInstitucionRol.belongsTo(Usuario, { foreignKey: 'rut_usuario' })
Institucion.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_institucion' })
UsuarioInstitucionRol.belongsTo(Institucion, { foreignKey: 'codigo_institucion' })
Rol.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_rol' })
UsuarioInstitucionRol.belongsTo(Rol, { foreignKey: 'codigo_rol' })

Curso.belongsTo(Institucion, { foreignKey: 'codigo_institucion'})
Curso.belongsTo(NivelAcademico, { foreignKey: 'codigo_nivel_academico' })
Modulo.belongsTo(Unidad, { foreignKey: 'codigo_unidad' })
Unidad.belongsTo(Materia, {foreignKey: 'codigo_materia', as: 'materia'})

Curso.hasMany(CursoUsuarioRol, { foreignKey: 'codigo_curso' })
Usuario.hasMany(CursoUsuarioRol, { foreignKey: 'rut_usuario' })
Rol.hasMany(CursoUsuarioRol, { foreignKey: 'codigo_rol' })

Curso.belongsToMany(Modulo, { through: CursoModulo, foreignKey: 'codigo_curso' })
Modulo.belongsToMany(Curso, { through: CursoModulo, foreignKey: 'codigo_modulo' })
ModuloContenido.belongsTo(Modulo, {foreignKey: 'codigo_modulo'})
ModuloContenidoTema.belongsTo(ModuloContenido, {foreignKey: 'codigo_modulo_contenido'})
ModuloContenidoTemaConcepto.belongsTo(ModuloContenidoTema, {foreignKey: 'codigo_modulo_contenido_tema'})

Pregunta.belongsTo(Usuario, {foreignKey: 'rut_usuario_creador'})
Pregunta.hasMany(PreguntaAlternativa, {foreignKey: 'codigo_pregunta', as : 'pregunta_alternativa'})
Pregunta.hasMany(PreguntaSolucion, {foreignKey: 'codigo_pregunta', as: 'pregunta_solucion'})
Pregunta.hasMany(PreguntaPista, {foreignKey: 'codigo_pregunta'})
Pregunta.hasMany(PreguntaModulo, {foreignKey: 'codigo_pregunta'})
Pregunta.hasMany(PreguntaModuloContenido, {foreignKey: 'codigo_pregunta'})
Pregunta.hasMany(PreguntaModuloContenidoTema, {foreignKey: 'codigo_pregunta'})
Pregunta.hasMany(PreguntaModuloContenidoTemaConcepto, {foreignKey: 'codigo_pregunta'})
Pregunta.hasMany(RingPregunta, {foreignKey: 'codigo_pregunta'})

PreguntaModulo.belongsTo(Modulo, {foreignKey: 'codigo_modulo'})
PreguntaModuloContenido.belongsTo(ModuloContenido, {foreignKey: 'codigo_modulo_contenido'})
PreguntaModuloContenidoTema.belongsTo(ModuloContenidoTema, {foreignKey: 'codigo_modulo_contenido_tema'})
PreguntaModuloContenidoTemaConcepto.belongsTo(ModuloContenidoTemaConcepto, {foreignKey: 'codigo_modulo_contenido_tema_concepto'})

Ring.belongsTo(Usuario, {foreignKey: 'rut_usuario_creador',  as: 'usuario_creador'})
Ring.belongsTo(Materia, {foreignKey: 'codigo_materia', as: 'materia'})
Ring.belongsTo(Institucion, {foreignKey: 'codigo_institucion', as: 'institucion'})
Ring.belongsTo(TipoJuego, {foreignKey: 'codigo_tipo_juego', as: 'tipo_juego'})
Ring.belongsTo(Modalidad, { foreignKey: 'codigo_modalidad', as: 'modalidad'})


Ring.hasMany(RingNivelAcademico,  {foreignKey: 'codigo_ring', as: 'niveles_academicos'})
Usuario.hasMany(RingUsuario, {foreignKey: 'rut_usuario'})

RingUsuario.belongsTo(Ring, {foreignKey: 'codigo_ring'})
RingUsuario.belongsTo(Usuario, {foreignKey: 'rut_usuario'})
RingPregunta.belongsTo(Pregunta, {foreignKey: 'codigo_pregunta', as: 'pregunta'})

RingInvitacion.belongsTo(Ring, { foreignKey: 'codigo_ring'})
RingInvitacion.belongsTo(Usuario, { as: 'usuario_emisor', foreignKey: 'rut_usuario_emisor' })
RingInvitacion.belongsTo(Usuario, { as: 'usuario_receptor', foreignKey: 'rut_usuario_receptor'})

RingNivelAcademico.belongsTo(NivelAcademico, { foreignKey: 'codigo_nivel_academico'})

CursoUsuarioRol.belongsTo(Curso, {foreignKey: 'codigo_curso'})
CursoUsuarioRol.belongsTo(Usuario, {foreignKey: 'rut_usuario'})

TipoJuegoModalidad.belongsTo(TipoJuego, {foreignKey: 'codigo_tipo_juego'})
TipoJuegoModalidad.belongsTo(Modalidad, {foreignKey: 'codigo_modalidad'})

module.exports = {
    Configuracion,
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
    ModuloContenido,
    ModuloContenidoTema,
    ModuloContenidoTemaConcepto,
    CursoModulo,
    CursoUsuarioRol,
    sequelize,
    Ring,
    Estado,
    Single,
    RespuestaPista,
    RespuestaSolucion,
    RespuestaAlternativa,
    Respuesta,
    RingUsuario,
    RingPregunta,
    RingNivelAcademico,
    RingInvitacion,
    PreguntaPista,
    PreguntaSolucion,
    PreguntaModulo,
    PreguntaModuloContenido,
    TipoJuego,  
    PreguntaModuloContenidoTema,
    PreguntaModuloContenidoTemaConcepto,
    Modalidad,
    TipoJuegoModalidad,
    UsuarioRecuperaClave,
    CuestionarioSugerencia,
    CuestionarioRespuesta,
    TokenRefresh,
}