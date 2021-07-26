const router = require('express').Router()
const { check } = require('express-validator')
const { tokenRefresh } = require('../controllers/tokenController')

router.post('/refresh', [
    check('rut').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no puede ser vacío'),
    check('tokenRefresh').exists().withMessage('El tokenRefresh es obligatorio').notEmpty().withMessage('El tokenRefresh no puede ser vacío'),
], tokenRefresh)

module.exports = router