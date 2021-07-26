const { Configuracion, SugerenciaAlternativaPregunta, Materia } = require('../database/db');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { sendMail } = require('../helpers');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.cargarPreguntas = async (req, res) => {
 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const { 
            rut_usuario, 
            nombre_formulario, 
            codigo_materia, 
            fecha_formulario, 
            archivo_base64 
        } = req.body;

        let nombre_archivo_carga = `CARGA-SUGERENCIAS-${nombre_formulario}.xlsx`
        let letra_columna_codigo_pregunta = "A"
        let letra_columna_alternativa = "B"
        let letra_columna_alternativa_correcta = "C"
        let letra_columna_link_1 = "D"
        let letra_columna_link_2 = "E"
        let letra_columna_link_3 = "F"
        let letra_columna_link_4 = "G"
        let letra_columna_link_5 = "H"
        let fila_inicio = 2
        let fila_fin = 1000
        
        //Directorio temporal donde se guardará el archivo zip con la información de las preguntas a cargar.
        const tmp_dir = process.env.DIR_TEMP;
        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_archivo_carga}`;
        //Guarda el archivo en el directorio temporal.
        await fs.writeFileSync(`${archivo_carga}`, archivo_base64, 'base64')

        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_carga);
        
        //Se ubica en la hoja CARGA
        hoja_excel  = libro_excel.getWorksheet('CARGA');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja CARGA en el archivo excel para procesar y cargar las preguntas, verifique.`,
            });
        }
        
        //Elimina todo el formulario del usuario.
        await SugerenciaAlternativaPregunta.destroy({
            where:{
                rut_usuario,
                nombre_formulario,
            }
        })


        //Carga los registros en la base de datos.
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){

            let codigo_pregunta = hoja_excel.getCell(`${letra_columna_codigo_pregunta}${i}`).text;
            if(codigo_pregunta.trim() === ''){
                break
            }
            
            let alternativa = hoja_excel.getCell(`${letra_columna_alternativa}${i}`).text;
            let alternativa_correcta = hoja_excel.getCell(`${letra_columna_alternativa_correcta}${i}`).text;

            let link_1 = hoja_excel.getCell(`${letra_columna_link_1}${i}`).text;
            let link_2 = hoja_excel.getCell(`${letra_columna_link_2}${i}`).text;
            let link_3 = hoja_excel.getCell(`${letra_columna_link_3}${i}`).text;
            let link_4 = hoja_excel.getCell(`${letra_columna_link_4}${i}`).text;
            let link_5 = hoja_excel.getCell(`${letra_columna_link_5}${i}`).text;

            await SugerenciaAlternativaPregunta.create({
                rut_usuario,
                nombre_formulario,
                codigo_pregunta,
                alternativa,
                alternativa_correcta,
                codigo_materia,
                fecha_formulario,
                link_1,
                link_2,
                link_3,
                link_4,
                link_5,
            })

        }

        fs.unlinkSync(archivo_carga)
    
        res.json({
            msg:"Todo OK",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }


}

exports.enviarSugerencias = async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try{

        const {
            rut_usuario,
            codigo_materia,
            nombre_formulario,
            archivo_base64,
        } = req.body
    
        let nombre_archivo_carga = `ENVIA-SUGERENCIAS-${nombre_formulario}.xlsx`

        //directorio temporal para bajar el excel.
        const tmp_dir = process.env.DIR_TEMP;
        //guarda el archivo base64 en el directorio temporal
        const archivo_excel = `${tmp_dir}/${nombre_archivo_carga}`
        await fs.writeFileSync(archivo_excel, archivo_base64, 'base64')

        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_excel);
        
        //Se ubica en la hoja de resultados
        hoja_excel  = libro_excel.getWorksheet(1);

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe una hoja con resultados en el archivo excel para procesar y enviar las sugerencias, verifique.`,
            });
        }

        //Obtiene la información del formulario.
        const formulario = await SugerenciaAlternativaPregunta.findOne({
            rut_usuario,
            nombre_formulario,
            codigo_materia,
        })

        const formulario_nombre = formulario.nombre_formulario
        const formulario_fecha = formulario.fecha_formulario
        
        const materia = await Materia.findByPk(codigo_materia)
        const materia_nombre = materia.nombre

        //Valida que toda la información del archivo recibido existe en el sistema (preguntas-alternativas)
        //Filas
        let columnas = ['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        for(let i = 2; i <= Number(100); i++){

            let email_usuario = hoja_excel.getCell(`B${i}`).text;
            if(email_usuario.trim() === '') break
             
            for(let columna of columnas){

                let codigo_pregunta = hoja_excel.getCell(`${columna}1`).text.replace('.','');
                if(codigo_pregunta.trim() === '') break

                let alternativa = hoja_excel.getCell(`${columna}${i}`).text.replace('false','FALSO');;

                const sugerenciasAlternativaPregunta = await SugerenciaAlternativaPregunta.findOne({
                    where: {
                        rut_usuario,
                        nombre_formulario,
                        codigo_pregunta,
                        alternativa,
                    }
                })

                if(!sugerenciasAlternativaPregunta){
                    return res.status(404).send({
                        msg: `Fila ${i} pregunta ${codigo_pregunta} alternativa ${alternativa} no existe en el formulario ${nombre_formulario} para el usuario ${rut_usuario}`
                    })
                }

            }
        
        }

        for(let i = 2; i <= Number(100); i++){

            let email_usuario = hoja_excel.getCell(`B${i}`).text;

            if(email_usuario.trim() === '') break

            let sugerencias = []
            let total_preguntas = 0
            let respuestas_correctas = 0
            let respuestas_incorrectas = 0
            let respuestas_omitidas = 0
             
            for(let columna of columnas){

                let codigo_pregunta = hoja_excel.getCell(`${columna}1`).text.replace('.','');
                
                if(codigo_pregunta.trim() === '') break

                total_preguntas++
                //Obtiene la alternativa ingresada por el usuario en el formulario.
                let alternativaUsuario = hoja_excel.getCell(`${columna}${i}`).text.replace('false','FALSO');
                
                //Obtiene las sugerencias para la alternativa que eligió el usuario
                const sugerenciasAlternativaPregunta = await SugerenciaAlternativaPregunta.findOne({
                    where: {
                        rut_usuario,
                        nombre_formulario,
                        codigo_pregunta,
                        alternativa: alternativaUsuario,
                    }
                })

                //Obtiene la alternativa correcta registrada para la pregunta.
                let alternativaCorrecta = await SugerenciaAlternativaPregunta.findOne({
                    where: {
                        rut_usuario,
                        nombre_formulario,
                        codigo_pregunta,
                        alternativa_correcta: 1,
                    }
                })

                alternativaCorrecta = alternativaCorrecta.alternativa
   
                //Suma las omitidas, correctas e incorrectas
                if(alternativaUsuario.trim() === ''){
                    respuestas_omitidas++
                }else if(alternativaUsuario === alternativaCorrecta){
                    respuestas_correctas++
                }else{
                    respuestas_incorrectas++
                }
                
                sugerencias.push({
                    alternativaUsuario,
                    alternativaCorrecta,
                    sugerenciasAlternativaPregunta
                })

            }

            //console.log(sugerencias)
            //Genera las sugerencias para el usuario.   
            const { asunto, mensaje } = await generaSugerenciasMensajeEmail(formulario_nombre, formulario_fecha, materia_nombre, sugerencias, email_usuario, total_preguntas, respuestas_correctas, respuestas_incorrectas, respuestas_omitidas)
            
            //Envia el email al usuario.
            await sendMail(email_usuario,asunto, '', mensaje, []) 
        
        }

        fs.unlinkSync(archivo_excel)

        res.send({
            msg: 'Todo OK'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        });
    }

}

exports.getFormularios = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const {
            rut_usuario, 
            codigo_materia, 
            fecha_formulario_desde, 
            fecha_formulario_hasta
        } = req.query

        const formularios = await SugerenciaAlternativaPregunta.findAll({
            attributes: ['nombre_formulario'],
            where:{
                rut_usuario,
                codigo_materia,
                fecha_formulario: {[Op.between]: [fecha_formulario_desde, fecha_formulario_hasta]}
            },
            group: 'nombre_formulario'
        })

        res.json({
            formularios,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error'
        })
    }


}

const generaSugerenciasMensajeEmail = async (formulario_nombre, formulario_fecha, materia_nombre, sugerencias, email_usuario, total_preguntas, respuestas_correctas, respuestas_incorrectas, respuestas_omitidas) => {


    return new Promise( async (resolve, reject) => {

        try {

            let asuntoConfig = await Configuracion.findOne({
                where:{
                    seccion: 'FORM_SUGERENCIAS',
                    clave: 'ASUNTO'
                }
            })
        
            let asunto = asuntoConfig.valor
        
            let mensajeHeadConfig = await Configuracion.findOne({
                where:{
                    seccion: 'FORM_SUGERENCIAS',
                    clave: 'MENSAJE_HEAD'
                }
            })
        
            mensajeHeadConfig = mensajeHeadConfig.valor
            mensajeHeadConfig = mensajeHeadConfig.replace('[mail_alumno]',email_usuario)
            mensajeHeadConfig = mensajeHeadConfig.replace('[nombre_formulario]',formulario_nombre)
            mensajeHeadConfig = mensajeHeadConfig.replace('[fecha_formulario]',formulario_fecha)
            mensajeHeadConfig = mensajeHeadConfig.replace('[nombre_materia]', materia_nombre)
            mensajeHeadConfig = mensajeHeadConfig.replace('[total_preguntas]',total_preguntas)
            mensajeHeadConfig = mensajeHeadConfig.replace('[respuestas_correctas]',respuestas_correctas)
            mensajeHeadConfig = mensajeHeadConfig.replace('[respuestas_incorrectas]',respuestas_incorrectas)
            mensajeHeadConfig = mensajeHeadConfig.replace('[respuestas_omitidas]',respuestas_omitidas)

            let mensajeBodyConfig = await Configuracion.findOne({
                where:{
                    seccion: 'FORM_SUGERENCIAS',
                    clave: 'MENSAJE_BODY'
                }
            })
        
            mensajeBodyConfig = mensajeBodyConfig.valor
            
            let mensaje = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    <title>Sugerencias Formulario</title>
                </head>
                <body>
                    ${mensajeHeadConfig}
                    ${sugerencias.map(sugerencia => {
                        
                        const {alternativaUsuario, alternativaCorrecta, sugerenciasAlternativaPregunta} = sugerencia
                        const { codigo_pregunta, link_1, link_2, link_3, link_4, link_5 } = sugerenciasAlternativaPregunta
                      
                        let mensajeBodySend = mensajeBodyConfig.replace('[numero_pregunta]',codigo_pregunta)
                        mensajeBodySend = mensajeBodySend.replace('[respuesta_alumno]',alternativaUsuario)
                        mensajeBodySend = mensajeBodySend.replace('[respuesta_correcta]',alternativaCorrecta)

                        return `
                            ${mensajeBodySend}
                            <table class="table">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${link_1.trim() !== '' 
                                ? `
                                    <tr>
                                        <th scope="row">
                                            <a href="${link_1}" target="_blank">link 1</a>
                                        <th>
                                    </tr>` 
                                : ''}
                                ${link_2.trim() !== '' 
                                ? `
                                    <tr>
                                        <th scope="row">
                                            <a href="${link_2}" target="_blank">link 2</a>
                                        <th>
                                    </tr>` 
                                : ''}
                                ${link_3.trim() !== '' 
                                ? `
                                    <tr>
                                        <th scope="row">
                                            <a href="${link_3}" target="_blank">link 3</a>
                                        <th>
                                    </tr>` 
                                : ''}
                                ${link_4.trim() !== '' 
                                ? `
                                    <tr>
                                        <th scope="row">
                                            <a href="${link_4}" target="_blank">link 4</a>
                                        <th>
                                    </tr>` 
                                : ''}
                                ${link_5.trim() !== '' 
                                ? `
                                    <tr>
                                        <th scope="row">
                                            <a href="${link_5}" target="_blank">link 5</a>
                                        <th>
                                    </tr>` 
                                : ''}
        
                            </tbody>
                            </table>
                        `
                    })}
                </body>
                </html>`

                resolve({
                    asunto,
                    mensaje
                })
        
        } catch (error) {
            reject(error)    
        }
    })

}
