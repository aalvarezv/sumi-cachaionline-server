const { 
    sequelize,
} = require('../database/db');
const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');


exports.getEstadisticaInstitucion = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try{

        const { codigo_institucion } = req.query

        const estadisticaInstitucion = await sequelize.query(`  
            SELECT 
                tb.rut_usuario AS rut,
                u.nombre,
                u.avatar_color,
                u.avatar_textura,
                u.avatar_sombrero,
                u.avatar_accesorio,
                CONVERT(IFNULL((SELECT SUM(puntos) 
                    FROM respuestas re
                    LEFT JOIN rings ri ON ri.codigo = re.codigo_ring
                    WHERE re.rut_usuario = tb.rut_usuario 
                    AND ri.codigo_institucion = '${codigo_institucion}'), 0), SIGNED) AS total_puntos
            FROM(
                SELECT DISTINCT rut_usuario 
                    FROM usuarios_instituciones_roles 
                WHERE codigo_institucion = '${codigo_institucion}'
            )tb
            LEFT JOIN usuarios u ON u.rut = tb.rut_usuario
            ORDER BY total_puntos DESC
        `, { type: QueryTypes.SELECT })

        res.json({
            estadisticaInstitucion
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.getEstadisticaRing = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_ring } = req.query

        const estadisticaRing = await sequelize.query(`           
            SELECT
                tb.rut_usuario AS rut,
                u.nombre,
                u.avatar_color,
                u.avatar_textura,
                u.avatar_sombrero,
                u.avatar_accesorio,
                CONVERT(IFNULL((SELECT COUNT(*) 
                    FROM respuestas 
                    WHERE rut_usuario = tb.rut_usuario
                    AND codigo_ring = '${codigo_ring}' 
                    AND correcta = 1 
                    AND omitida = 0
                    AND timeout = 0), 0), SIGNED) AS total_correctas,
                CONVERT(IFNULL((SELECT COUNT(*) 
                    FROM respuestas 
                    WHERE rut_usuario = tb.rut_usuario
                    AND codigo_ring = '${codigo_ring}' 
                    AND correcta = 0 
                    AND omitida = 0
                    AND timeout = 0), 0), SIGNED) AS total_incorrectas,
                CONVERT(IFNULL((SELECT COUNT(*) 
                    FROM respuestas 
                    WHERE rut_usuario = tb.rut_usuario
                    AND codigo_ring = '${codigo_ring}' 
                    AND correcta = 0
                    AND omitida = 1
                    AND timeout = 0), 0), SIGNED) AS total_omitidas,
                CONVERT(IFNULL((SELECT COUNT(*) 
                    FROM respuestas 
                    WHERE rut_usuario = tb.rut_usuario
                    AND codigo_ring = '${codigo_ring}' 
                    AND correcta = 0
                    AND omitida = 0
                    AND timeout = 1), 0), SIGNED) AS total_timeout,
                CONVERT(IFNULL((SELECT SUM(puntos) 
                    FROM respuestas 
                    WHERE rut_usuario = tb.rut_usuario
                    AND codigo_ring = '${codigo_ring}'), 0), SIGNED) AS total_puntos
            FROM (
                SELECT DISTINCT rut_usuario 
                    FROM ring_usuarios 
                WHERE codigo_ring = '${codigo_ring}' 
            )tb
            LEFT JOIN usuarios u ON u.rut = tb.rut_usuario
            ORDER BY total_puntos DESC
        `, { type: QueryTypes.SELECT })

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

exports.getEstadisticaUsuarioUnidades = async (req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {

        const { rut_usuario } = req.query
        
        const estadisticaUnidades = await sequelize.query(`
            SELECT codigo, descripcion, CONVERT(total_preguntas, SIGNED) AS total_preguntas, 
                CONVERT(correctas, SIGNED) AS correctas, CONVERT(IFNULL(((correctas * 100) / total_preguntas),0), DECIMAL(5,2)) AS correctas_porcent,
                CONVERT(incorrectas, SIGNED) AS incorrectas, CONVERT(IFNULL(((incorrectas * 100) / total_preguntas),0), DECIMAL(5,2)) AS incorrectas_porcent,
                CONVERT(omitidas, SIGNED) AS omitidas, CONVERT(IFNULL(((omitidas * 100) / total_preguntas),0), DECIMAL(5,2)) AS omitidas_porcent,
                CONVERT(timeout, SIGNED) AS timeout, CONVERT(IFNULL(((timeout * 100) / total_preguntas),0), DECIMAL(5,2)) AS timeout_porcent
            FROM 
            (SELECT 
                und.codigo, 
                und.descripcion,
                IFNULL((SELECT COUNT(DISTINCT rs.codigo, rs.codigo_pregunta) 
                        FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND un.codigo = und.codigo), 0) AS total_preguntas,
                IFNULL((SELECT COUNT(DISTINCT rs.codigo, rs.codigo_pregunta)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 1 
                        AND rs.omitida = 0
                        AND rs.timeout = 0
                        AND un.codigo = und.codigo), 0) AS correctas,
                IFNULL((SELECT COUNT(DISTINCT rs.codigo, rs.codigo_pregunta) 
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 0
                        AND rs.timeout = 0
                        AND un.codigo = und.codigo), 0) AS incorrectas,
                IFNULL((SELECT COUNT(DISTINCT rs.codigo, rs.codigo_pregunta)  
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 1 
                        AND rs.timeout = 0 
                        AND un.codigo = und.codigo), 0) AS omitidas,
                IFNULL((SELECT COUNT(DISTINCT rs.codigo, rs.codigo_pregunta)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        LEFT JOIN modulos md ON md.codigo = pm.codigo_modulo
                        LEFT JOIN unidades un ON un.codigo = md.codigo_unidad
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 0
                        AND rs.timeout = 1 
                        AND un.codigo = und.codigo), 0) AS timeout
            FROM unidades und)tb`, 
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

exports.getEstadisticaUsuarioUnidadModulos = async (req, res) => {


    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    
    try {

        const { rut_usuario, codigo_unidad } = req.query
        
        const estadisticaUnidadModulos = await sequelize.query(`
            SELECT codigo, descripcion, 
                CONVERT(total_preguntas, SIGNED) AS total_preguntas, 
                CONVERT(correctas, SIGNED) AS correctas, CONVERT(IFNULL(((correctas * 100) / total_preguntas),0), DECIMAL(5,2)) AS correctas_porcent,
                CONVERT(incorrectas, SIGNED) AS incorrectas, CONVERT(IFNULL(((incorrectas * 100) / total_preguntas),0), DECIMAL(5,2)) AS incorrectas_porcent,
                CONVERT(omitidas, SIGNED) AS omitidas, CONVERT(IFNULL(((omitidas * 100) / total_preguntas),0), DECIMAL(5,2)) AS omitidas_porcent,
                CONVERT(timeout, SIGNED) AS timeout, CONVERT(IFNULL(((timeout * 100) / total_preguntas),0), DECIMAL(5,2)) AS timeout_porcent
            FROM 
            (SELECT 
                md.codigo, 
                md.descripcion,
               
                IFNULL((SELECT COUNT(*) 
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND pm.codigo_modulo = md.codigo), 0) AS total_preguntas,
                    
                IFNULL((SELECT COUNT(*)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 1 
                        AND rs.omitida = 0
                        AND rs.timeout = 0
                        AND pm.codigo_modulo = md.codigo), 0) AS correctas,  
                IFNULL((SELECT COUNT(*)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 0
                        AND rs.timeout = 0
                        AND pm.codigo_modulo = md.codigo), 0) AS incorrectas,  
                IFNULL((SELECT COUNT(*)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 1
                        AND rs.timeout = 0
                        AND pm.codigo_modulo = md.codigo), 0) AS omitidas,  
                IFNULL((SELECT COUNT(*)
                            FROM respuestas rs
                        LEFT JOIN pregunta_modulos pm ON pm.codigo_pregunta = rs.codigo_pregunta
                        WHERE rs.rut_usuario = '${rut_usuario}' 
                        AND rs.correcta = 0 
                        AND rs.omitida = 0
                        AND rs.timeout = 1 
                        AND pm.codigo_modulo = md.codigo), 0) AS timeout
            FROM modulos md WHERE codigo_unidad = '${codigo_unidad}')tb`,
            { type: QueryTypes.SELECT })

        res.json({
            estadisticaUnidadModulos,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })    
    }

}