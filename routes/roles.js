const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, body, param } = require('express-validator');

const { crearRol, listarRoles, actualizarRoles, eliminarRoles, datosRol, busquedaRoles } = require('../controllers/rolController');

router.post('/crear',
    auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique', ),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    crearRol
);

router.get('/listar', auth, listarRoles);

router.put('/actualizar', auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    actualizarRoles);
router.delete('/eliminar/:codigo', auth, eliminarRoles);
router.get('/datos/:codigo', auth, datosRol);
router.get('/busqueda/:filtro', auth, busquedaRoles);

module.exports = router;