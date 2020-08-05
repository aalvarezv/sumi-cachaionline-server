const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {listarModulos} = require('../controllers/moduloController');

router.get('/listar', listarModulos);

module.exports = router;