const express = require('express');
const router = express.Router();
const {nivelAcademico} = require('../controllers/nivelAcademicoController');

router.get('/', nivelAcademico);

module.exports = router;