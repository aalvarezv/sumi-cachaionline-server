const express = require('express');
const router = express.Router();
const {listarUnidades} = require('../controllers/unidadController');

router.get('/', listarUnidades)

module.exports = router;