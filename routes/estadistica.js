const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('express-validator');

const { getEstadisticaRing, getEstadisticaUsuarioUnidades } = require('../controllers/estadisticasController');

router.get('/ring', auth, [
    query('codigo_ring').exists().withMessage('El código ring es obligatorio').notEmpty().withMessage('El código ring no puede ser vacío')
], getEstadisticaRing);

router.get('/usuario-unidades', auth, [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío')
], getEstadisticaUsuarioUnidades)

module.exports = router;