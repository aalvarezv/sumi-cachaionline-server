const express = require('express');
const router = express.Router();
const {listarMaterias} = require('../controllers/materiaController');

router.get('/', listarMaterias);

module.exports = router;