const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('express-validator');

const { 
    getEstadisticaInstitucion, 
    getEstadisticaRing, 
    getEstadisticaUsuarioUnidades,
    getEstadisticaUsuarioUnidadModulos 
} = require('../controllers/estadisticasController');


router.get('/institucion', auth, [
    query('codigo_institucion').exists().withMessage('El código institución es obligatorio').notEmpty().withMessage('El código institución no puede ser vacío')
], getEstadisticaInstitucion)

router.get('/ring', auth, [
    query('codigo_ring').exists().withMessage('El código ring es obligatorio').notEmpty().withMessage('El código ring no puede ser vacío')
], getEstadisticaRing);

router.get('/usuario-unidades', auth, [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío')
], getEstadisticaUsuarioUnidades)

router.get('/usuario-unidad-modulos', auth, [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    query('codigo_unidad').exists().withMessage('El código unidad es obligatorio').notEmpty().withMessage('El código unidad no puede ser vacío')
], getEstadisticaUsuarioUnidadModulos)


module.exports = router;