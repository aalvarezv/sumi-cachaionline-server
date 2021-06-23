const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('express-validator');

const { getEstadisticaRing } = require('../controllers/estadisticasController');

router.get('/ring', auth,[
    query('codigo_ring').exists().withMessage('El código ring es obligatorio').notEmpty().withMessage('El código ring no puede ser vacío')
], getEstadisticaRing);


module.exports = router;