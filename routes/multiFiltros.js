const express = require('express');
const router = express.Router();


const {
    unidadesMaterias, 
    modulosUnidades, 
    modulosContenidos, 
    modulosContenidosTemas,
    modulosContenidosTemasConceptos,
} = require('../controllers/multiFiltrosController');

router.get('/listarUnidades', unidadesMaterias);
router.get('/listarModulosUnidades', modulosUnidades);
router.get('/listarModulosContenidos', modulosContenidos);
router.get('/listarModulosContenidosTemas', modulosContenidosTemas);
router.get('/listarModulosContenidosTemaConceptos', modulosContenidosTemasConceptos)


module.exports = router;