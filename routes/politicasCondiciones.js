const express = require('express');
const router = express.Router();
const { getPoliticasCondiciones } = require('../controllers/politicasCondicionesController');
const auth = require('../middleware/auth');

router.get('/', auth, getPoliticasCondiciones)

module.exports = router

