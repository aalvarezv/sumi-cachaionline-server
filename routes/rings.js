const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, body } = require('express-validator');

const { crearRing, listarRings, actualizarRing, eliminarRing, datosRing } = require('../controllers/ringController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),   
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'), 
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    check('codigo_institucion').not().isEmpty().withMessage('El código institución es obligatorio.').not().equals("0").withMessage('El código institución es obligatorio.'),
    //check('codigo_nivel_academico').not().isEmpty().withMessage('El código nivel academico es obligatorio.').not().equals("0").withMessage('El código nivel academico es obligatorio.'),
    check('codigo_materia').not().isEmpty().withMessage('El código materia es obligatorio.').not().equals("0").withMessage('El código materia es obligatorio.'),
    check('codigo_tipo_juego').not().isEmpty().withMessage('El código tipo juego es obligatorio.').not().equals("0").withMessage('El código tipo juego es obligatorio.'),
    check('codigo_modalidad').not().isEmpty().withMessage('El código modalidad es obligatorio.').not().equals("0").withMessage('El código modalidad es obligatorio.'),
    check('fecha_hora_inicio').not().isEmpty().withMessage('La fecha y hora de inicio es obligatoria.'),
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de fin es obligatoria.'),
    check('tipo_duracion_pregunta').not().isEmpty().withMessage('El código tipo duración pregunta es obligatorio.').not().equals("0").withMessage('El código tipo duración pregunta es obligatorio.'),
    check('duracion_pregunta').not().isEmpty().withMessage('El tiempo de duración de pregunta es obligatorio.'),
    body('revancha').custom((revancha, { req }) => {
        if(revancha && req.body.revancha_cantidad === '0' || req.body.revancha_cantidad === ''){
            throw new Error('La cantidad de revanchas debe ser mayor que 0.');        
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
], crearRing);

router.get('/listar', auth, listarRings);

router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),   
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'), 
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    check('codigo_institucion').not().isEmpty().withMessage('El código institución es obligatorio.').not().equals("0").withMessage('El código institución es obligatorio.'),
    check('codigo_materia').not().isEmpty().withMessage('El código materia es obligatorio.').not().equals("0").withMessage('El código materia es obligatorio.'),
    check('codigo_tipo_juego').not().isEmpty().withMessage('El código tipo juego es obligatorio.').not().equals("0").withMessage('El código tipo juego es obligatorio.'),
    check('codigo_modalidad').not().isEmpty().withMessage('El código modalidad es obligatorio.').not().equals("0").withMessage('El código modalidad es obligatorio.'),
    check('fecha_hora_inicio').not().isEmpty().withMessage('La fecha y hora de inicio es obligatoria.'),
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de fin es obligatoria.'),
    check('tipo_duracion_pregunta').not().isEmpty().withMessage('El código tipo duración pregunta es obligatorio.').not().equals("0").withMessage('El código tipo duración pregunta es obligatorio.'),
    check('duracion_pregunta').not().isEmpty().withMessage('El tiempo de duración de pregunta es obligatorio.'),
    body('revancha').custom((revancha, { req }) => {
        if(revancha && req.body.revancha_cantidad === '0' || req.body.revancha_cantidad === ''){
            throw new Error('La cantidad de revanchas debe ser mayor que 0.');        
        }
        // Indicates the success of this synchronous custom validator
        return true;
    })
], actualizarRing);

router.delete('/eliminar/:codigo', auth, eliminarRing);
router.get('/datos/:codigo', auth, datosRing);

module.exports = router;