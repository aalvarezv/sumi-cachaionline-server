const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { listarUnidadesMineducCurso } = require('../controllers/unidadMineducController');

router.get('/listar-unidades-mineduc', auth, listarUnidadesMineducCurso);


module.exports = router;