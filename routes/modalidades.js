const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {crearModalidad, listarModalidades, busquedaModalidad} = require('../controllers/modalidadController');


router.post('/crear',
    auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique', ),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    crearModalidad
);

router.get('/listar', auth, listarModalidades);
router.get('/busqueda/:filtro', auth, busquedaModalidad);

module.exports = router;