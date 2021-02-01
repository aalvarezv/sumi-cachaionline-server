const { Sequelize } = require('sequelize')
require('dotenv').config({ path: './variables.env' })

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
const RingUsuarioModel = require('../models/RingUsuario')
const RingPreguntaModel = require('../models/RingPregunta')
const PreguntaPistaModel = require('../models/PreguntaPista')
const PreguntaSolucionModel = require('../models/PreguntaSolucion')
const PreguntaModuloModel = require('../models/PreguntaModulo')
const PreguntaModuloContenidoModel = require('../models/PreguntaModuloContenido')
const PreguntaModuloContenidoTemaModel = require('../models/PreguntaModuloContenidoTema')
const PreguntaModuloContenidoTemaConceptoModel = require('../models/PreguntaModuloContenidoTemaConcepto')
const RingUsuarioPreguntaModel = require('../models/RingUsuarioRespuesta')
const TipoJuegoModalidadModel = require('../models/TipoJuegoModalidad')



//conexión a la bd
const sequelize = new Sequelize(process.env.DB_URI, {
    define: { 
        timestamps: false
    },
    dialect: 'mysql',
    logging: console.log, 
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
})

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
const TipoJuegoModalidad = TipoJuegoModalidadModel(sequelize, Sequelize, TipoJuego, Modalidad)
const CursoModulo = CursoModuloModel(sequelize, Sequelize, Curso, Modulo)
const CursoUsuarioRol = CursoUsuarioRolModel(sequelize, Sequelize, Curso, Usuario, Rol)
const Pregunta = PreguntaModel(sequelize, Sequelize, Usuario)
const PreguntaAlternativa = PreguntaAlternativaModel(sequelize, Sequelize, Pregunta)
const Ring = RingModel(sequelize, Sequelize, Usuario, TipoJuego, NivelAcademico, Materia, Institucion, Modalidad)
const RingUsuario = RingUsuarioModel(sequelize, Sequelize, Ring, Usuario)
const RingPregunta = RingPreguntaModel(sequelize, Sequelize, Ring, Pregunta)
const PreguntaPista = PreguntaPistaModel(sequelize, Sequelize, Pregunta)
const PreguntaSolucion = PreguntaSolucionModel(sequelize, Sequelize, Pregunta)
const PreguntaModulo = PreguntaModuloModel(sequelize, Sequelize, Pregunta, Modulo)
const PreguntaModuloContenido = PreguntaModuloContenidoModel(sequelize, Sequelize, Pregunta, ModuloContenido)
const PreguntaModuloContenidoTema = PreguntaModuloContenidoTemaModel(sequelize, Sequelize, Pregunta, ModuloContenidoTema)
const PreguntaModuloContenidoTemaConcepto = PreguntaModuloContenidoTemaConceptoModel(sequelize, Sequelize, Pregunta, ModuloContenidoTemaConcepto)
const RingUsuarioRespuesta = RingUsuarioPreguntaModel(sequelize, Sequelize, Ring, Usuario, Pregunta)

//RELACIONES
Usuario.hasMany(UsuarioInstitucionRol, { foreignKey: 'rut_usuario' })
UsuarioInstitucionRol.belongsTo(Usuario, { foreignKey: 'rut_usuario' })
Institucion.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_institucion' })
UsuarioInstitucionRol.belongsTo(Institucion, { foreignKey: 'codigo_institucion' })
Rol.hasMany(UsuarioInstitucionRol, { foreignKey: 'codigo_rol' })
UsuarioInstitucionRol.belongsTo(Rol, { foreignKey: 'codigo_rol' })

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


Ring.belongsTo(Usuario, {foreignKey: 'rut_usuario_creador'})

Ring.belongsTo(NivelAcademico,  {foreignKey: 'codigo_nivel_academico'})
Usuario.hasMany(RingUsuario, {foreignKey: 'rut_usuario'})

RingUsuario.belongsTo(Ring, {foreignKey: 'codigo_ring'})
RingPregunta.belongsTo(Pregunta, {foreignKey: 'codigo_pregunta'})

CursoUsuarioRol.belongsTo(Curso, {foreignKey: 'codigo_curso'})
CursoUsuarioRol.belongsTo(Usuario, {foreignKey: 'rut_usuario'})

TipoJuegoModalidad.belongsTo(TipoJuego, {foreignKey: 'codigo_tipo_juego'})
TipoJuegoModalidad.belongsTo(Modalidad, {foreignKey: 'codigo_modalidad'})


sequelize.sync({ force: false }).then(async() => {

        try {
            console.log('**** CONECTADO A LA BASE DE DATOS ****')
            await Configuracion.bulkCreate([{
                seccion: 'PREGUNTAS',
                clave: 'DIR',
                valor: '/Users/alanalvarez/Documents/cachaionline/preguntas/'
            },
            {
                seccion: 'TEMP',
                clave: 'DIR',
                valor: '/Users/alanalvarez/Documents/TEMP/'
            }
            ])

            await Institucion.bulkCreate([{
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
            }])
            console.log('INSTITUCIONES INSERTADAS')

            console.log('CONFIGURACIONES INSERTADAS')

            await Rol.bulkCreate([{
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
                }

            ])
            console.log('ROLES INSERTADOS')

            await Usuario.bulkCreate([{
                rut: 'SYSTEM',
                clave: '$2a$10$9wpsEopYMcnCbEjQSGYaMu4xcOZoLN5t5TAHV.4sja8ayFrUeEy.G',
                nombre: 'SYSTEM',
                email: 'info@cachaionline.com',
                telefono: '12345678',
                codigo_rol: '1',
                imagen: ''
            },{
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
            }])
            console.log('USUARIOS INSERTADOS')

            await UsuarioInstitucionRol.bulkCreate([{
                codigo: '1',
                rut_usuario: '162323695',
                codigo_institucion: '1',
                codigo_rol: '1'
            }])
            console.log('USUARIOS INSTITUCIÓN ROL')

            await NivelAcademico.bulkCreate([{
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
            console.log('NIVELES ACADEMICOS INSERTADOS')

            await Materia.bulkCreate([{
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
            }])
            console.log('MATERIAS INSERTADAS')
            

            

            await Curso.bulkCreate([{
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
            }])
            console.log('CURSOS INSERTADOS')

            await TipoJuego.bulkCreate([{
                codigo: '1',
                descripcion: 'PREGUNTADOS',
            },{
                codigo: '2',
                descripcion: 'CARRERA DE CABALLOS',
            },{
                codigo: '3',
                descripcion: 'ELIMINACIÓN',
            }])
            console.log('TIPOS DE JUEGOS INSERTADOS')

            await Modalidad.bulkCreate([{
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
            }])
            console.log('MODALIDADES INSERTADAS')

            await TipoJuegoModalidad.bulkCreate([{
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
            }])

        } catch (error) {
            console.log(error)
        }

    })

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
    RingUsuario,
    RingPregunta,
    PreguntaPista,
    PreguntaSolucion,
    PreguntaModulo,
    PreguntaModuloContenido,
    TipoJuego,  
    PreguntaModuloContenidoTema,
    PreguntaModuloContenidoTemaConcepto,
    RingUsuarioRespuesta,
    Modalidad,
    TipoJuegoModalidad,
}