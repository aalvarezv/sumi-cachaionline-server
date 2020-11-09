const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearTipoJuego, listarTipoJuego, actualizarTipoJuego, eliminarTipoJuego } = require('../controllers/tipojuegoController');

router.post('/crear', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique')
    ],
    crearTipoJuego);
router.get('/listar', listarTipoJuego);
router.put('/actualizar', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique')
    ],
    actualizarTipoJuego);
router.delete('/eliminar/:codigo', auth, eliminarTipoJuego);

module.exports = router;