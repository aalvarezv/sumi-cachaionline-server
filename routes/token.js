const router = require('express').Router()
const { check } = require('express-validator')
const { tokenRefresh } = require('../controllers/tokenController')

router.post('/refresh', [
    check('rut').not().isEmpty().withMessage('El rut es obligatorio.'),
    check('tokenRefresh').not().isEmpty().withMessage('El tokenRefresh es obligatorio.'),
], tokenRefresh)

module.exports = router