const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { crearUsuarioInstitucionRol, listarUsuarioInstitucionRol, eliminarUsuarioInstitucionRol } = require('../controllers/usuarioInstitucionRolController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo identificador es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    check('codigo_institucion').not().isEmpty().withMessage('El código institucion es obligatorio.'),
    check('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.'),
], crearUsuarioInstitucionRol,
   listarUsuarioInstitucionRol
);

router.get('/listar/:rut_usuario', auth, listarUsuarioInstitucionRol);

router.delete('/eliminar/:codigo', auth, 
[
   query('rut_usuario').not().isEmpty().withMessage('El rut usuario es obligatorio.')
], eliminarUsuarioInstitucionRol, listarUsuarioInstitucionRol);

module.exports = router;