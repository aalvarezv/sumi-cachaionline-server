const express = require('express');
const router = express.Router();
const { query } = require('express-validator')
const auth = require('../middleware/auth');

const { getMejores10, getPeores10, 
        getPromedioGeneral, getPuntajeUsuarioVsPromedioCurso,
        getCuestionarioInfo, 
        getPreguntasAcertadas,
        getPreguntasErradas,
        getPreguntasOmitidas} = require('../controllers/cuestionarioEstadisticaController');

router.get('/mejores-10', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
],  getMejores10);

router.get('/peores-10', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
],  getPeores10);

router.get('/promedio-general', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
],  getPromedioGeneral);

router.get('/usuario-vs-curso', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
],  getPuntajeUsuarioVsPromedioCurso);

router.get('/info', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
],  getCuestionarioInfo);

router.get('/preguntas-acertadas', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
], getPreguntasAcertadas);

router.get('/preguntas-erradas', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
], getPreguntasErradas);

router.get('/preguntas-omitidas', auth, [
    query('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
], getPreguntasOmitidas);

module.exports = router