const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { body, check } = require('express-validator');

const {crearInstitucion, listarInstituciones, actualizarInstitucion, eliminarInstitucion, datosInstitucion, busquedaInstituciones} = require('../controllers/institucionController');

router.post('/crear', auth,
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatorio.')
], crearInstitucion);

router.get('/listar', auth, listarInstituciones);
router.put('/actualizar', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatorio.'),
],
actualizarInstitucion);
router.delete('/eliminar/:codigo', auth, eliminarInstitucion);
router.get('/datos/:codigo', auth, datosInstitucion);
router.get('/busqueda/:filtro', auth, busquedaInstituciones);

module.exports = router;