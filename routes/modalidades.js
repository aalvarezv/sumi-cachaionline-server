const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {crearModalidad, listarModalidadesTipoJuego, busquedaModalidad} = require('../controllers/modalidadController');


router.post('/crear',
    auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique', ),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    crearModalidad
);

router.get('/listar/:codigo_tipo_juego', auth, listarModalidadesTipoJuego);
router.get('/busqueda/:filtro', auth, busquedaModalidad);

module.exports = router;