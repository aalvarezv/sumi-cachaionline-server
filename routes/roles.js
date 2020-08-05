const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param } = require('express-validator');

const { crearRol, listarRoles,actualizarRoles, eliminarRoles, datosRol} = require('../controllers/rolController');

router.post('/crear', 
    auth,
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique',),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    crearRol
); 

router.get('/listar', auth, listarRoles);
router.put('/actualizar', auth, actualizarRoles);

router.delete('/eliminar/:codigo', 
    auth, 
    eliminarRoles
);

router.get('/datos/:codigo', auth, datosRol);

module.exports = router;