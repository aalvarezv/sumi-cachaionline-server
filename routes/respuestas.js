const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { guardarRespuesta } = require('../controllers/respuestaController');

router.post('/guardar', auth, [
    check('rut_usuario').exists().withMessage('Rut usuario es obligatorio.').notEmpty().withMessage('Rut usuario no puede ser vacío'),
    check('codigo_pregunta').exists().withMessage('Codigo pregunta es obligatorio.').notEmpty().withMessage('Codigo pregunta no puede ser vacío'),
    check('alternativas').custom((alternativas, { req }) => {
        let {omitida, timeout} = req.body;
        omitida = (omitida === "true")
        timeout = (timeout === "true")

        if(!omitida && !timeout && alternativas.length === 0){
            throw new Error('Debe enviar al menos una alternativa.')
        } 
        
        return true;
    }),
    check('tiempo').exists().withMessage('Tiempo es obligatorio.').notEmpty().withMessage('Tiempo no puede ser vacío'),
    check('omitida').exists().withMessage('Omitida es obligatorio.').notEmpty().withMessage('Omitida no puede ser vacío'),
    check('timeout').exists().withMessage('Timeout es obligatorio.').notEmpty().withMessage('Timeout no puede ser vacío'),
    check('vio_pista').exists().withMessage('Vio pista es obligatorio.').notEmpty().withMessage('Vio pista no puede ser vacío'),
    check('vio_solucion').exists().withMessage('Vio solución es obligatorio.').notEmpty().withMessage('Vio solución no puede ser vacío'),
], guardarRespuesta);


module.exports = router