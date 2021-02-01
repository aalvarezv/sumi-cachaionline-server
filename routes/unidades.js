const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { listarUnidades, crearUnidad, actualizarUnidades, 
     eliminarUnidades, datosUnidad, unidadesMateria, unidadesPorDescripcionyMateria, unidadesMateriaNivelAcademico, 
     busquedaUnidades } = require('../controllers/unidadController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_materia', 'El código materia es obligatorio.').notEmpty().not().equals("0").withMessage('El código materia es obligatorio.'),
], crearUnidad);
router.get('/listar', auth, listarUnidades);
router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_materia', 'El código materia es obligatorio.').notEmpty().not().equals("0").withMessage('El código materia es obligatorio.'),
], actualizarUnidades)
router.delete('/eliminar/:codigo', auth, eliminarUnidades);
router.get('/datos/:codigo', auth, datosUnidad);
router.get('/materia/:codigo_materia', unidadesMateria);
router.get('/busqueda/descripcion-materia/', unidadesPorDescripcionyMateria);
router.get('/materia-nivel-academico/', unidadesMateriaNivelAcademico);
router.get('/busqueda/:filtro', auth, busquedaUnidades);

module.exports = router;