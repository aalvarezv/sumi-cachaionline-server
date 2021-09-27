const { validationResult } = require('express-validator')
const { QueryTypes } = require('sequelize')
const { sequelize } = require('../database/db')

exports.getMejores10 = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query
       
        const mejores10 = await sequelize.query(`
            SELECT 
                tb.email,
                IFNULL(usr.nombre, 'NO REGISTRADO') AS nombre,
                SUM(alternativa_correcta) AS respuestas_correctas
            FROM (
                SELECT cr.email,
                    cr.codigo_pregunta,
                    cr.alternativa,
                    (SELECT alternativa_correcta
                        FROM cuestionario_sugerencias
                        WHERE codigo = '${codigo_cuestionario}'
                        AND codigo_pregunta = cr.codigo_pregunta
                        AND alternativa = cr.alternativa) AS alternativa_correcta
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                    )tb
            LEFT JOIN usuarios usr ON usr.email = tb.email
            GROUP BY email
            ORDER BY respuestas_correctas DESC
            LIMIT 10
        `, {type: QueryTypes.SELECT})

        res.json({
            mejores10,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }


}

exports.getPeores10 = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query
       
        const peores10 = await sequelize.query(`
            SELECT 
                tb.email,
                IFNULL(usr.nombre, 'NO REGISTRADO') AS nombre,
                SUM(alternativa_correcta) AS respuestas_correctas
            FROM (
                SELECT cr.email,
                    cr.codigo_pregunta,
                    cr.alternativa,
                    (SELECT alternativa_correcta
                        FROM cuestionario_sugerencias
                        WHERE codigo = '${codigo_cuestionario}'
                        AND codigo_pregunta = cr.codigo_pregunta
                        AND alternativa = cr.alternativa) AS alternativa_correcta
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                    )tb
            LEFT JOIN usuarios usr ON usr.email = tb.email
            GROUP BY email
            ORDER BY respuestas_correctas ASC
            LIMIT 10
        `, {type: QueryTypes.SELECT})
        
        res.json({
            peores10,
        })
                    
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

exports.getPromedioGeneral = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const promedioGeneral = await sequelize.query(`
            SELECT
                total_alumnos,
                total_preguntas,
                total_respuestas,
                correctas AS correctas_cant,
                CONVERT((((correctas / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS correctas_porcent,
                incorrectas AS incorrectas_cant,
                CONVERT((((incorrectas / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS incorrectas_porcent,
                omitidas AS omitidas_cant,
                CONVERT((((omitidas / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS omitidas_porcent
            FROM (
                SELECT 
                #TOTAL PREGUNTAS
                    (SELECT COUNT(DISTINCT codigo_pregunta) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_preguntas,
                #TOTAL ALUMNOS
                    (SELECT COUNT(DISTINCT email) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_alumnos,
                #TOTAL RESPUESTAS
                    (SELECT COUNT(*) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_respuestas,
                #RESPUESTAS CORRECTAS
                    (SELECT COUNT(*) FROM 
                        (SELECT 
                            IFNULL((SELECT alternativa_correcta
                                    FROM cuestionario_sugerencias
                                    WHERE codigo = '${codigo_cuestionario}'
                                        AND codigo_pregunta = cr.codigo_pregunta
                                        AND alternativa = cr.alternativa), -1) AS alternativa_estado
                        FROM cuestionario_respuestas cr 
                        WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}')tb
                    WHERE alternativa_estado = 1) AS correctas,
                #RESPUESTAS INCORRECTAS
                    (SELECT COUNT(*) FROM 
                        (SELECT 
                            IFNULL((SELECT alternativa_correcta
                            FROM cuestionario_sugerencias
                            WHERE codigo = '${codigo_cuestionario}'
                                AND codigo_pregunta = cr.codigo_pregunta
                                AND alternativa = cr.alternativa), -1) AS alternativa_estado
                        FROM cuestionario_respuestas cr
                        WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}')tb
                    WHERE alternativa_estado = 0) AS incorrectas,
                #PREGUNTAS OMITIDAS
                    (SELECT COUNT(*) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                    AND alternativa = 'OMITIDA' ) AS omitidas
            )tb    
        `, {type: QueryTypes.SELECT})

        res.json({
            promedioGeneral: promedioGeneral[0]
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

exports.getPuntajeUsuarioVsPromedioCurso = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const puntajeUsuarios = await sequelize.query(`
            SELECT
                tb.email,
                IFNULL(usr.nombre, 'NO REGISTRADO') AS nombre,
                total_preguntas,
                total_alumnos,
            #ALUMNO
                correctas_alumno AS correctas_alumno_cant,
                CONVERT(((correctas_alumno * 100) / total_preguntas), DECIMAL(5,2)) AS correctas_alumno_porcent,
                incorrectas_alumno AS incorrectas_alumno_cant,
                CONVERT(((incorrectas_alumno * 100) / total_preguntas), DECIMAL(5,2)) AS incorrectas_alumno_porcent,
                omitidas_alumno AS omitidas_alumno_cant,
                CONVERT(((omitidas_alumno * 100) / total_preguntas), DECIMAL(5,2)) AS omitidas_alumno_porcent
            FROM
                (SELECT 
                    DISTINCT(cr.email),
                #TOTAL PREGUNTAS
                    (SELECT COUNT(DISTINCT codigo_pregunta) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_preguntas,
                #TOTAL ALUMNOS
                    (SELECT COUNT(DISTINCT email) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_alumnos,
                #CORRECTAS ALUMNO
                    (SELECT COUNT(*) 
                        FROM (
                            SELECT 
                                cr.email,
                                cr.codigo_pregunta,
                                cr.alternativa,
                                (SELECT alternativa_correcta
                                FROM cuestionario_sugerencias
                                WHERE codigo = '${codigo_cuestionario}'
                                AND codigo_pregunta = cr.codigo_pregunta
                                AND alternativa = cr.alternativa) AS alternativa_estado
                            FROM cuestionario_respuestas cr
                            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                        )tb WHERE alternativa_estado = 1 AND email = cr.email) AS correctas_alumno,
                #INCORRECTAS ALUMNO
                    (SELECT COUNT(*) 
                        FROM (
                            SELECT 
                                cr.email,
                                cr.codigo_pregunta,
                                cr.alternativa,
                                (SELECT alternativa_correcta
                                FROM cuestionario_sugerencias
                                WHERE codigo = '${codigo_cuestionario}'
                                AND codigo_pregunta = cr.codigo_pregunta
                                AND alternativa = cr.alternativa) AS alternativa_estado
                            FROM cuestionario_respuestas cr
                            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                        )tb WHERE alternativa_estado = 0 AND email = cr.email) AS incorrectas_alumno,
                #OMITIDAS ALUMNO
                    (SELECT COUNT(*) 
                        FROM cuestionario_respuestas 
                    WHERE alternativa = 'OMITIDA' 
                    AND email = cr.email
                    AND codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS omitidas_alumno
            FROM cuestionario_respuestas cr
            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}')tb
            LEFT JOIN usuarios usr ON usr.email = tb.email
        `, {type: QueryTypes.SELECT})


        const promedioCurso = await sequelize.query(`
            SELECT
                total_preguntas,
                total_alumnos,
            #CURSO
                correctas_curso AS correctas_curso_cant,
                CONVERT((((correctas_curso / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS correctas_curso_porcent,
                incorrectas_curso AS incorrectas_curso_cant,
                CONVERT((((incorrectas_curso / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS incorrectas_curso_porcent,
                omitidas_curso AS omitidas_curso_cant,
                CONVERT((((omitidas_curso / total_alumnos) * 100) / total_preguntas), DECIMAL(5,2)) AS omitidas_curso_porcent
            FROM
                (SELECT 
                    DISTINCT(cr.email),
                #TOTAL PREGUNTAS
                    (SELECT COUNT(DISTINCT codigo_pregunta) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_preguntas,
                #TOTAL ALUMNOS
                    (SELECT COUNT(DISTINCT email) 
                        FROM cuestionario_respuestas
                    WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_alumnos,
                #CORRECTAS CURSO
                    (SELECT COUNT(*) 
                        FROM (
                            SELECT 
                                cr.email,
                                cr.codigo_pregunta,
                                cr.alternativa,
                                (SELECT alternativa_correcta
                                FROM cuestionario_sugerencias
                                WHERE codigo = '${codigo_cuestionario}'
                                AND codigo_pregunta = cr.codigo_pregunta
                                AND alternativa = cr.alternativa) AS alternativa_estado
                            FROM cuestionario_respuestas cr
                            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                        )tb WHERE alternativa_estado = 1) AS correctas_curso,
                #INCORRECTAS CURSO
                    (SELECT COUNT(*) 
                        FROM (
                            SELECT 
                                cr.email,
                                cr.codigo_pregunta,
                                cr.alternativa,
                                (SELECT alternativa_correcta
                                FROM cuestionario_sugerencias
                                WHERE codigo = '${codigo_cuestionario}'
                                AND codigo_pregunta = cr.codigo_pregunta
                                AND alternativa = cr.alternativa) AS alternativa_estado
                            FROM cuestionario_respuestas cr
                            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                        )tb WHERE alternativa_estado = 0) AS incorrectas_curso,
                #OMITIDAS CURSO
                    (SELECT COUNT(*) 
                        FROM cuestionario_respuestas 
                    WHERE alternativa = 'OMITIDA' 
                    AND codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS omitidas_curso
            FROM cuestionario_respuestas cr
            WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}')tb
        `, {type: QueryTypes.SELECT})

        res.json({
            puntajeUsuarios,
            promedioCurso: promedioCurso.length > 0 ? promedioCurso[0] : {},
        })
            
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
} 

exports.getCuestionarioInfo = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const cuestionarioInfo = await sequelize.query(`
            SELECT 
                (SELECT DISTINCT fecha_cuestionario
                FROM cuestionario_sugerencias
                WHERE codigo = '${codigo_cuestionario}') AS fecha_cuestionario,
                (SELECT DISTINCT link_cuestionario
                    FROM cuestionario_sugerencias
                    WHERE codigo = '${codigo_cuestionario}') AS link_cuestionario,
                (SELECT COUNT(DISTINCT email) 
                FROM cuestionario_respuestas
                WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_alumnos,
                (SELECT COUNT(DISTINCT codigo_pregunta) 
                FROM cuestionario_respuestas
                WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_preguntas,
                (SELECT COUNT(*) 
                FROM cuestionario_respuestas
                WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}') AS total_respuestas
        `,{ type: QueryTypes.SELECT})

        res.json({
            cuestionarioInfo: cuestionarioInfo[0]
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }


}

exports.getPreguntasAcertadas = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const preguntasAcertadas = await sequelize.query(`
            SELECT codigo_pregunta, SUM(correcta) AS correctas,
                SUM(incorrecta) AS incorrectas, SUM(omitida) AS omitidas
            FROM
            (
                SELECT codigo_pregunta, alternativa, correcta,
                    (CASE WHEN correcta = 0 AND alternativa <> 'OMITIDA' THEN 1 ELSE 0 END) AS incorrecta,
                    (CASE WHEN alternativa = 'OMITIDA' THEN 1 ELSE 0 END) omitida
                FROM (
                    SELECT 
                        cr.codigo_pregunta, 
                        cr.alternativa,
                        IFNULL((
                            SELECT alternativa_correcta
                            FROM cuestionario_sugerencias
                            WHERE codigo = cr.codigo_cuestionario_sugerencia
                            AND codigo_pregunta = cr.codigo_pregunta
                            AND alternativa = cr.alternativa
                        ), 0) AS correcta
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                ) tb
            )tb
            GROUP BY codigo_pregunta
            ORDER BY correctas DESC
            LIMIT 10
        `,{type: QueryTypes.SELECT})

        res.json({
            preguntasAcertadas,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

exports.getPreguntasErradas = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const preguntasErradas = await sequelize.query(`
            SELECT codigo_pregunta, SUM(correcta) AS correctas,
                SUM(incorrecta) AS incorrectas, SUM(omitida) AS omitidas
            FROM
            (
                SELECT codigo_pregunta, alternativa, correcta,
                    (CASE WHEN correcta = 0 AND alternativa <> 'OMITIDA' THEN 1 ELSE 0 END) AS incorrecta,
                    (CASE WHEN alternativa = 'OMITIDA' THEN 1 ELSE 0 END) omitida
                FROM (
                    SELECT 
                        cr.codigo_pregunta, 
                        cr.alternativa,
                        IFNULL((
                            SELECT alternativa_correcta
                            FROM cuestionario_sugerencias
                            WHERE codigo = cr.codigo_cuestionario_sugerencia
                            AND codigo_pregunta = cr.codigo_pregunta
                            AND alternativa = cr.alternativa
                        ), 0) AS correcta
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                ) tb
            )tb
            GROUP BY codigo_pregunta
            ORDER BY incorrectas DESC
            LIMIT 10
        `,{type: QueryTypes.SELECT})

        res.json({
            preguntasErradas,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

exports.getPreguntasOmitidas = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const preguntasOmitidas = await sequelize.query(`
            SELECT codigo_pregunta, SUM(correcta) AS correctas,
                SUM(incorrecta) AS incorrectas, SUM(omitida) AS omitidas
            FROM
            (
                SELECT codigo_pregunta, alternativa, correcta,
                    (CASE WHEN correcta = 0 AND alternativa <> 'OMITIDA' THEN 1 ELSE 0 END) AS incorrecta,
                    (CASE WHEN alternativa = 'OMITIDA' THEN 1 ELSE 0 END) omitida
                FROM (
                    SELECT 
                        cr.codigo_pregunta, 
                        cr.alternativa,
                        IFNULL((
                            SELECT alternativa_correcta
                            FROM cuestionario_sugerencias
                            WHERE codigo = cr.codigo_cuestionario_sugerencia
                            AND codigo_pregunta = cr.codigo_pregunta
                            AND alternativa = cr.alternativa
                        ), 0) AS correcta
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                ) tb
            )tb
            GROUP BY codigo_pregunta
            ORDER BY omitidas DESC
            LIMIT 10
        `,{type: QueryTypes.SELECT})

        res.json({
            preguntasOmitidas,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }

}

exports.getEstadisticaPreguntas = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const { codigo_cuestionario } = req.query

        const estadisticaPreguntas = await sequelize.query(`
            SELECT codigo_pregunta, 
                SUM(correcta) AS correctas, CONVERT(((SUM(correcta) * 100) / total_preguntas), DECIMAL(5,2)) AS correctas_porcent,
                SUM(incorrecta) AS incorrectas, CONVERT(((SUM(incorrecta) * 100) / total_preguntas), DECIMAL(5,2)) AS incorrectas_porcent,
                SUM(omitida) AS omitidas, CONVERT(((SUM(omitida) * 100) / total_preguntas), DECIMAL(5,2)) AS omitidas_porcent,
                total_preguntas
            FROM
            (
                SELECT codigo_pregunta, alternativa, correcta,
                    (CASE WHEN correcta = 0 AND alternativa <> 'OMITIDA' THEN 1 ELSE 0 END) AS incorrecta,
                    (CASE WHEN alternativa = 'OMITIDA' THEN 1 ELSE 0 END) omitida,
                    total_preguntas
                FROM (
                    SELECT 
                        cr.codigo_pregunta, 
                        cr.alternativa,
                        IFNULL((
                            SELECT alternativa_correcta
                            FROM cuestionario_sugerencias
                            WHERE codigo = cr.codigo_cuestionario_sugerencia
                            AND codigo_pregunta = cr.codigo_pregunta
                            AND alternativa = cr.alternativa
                        ), 0) AS correcta,
                        (SELECT COUNT(DISTINCT codigo_pregunta) 
                            FROM cuestionario_respuestas 
                            WHERE codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                        ) AS total_preguntas
                    FROM cuestionario_respuestas cr
                    WHERE cr.codigo_cuestionario_sugerencia = '${codigo_cuestionario}'
                ) tb
            )tb
            GROUP BY codigo_pregunta
            ORDER BY codigo_pregunta    
        `,{type: QueryTypes.SELECT})

        res.json({
            estadisticaPreguntas,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }


}