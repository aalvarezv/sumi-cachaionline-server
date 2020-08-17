const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {listarUnidades, crearUnidad, actualizarUnidades, eliminarUnidades, datosUnidad, unidadesMateria, unidadesMateriaNivelAcademico} = require('../controllers/unidadController');


router.post('/crear', auth,
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique'),
    check('codigo_materia').not().isEmpty().withMessage('El codigo de la materia es obligatorio, verifique')
],
crearUnidad); 
router.get('/listar', listarUnidades);
router.put('/actualizar', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique'),
    check('codigo_materia').not().isEmpty().withMessage('El codigo de la materia es obligatorio, verifique')
],
actualizarUnidades)
router.delete('/eliminar/:codigo', auth, eliminarUnidades);
router.get('/datos/:codigo', auth, datosUnidad);
router.get('/materia/:codigo_materia', unidadesMateria);
router.get('/materia-nivel-academico/', unidadesMateriaNivelAcademico);

module.exports = router;  