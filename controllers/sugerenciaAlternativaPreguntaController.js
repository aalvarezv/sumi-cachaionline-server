const { SugerenciaAlternativaPregunta } = require('../database/db');
const fs = require('fs');
const { sendMail } = require('../helpers');
const ExcelJS = require('exceljs');

exports.cargarPreguntas = async (req, res) => {

    /***
     * Todas las preguntas a procesar se encuentran en un directorio que contiene archivos
     * Estos archivos se componen de: 
     * Directorio que contiene imagenes de la sugerencia
     * Directorio que contiene videos de la sugerencia.
     * nombre_carpeta_archivos: Es el nombre de la carpeta que se copiará en el directorio temporal DIR TMP y que contendrá las carpetas con las sugerencias en imagenes y videos de las preguntas a subir.
     * nombre_archivo_carga: Es nombre del archivo excel que se encontrará en la carpeta nombre_carpeta_archivos y que contiene todo el mapa de las preguntas y sus sugerencias en formatos link, imagen y video.
     * nombre_carpeta_archivo_imagen: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos en formato imagen para las sugerencias.
     * nombre_carpeta_archivo_video: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos en formato video para las sugerencias.
     * letra_columna_codigo_pregunta: Columna donde se encuentra el código de la pregunta.
     * letra_columna_alternativa: Columna donde se encuentra la alternativa de la pregunta.
     * letra_columna_alternativa_correcta: Columna donde se encuentra el indicador si la alternativa de la pregunta es correcta.
     * letra_columna_link_1: Columna donde se encuentra la sugerencia Nº 1 en formato link.
     * letra_columna_link_2: Columna donde se encuentra la sugerencia Nº 2 en formato link.
     * letra_columna_link_3: Columna donde se encuentra la sugerencia Nº 3 en formato link.
     * letra_columna_link_4: Columna donde se encuentra la sugerencia Nº 4 en formato link.
     * letra_columna_link_5: Columna donde se encuentra la sugerencia Nº 5 en formato link.
     * letra_columna_imagen_1: Columna donde se encuentra la sugerencia Nº 1 en formato imagen.
     * letra_columna_imagen_2: Columna donde se encuentra la sugerencia Nº 2 en formato imagen.
     * letra_columna_imagen_3: Columna donde se encuentra la sugerencia Nº 3 en formato imagen.
     * letra_columna_imagen_4: Columna donde se encuentra la sugerencia Nº 4 en formato imagen.
     * letra_columna_imagen_5: Columna donde se encuentra la sugerencia Nº 5 en formato imagen.
     * letra_columna_video_1: Columna donde se encuentra la sugerencia Nº 1 en formato video.
     * letra_columna_video_2: Columna donde se encuentra la sugerencia Nº 2 en formato video.
     * letra_columna_video_3: Columna donde se encuentra la sugerencia Nº 3 en formato video.
     * letra_columna_video_4: Columna donde se encuentra la sugerencia Nº 4 en formato video.
     * letra_columna_video_5: Columna donde se encuentra la sugerencia Nº 5 en formato video. 
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     * 
     * 
     * Ejemplo directorio carga:
     * DIR_TEMP
     *    |- nombre_carpeta_archivos
     *         |- nombre_archivo_carga (Excel)
     *         |- nombre_carpeta_archivo_imagen
     *         |- nombre_carpeta_archivo_videos
     */

    

     const {   
        nombre_carpeta_archivos, 
        nombre_archivo_carga,
        nombre_carpeta_archivo_imagen,
        nombre_carpeta_archivo_video,
        letra_columna_codigo_pregunta,
        letra_columna_alternativa,
        letra_columna_alternativa_correcta,
        letra_columna_link_1,
        letra_columna_link_2,
        letra_columna_link_3,
        letra_columna_link_4,
        letra_columna_link_5,
        letra_columna_imagen_1,
        letra_columna_imagen_2,
        letra_columna_imagen_3,
        letra_columna_imagen_4,
        letra_columna_imagen_5,
        letra_columna_video_1,
        letra_columna_video_2,
        letra_columna_video_3,
        letra_columna_video_4,
        letra_columna_video_5,
        fila_inicio,
        fila_fin,

    } = req.body;

    try{
        
        if(!nombre_carpeta_archivos || nombre_carpeta_archivos.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivos no puede ser vacío, verifique.`,
            });
        }

        if(!nombre_archivo_carga || nombre_archivo_carga.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_archivo_carga no puede ser vacío, verifique.`,
            });
        }

        if(!nombre_carpeta_archivo_imagen || nombre_carpeta_archivo_imagen.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivo_imagen no puede ser vacío, verifique.`,
            });
        }

        if(!nombre_carpeta_archivo_video || nombre_carpeta_archivo_video.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivo_video no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_pregunta || letra_columna_codigo_pregunta.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_pregunta no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_alternativa || letra_columna_alternativa.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_alternativa no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_alternativa_correcta || letra_columna_alternativa_correcta.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_alternativa_correcta no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_link_1 || letra_columna_link_1.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_link_1 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_link_2 || letra_columna_link_2.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_link_2 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_link_3 || letra_columna_link_3.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_link_3 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_link_4 || letra_columna_link_4.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_link_4 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_link_5 || letra_columna_link_5.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_link_5 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_imagen_1 || letra_columna_imagen_1.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_imagen_1 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_imagen_2 || letra_columna_imagen_2.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_imagen_2 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_imagen_3 || letra_columna_imagen_3.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_imagen_3 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_imagen_4 || letra_columna_imagen_4.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_imagen_4 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_imagen_5 || letra_columna_imagen_5.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_imagen_5 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_video_1 || letra_columna_video_1.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_video_1 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_video_2 || letra_columna_video_2.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_video_2 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_video_3 || letra_columna_video_3.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_video_3 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_video_4 || letra_columna_video_4.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_video_4 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_video_5 || letra_columna_video_5.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_video_5 no puede ser vacío, verifique.`,
            });
        }

        if(!fila_inicio || isNaN(fila_inicio)){
            return res.status(404).send({
                msg: `Parámetro fila_inicio debe ser un número, verifique.`,
            });
        }
        
        if(!fila_fin || isNaN(fila_fin)){
            return res.status(404).send({
                msg: `Parámetro fila_fin debe ser un número, verifique.`,
            });
        }
        
        //Directorio temporal donde se guardará el archivo de carga.
        const tmp_dir = process.env.DIR_TEMP;

        //Obtiene el directorio donde serán almacenados los archivos multimedia para la sugerencia.
        //Imagen y Video.
        const dir_pregunta = process.env.DIR_SUGERENCIAS;

        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_archivo_carga}`;

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


        //Valida información del archivo.
        let errores = [];
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){

            try {
                
                let codigo_pregunta = hoja_excel.getCell(`${letra_columna_codigo_pregunta}${i}`).text;

                let imagen_1 = hoja_excel.getCell(`${letra_columna_imagen_1}${i}`).text;
                if(imagen_1.trim() !== ''){
                    let archivo_imagen_1 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_1}`;
                    if(!fs.existsSync(archivo_imagen_1)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo imagen 1 ${archivo_imagen_1} no existe`,  
                            }
                        ]
                    }
                }

                let imagen_2 = hoja_excel.getCell(`${letra_columna_imagen_2}${i}`).text;
                if(imagen_2.trim() !== ''){
                    let archivo_imagen_2 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_2}`;
                    if(!fs.existsSync(archivo_imagen_2)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo imagen 2 ${archivo_imagen_2} no existe`,  
                            }
                        ]
                    }
                }

                let imagen_3 = hoja_excel.getCell(`${letra_columna_imagen_3}${i}`).text;
                if(imagen_3.trim() !== ''){
                    let archivo_imagen_3 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_3}`;
                    if(!fs.existsSync(archivo_imagen_3)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo imagen 3 ${archivo_imagen_3} no existe`,  
                            }
                        ]
                    }
                }

                let imagen_4 = hoja_excel.getCell(`${letra_columna_imagen_4}${i}`).text;
                if(imagen_4.trim() !== ''){
                    let archivo_imagen_4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_4}`;
                    if(!fs.existsSync(archivo_imagen_4)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo imagen 4 ${archivo_imagen_4} no existe`,  
                            }
                        ]
                    }
                }

                let imagen_5 = hoja_excel.getCell(`${letra_columna_imagen_5}${i}`).text;
                if(imagen_5.trim() !== ''){
                    let archivo_imagen_5 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_5}`;
                    if(!fs.existsSync(archivo_imagen_5)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo imagen 5 ${archivo_imagen_5} no existe`,  
                            }
                        ]
                    }
                }

                let video_1 = hoja_excel.getCell(`${letra_columna_video_1}${i}`).text;
                if(video_1.trim() !== ''){
                    let archivo_video_1 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_1}`;
                    if(!fs.existsSync(archivo_video_1)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo video 1 ${archivo_video_1} no existe`,  
                            }
                        ]
                    }
                }

                let video_2 = hoja_excel.getCell(`${letra_columna_video_2}${i}`).text;
                if(video_2.trim() !== ''){
                    let archivo_video_2 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_2}`;
                    if(!fs.existsSync(archivo_video_2)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo video 2 ${archivo_video_2} no existe`,  
                            }
                        ]
                    }
                }

                let video_3 = hoja_excel.getCell(`${letra_columna_video_3}${i}`).text;
                if(video_3.trim() !== ''){
                    let archivo_video_3 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_3}`;
                    if(!fs.existsSync(archivo_video_3)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo video 3 ${archivo_video_3} no existe`,  
                            }
                        ]
                    }
                }               

                let video_4 = hoja_excel.getCell(`${letra_columna_video_4}${i}`).text;
                if(video_4.trim() !== ''){
                    let archivo_video_4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_4}`;
                    if(!fs.existsSync(archivo_video_4)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo video 4 ${archivo_video_4} no existe`,  
                            }
                        ]
                    }
                }

                let video_5 = hoja_excel.getCell(`${letra_columna_video_5}${i}`).text;
                if(video_5.trim() !== ''){
                    let archivo_video_5 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_5}`;
                    if(!fs.existsSync(archivo_video_5)){
                        errores = [
                            ...errores,
                            { 
                                fila: i,
                                error: `Archivo video 5 ${archivo_video_5} no existe`,  
                            }
                        ]
                    }
                }
                

            } catch (error) {
                errores = [
                    ...errores,
                    { 
                    fila: i,
                    error: `Error genérico: ${error}`,  
                    }
                ]
            }
        }

        if(errores.length > 0){
            return res.json({
                errores,
            });
        }
        
        const preguntasProcesadas = []
        //Carga los registros en la base de datos.
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){

            let codigo_pregunta = hoja_excel.getCell(`${letra_columna_codigo_pregunta}${i}`).text;

            //Verifica si la pregunta existe.
            const preguntaExiste = await SugerenciaAlternativaPregunta.findOne({
                where: {
                    codigo_pregunta,
                }
            })
            //Si existe la elimina para cargar los nuevos datos.
            if(preguntaExiste && !preguntasProcesadas.includes(codigo_pregunta)){


                await SugerenciaAlternativaPregunta.destroy({
                    where: {
                        codigo_pregunta,
                    }
                });

                //elimina los archivos para cargar los nuevos.
                fs.rmSync(`${dir_pregunta}/${codigo_pregunta}`, {recursive: true});

                preguntasProcesadas.push(codigo_pregunta);

            }


            let alternativa = hoja_excel.getCell(`${letra_columna_alternativa}${i}`).text;
            let alternativa_correcta = hoja_excel.getCell(`${letra_columna_alternativa_correcta}${i}`).text;

            fs.mkdirSync(`${dir_pregunta}/${codigo_pregunta}`, {recursive: true});
            fs.mkdirSync(`${dir_pregunta}/${codigo_pregunta}/imagen`, {recursive: true});
            fs.mkdirSync(`${dir_pregunta}/${codigo_pregunta}/video`, {recursive: true});

            let link_1 = hoja_excel.getCell(`${letra_columna_link_1}${i}`).text;
            let link_2 = hoja_excel.getCell(`${letra_columna_link_2}${i}`).text;
            let link_3 = hoja_excel.getCell(`${letra_columna_link_3}${i}`).text;
            let link_4 = hoja_excel.getCell(`${letra_columna_link_4}${i}`).text;
            let link_5 = hoja_excel.getCell(`${letra_columna_link_5}${i}`).text;
            
            let imagen_1 = hoja_excel.getCell(`${letra_columna_imagen_1}${i}`).text;
            if(imagen_1.trim() !== ''){
                let archivo_imagen_1 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_1}`;
                fs.copyFileSync(archivo_imagen_1, `${dir_pregunta}${codigo_pregunta}/imagen/${imagen_1}`);
            }

            let imagen_2 = hoja_excel.getCell(`${letra_columna_imagen_2}${i}`).text;
            if(imagen_2.trim() !== ''){
                let archivo_imagen_2 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_2}`;
                fs.copyFileSync(archivo_imagen_2, `${dir_pregunta}${codigo_pregunta}/imagen/${imagen_2}`);
            }

            let imagen_3 = hoja_excel.getCell(`${letra_columna_imagen_3}${i}`).text;
            if(imagen_3.trim() !== ''){
                let archivo_imagen_3 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_3}`;
                fs.copyFileSync(archivo_imagen_3, `${dir_pregunta}${codigo_pregunta}/imagen/${imagen_3}`);
            }

            let imagen_4 = hoja_excel.getCell(`${letra_columna_imagen_4}${i}`).text;
            if(imagen_4.trim() !== ''){
                let archivo_imagen_4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_4}`;
                fs.copyFileSync(archivo_imagen_4, `${dir_pregunta}${codigo_pregunta}/imagen/${imagen_4}`);
            }

            let imagen_5 = hoja_excel.getCell(`${letra_columna_imagen_5}${i}`).text;
            if(imagen_5.trim() !== ''){
                let archivo_imagen_5 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_imagen}/${imagen_5}`;
                fs.copyFileSync(archivo_imagen_5, `${dir_pregunta}${codigo_pregunta}/imagen/${imagen_5}`);
            }

            let video_1 = hoja_excel.getCell(`${letra_columna_video_1}${i}`).text;
            if(video_1.trim() !== ''){
                let archivo_video_1 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_1}`;
                fs.copyFileSync(archivo_video_1, `${dir_pregunta}${codigo_pregunta}/video/${video_1}`);
            }

            let video_2 = hoja_excel.getCell(`${letra_columna_video_2}${i}`).text;
            if(video_2.trim() !== ''){
                let archivo_video_2 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_2}`;
                fs.copyFileSync(archivo_video_2, `${dir_pregunta}${codigo_pregunta}/video/${video_2}`);
            }

            let video_3 = hoja_excel.getCell(`${letra_columna_video_3}${i}`).text;
            if(video_3.trim() !== ''){
                let archivo_video_3 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_3}`;
                fs.copyFileSync(archivo_video_3, `${dir_pregunta}${codigo_pregunta}/video/${video_3}`);
            }

            let video_4 = hoja_excel.getCell(`${letra_columna_video_4}${i}`).text;
            if(video_4.trim() !== ''){
                let archivo_video_4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_4}`;
                fs.copyFileSync(archivo_video_4, `${dir_pregunta}${codigo_pregunta}/video/${video_4}`);
            }

            let video_5 = hoja_excel.getCell(`${letra_columna_video_5}${i}`).text;
            if(video_5.trim() !== ''){
                let archivo_video_5 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_video}/${video_5}`;
                fs.copyFileSync(archivo_video_5, `${dir_pregunta}${codigo_pregunta}/video/${video_5}`);
            }
            

            await SugerenciaAlternativaPregunta.create({
                codigo_pregunta,
                alternativa,
                alternativa_correcta,
                link_1,
                link_2,
                link_3,
                link_4,
                link_5,
                imagen_1,
                imagen_2,
                imagen_3,
                imagen_4,
                imagen_5,
                video_1,
                video_2,
                video_3,
                video_4,
                video_5,
            })

        }
    
        res.json({
            msg:"Todo OK",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: error.toString(),
        });
    }


}


exports.enviarSugerencias = async (req, res) => {


    const {
        archivo_nombre,
        archivo_extension,
        archivo_base64,
        
    } = req.body

    try{

        //directorio temporal para bajar el excel.
        const tmp_dir = process.env.DIR_SUGERENCIAS;
        //guarda el archivo base64 en el directorio temporal
        const archivo_excel = `${tmp_dir}/${archivo_nombre}${archivo_extension}`
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

        //Valida que toda la información del archivo recibido existe en el sistema (preguntas-alternativas)
        //Filas
        let columnas = ['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R']
        for(let i = 2; i <= Number(100); i++){

            let email_usuario = hoja_excel.getCell(`B${i}`).text;
            if(email_usuario.trim() === '') break
             
            for(let columna of columnas){

                let codigo_pregunta = hoja_excel.getCell(`${columna}1`).text.replace('.','');
                if(codigo_pregunta.trim() === '') break

                let alternativa = hoja_excel.getCell(`${columna}${i}`).text.replace('false','FALSO');;

                console.log(codigo_pregunta, alternativa)

                const sugerenciasAlternativaPregunta = await SugerenciaAlternativaPregunta.findOne({
                    where: {
                        codigo_pregunta,
                        alternativa,
                    }
                })

                if(!sugerenciasAlternativaPregunta){
                    return res.status(404).send({
                        msg: `Fila ${i} pregunta ${codigo_pregunta} alternativa ${alternativa} no existe en el sistema`
                    })
                }

            }
        
        }

        for(let i = 2; i <= Number(100); i++){

            let email_usuario = hoja_excel.getCell(`B${i}`).text;

            if(email_usuario.trim() === '') break

            let sugerencias = []
             
            for(let columna of columnas){

                let codigo_pregunta = hoja_excel.getCell(`${columna}1`).text.replace('.','');
                if(codigo_pregunta.trim() === '') break

                let alternativa = hoja_excel.getCell(`${columna}${i}`).text.replace('false','FALSO');
            
                const sugerenciasAlternativaPregunta = await SugerenciaAlternativaPregunta.findOne({
                    where: {
                        codigo_pregunta,
                        alternativa,
                    }
                })
   
                //Si la alternativa que eligió no es la correcta, agrega al array de sugerencias.
                if(!sugerenciasAlternativaPregunta.alternativa_correcta){
                    sugerencias.push(sugerenciasAlternativaPregunta)
                }

            }

            const asunto = 'Sugerencias Formulario'
            const mensaje = generaSugerenciasMensajeEmail(sugerencias)
            
            //Envia el email al usuario.
            await sendMail(email_usuario,asunto, '', mensaje, []) 
        
        }

        res.send({
            msg: 'Todo OK'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: error.toString(),
        });
    }

}


const generaSugerenciasMensajeEmail = sugerencias => {

    const mensaje = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            ${sugerencias.map(sugerencia => {

                const { codigo_pregunta, 
                        link_1, link_2, link_3, link_4, link_5,
                        imagen_1, imagen_2, imagen_3, imagen_4, imagen_5,
                        video_1, video_2, video_3, video_4, video_5,
                    } = sugerencia

                return `
                
                    ${codigo_pregunta && `<h2>Pregunta ${codigo_pregunta}</h2><br/>`}
                    ${link_1.trim() !== '' ? `<h4><a href="${link_1}" target="_blank">${link_1}</a></h4><br/>` : ''}
                    ${link_2.trim() !== '' ? `<h4><a href="${link_2}" target="_blank">${link_2}</a></h4><br/>` : ''}
                    ${link_3.trim() !== '' ? `<h4><a href="${link_3}" target="_blank">${link_3}</a></h4><br/>` : ''}
                    ${link_4.trim() !== '' ? `<h4><a href="${link_4}" target="_blank">${link_4}</a></h4><br/>` : ''}
                    ${link_5.trim() !== '' ? `<h4><a href="${link_5}" target="_blank">${link_5}</a></h4><br/>` : ''}
                    ${imagen_1.trim() !== '' ? `<h4>${imagen_1}</h4><br/>` : ''}
                    ${imagen_2.trim() !== '' ? `<h4>${imagen_2}</h4><br/>` : ''}
                    ${imagen_3.trim() !== '' ? `<h4>${imagen_3}</h4><br/>` : ''}
                    ${imagen_4.trim() !== '' ? `<h4>${imagen_4}</h4><br/>` : ''}
                    ${imagen_5.trim() !== '' ? `<h4>${imagen_5}</h4><br/>` : ''}
                    ${video_1.trim() !== '' ? `<h4>${video_1}</h4><br/>` : ''}
                    ${video_2.trim() !== '' ? `<h4>${video_2}</h4><br/>` : ''}
                    ${video_3.trim() !== '' ? `<h4>${video_3}</h4><br/>` : ''}
                    ${video_4.trim() !== '' ? `<h4>${video_4}</h4><br/>` : ''}
                    ${video_5.trim() !== '' ? `<h4>${video_5}</h4><br/>` : ''}
                `
            })}
        </body>
        </html>`
    
    return mensaje


}
