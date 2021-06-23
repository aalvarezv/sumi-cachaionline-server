const { 
    sequelize,
} = require('../database/db');
const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');

exports.getEstadisticaRing = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_ring } = req.query

        const estadisticaRing = await getResultadosPorRing(codigo_ring)

        res.json({
            estadisticaRing
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

} 

const getResultadosPorRing = (codigo_ring) => {

    return new Promise(async(resolve, reject) => {

        try {
            
            const resultados = await sequelize.query(`
                
                SELECT
                    tb.rut_usuario AS rut,
                    u.nombre,
                    u.avatar_color,
                    u.avatar_textura,
                    u.avatar_sombrero,
                    u.avatar_accesorio,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND correcta = 1 
                        AND omitida = 0) AS total_correctas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND correcta = 0 
                        AND omitida = 0) AS total_incorrectas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND omitida = 1) AS total_omitidas
                FROM (
                    SELECT DISTINCT rut_usuario 
                        FROM respuestas 
                    WHERE codigo_ring = '${codigo_ring}' 
                )tb
                LEFT JOIN usuarios u ON u.rut = tb.rut_usuario
                ORDER BY total_correctas DESC, total_incorrectas DESC, total_omitidas DESC
            `, { type: QueryTypes.SELECT })

            resolve(resultados);

        } catch (error) {
            reject(error);
        }

    })


}