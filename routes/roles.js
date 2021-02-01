const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearRol, listarRoles, actualizarRoles, eliminarRoles, datosRol, busquedaRoles } = require('../controllers/rolController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.', ),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.')
], crearRol);
router.get('/listar', auth, listarRoles);
router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.')
], actualizarRoles);
router.delete('/eliminar/:codigo', auth, eliminarRoles);
router.get('/datos/:codigo', auth, datosRol);
router.get('/busqueda', auth, busquedaRoles);

module.exports = router;