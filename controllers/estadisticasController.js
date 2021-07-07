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
                        AND omitida = 0
                        AND timeout = 0) AS total_correctas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND correcta = 0 
                        AND omitida = 0
                        AND timeout = 0) AS total_incorrectas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND correcta = 0
                        AND omitida = 1
                        AND timeout = 0) AS total_omitidas,
                    (SELECT COUNT(*) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}' 
                        AND correcta = 0
                        AND omitida = 0
                        AND timeout = 1) AS total_timeout,
                    CAST((SELECT SUM(puntos) 
                        FROM respuestas 
                        WHERE rut_usuario = tb.rut_usuario
                        AND codigo_ring = '${codigo_ring}') AS SIGNED) AS total_puntos
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


exports.getEstadisticaUsuarioUnidades = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {

        const { rut_usuario } = req.query
        
        const estadisticaUnidades = await sequelize.query(`
            SELECT codigo, descripcion, CONVERT(total_preguntas, UNSIGNED INTEGER) AS total_preguntas, 
                CONVERT(correctas, UNSIGNED INTEGER) AS correctas, CONVERT(IFNULL(((correctas * 100) / total_preguntas),0), DECIMAL(5,2)) AS correctas_porcent,
                CONVERT(incorrectas, UNSIGNED INTEGER) AS incorrectas, CONVERT(IFNULL(((incorrectas * 100) / total_preguntas),0), DECIMAL(5,2)) AS incorrectas_porcent,
                CONVERT(omitidas, UNSIGNED INTEGER) AS omitidas, CONVERT(IFNULL(((omitidas * 100) / total_preguntas),0), DECIMAL(5,2)) AS omitidas_porcent,
                CONVERT(timeout, UNSIGNED INTEGER) AS timeout, CONVERT(IFNULL(((timeout * 100) / total_preguntas),0), DECIMAL(5,2)) AS timeout_porcent
            FROM 
            (SELECT 
                und.codigo, 
                und.descripcion,
                IFNULL((SELECT COUNT(*)
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' AND un.codigo = und.codigo), 0) AS total_preguntas,
                IFNULL((SELECT SUM(rs.correcta)
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' AND rs.correcta = 1 AND un.codigo = und.codigo), 0) AS correctas,
                IFNULL((SELECT SUM(rs.correcta)
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' AND rs.correcta = 0 AND un.codigo = und.codigo), 0) AS incorrectas,
                IFNULL((SELECT SUM(rs.omitida)
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' AND rs.omitida = 1 AND un.codigo = und.codigo), 0) AS omitidas,
                IFNULL((SELECT SUM(rs.timeout)
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' AND rs.timeout = 1 AND un.codigo = und.codigo), 0) AS timeout
            FROM unidades und)tb `, 
        { type: QueryTypes.SELECT })

        res.json({
            estadisticaUnidades,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })    
    }

}