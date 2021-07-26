const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { 
    crearUsuarioInstitucionRol, 
    listarUsuarioInstitucionRol, 
    eliminarUsuarioInstitucionRol 
} = require('../controllers/usuarioInstitucionRolController');

router.post('/crear', auth, 
[
    check('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    check('codigo_institucion').exists().withMessage('El codigo institución es obligatorio').notEmpty().withMessage('El codigo institución no debe ser vacío'),
    check('codigo_rol').exists().withMessage('El codigo rol es obligatorio').notEmpty().withMessage('El codigo rol no debe ser vacío'),
], crearUsuarioInstitucionRol, listarUsuarioInstitucionRol);

router.get('/listar', auth, [
    query('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    query('codigo_institucion').exists().withMessage('El codigo institución es obligatorio').notEmpty().withMessage('El codigo institución no debe ser vacío'),
], listarUsuarioInstitucionRol);

router.delete('/eliminar', auth, [
    query('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    query('codigo_institucion').exists().withMessage('El codigo institución es obligatorio').notEmpty().withMessage('El codigo institución no debe ser vacío'),
    query('codigo_rol').exists().withMessage('El codigo rol es obligatorio').notEmpty().withMessage('El codigo rol no debe ser vacío'),
], eliminarUsuarioInstitucionRol, listarUsuarioInstitucionRol);

module.exports = router;