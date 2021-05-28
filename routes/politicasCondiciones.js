const express = require('express');
const router = express.Router();
const { getPoliticasCondiciones } = require('../controllers/politicasCondicionesController');

router.get('/', getPoliticasCondiciones)

module.exports = router

