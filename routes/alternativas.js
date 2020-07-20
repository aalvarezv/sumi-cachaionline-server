const express = require('express');
const router = express.Router();
const {listarAlternativas} = require('../controllers/alternativaController');

router.get('/', listarAlternativas);

module.exports = router;
