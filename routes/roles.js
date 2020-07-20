const express = require('express');
const router = express.Router();
const {listarRoles} = require('../controllers/rolController');

router.get('/', listarRoles);

module.exports = router;