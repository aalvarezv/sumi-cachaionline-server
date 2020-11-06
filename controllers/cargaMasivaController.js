const { Configuracion, Unidad, Materia, 
        Modulo, ModuloContenido, ModuloContenidoTema, 
        ModuloContenidoTemaConcepto, Pregunta, PreguntaAlternativa,
        sequelize} = require('../config/db');
const { letras } = require('../helpers');
const { exec } = require("child_process");
const uuidv4 = require('uuid').v4;
const { PDFDocument } = require('pdf-lib');
const libreoffice = require('libreoffice-convert');
var mv = require('mv');
const fs = require('fs');
const findRemoveSync = require('find-remove');
const ExcelJS = require('exceljs');


exports.cargaMateriasUnidadesModulos = async (req, res) => {

    /***
     * nombre_archivo_carga: Es nombre del archivo excel que se encontrará en la carpeta DIR_TEMP y que contiene todo el mapa para cargar las unidades|modulos|contenidos|temas|conceptos
     * borrar_y_cargar: Indica si se borra todas las tablas y se vuelve a cargar desde '0'.
     * letra_columna_codigo: Columna donde se encuentra el código del dato a insertar. Ejemplo: A
     * letra_columna_descripcion: Columna donde se encuentra la descripción del dato a insertar.
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     * codigo_materia: Codigo materia existente en el sistema al cual pertenecen los datos cargados.
     * Ejemplo directorio carga:
     * DIR_TEMP
     *    |- archivo_carga
     */

    const { nombre_archivo_carga, borrar_y_cargar, letra_columna_codigo, 
        letra_columna_descripcion, fila_inicio, fila_fin, codigo_materia} = req.body;

    try{

        if(!nombre_archivo_carga || nombre_archivo_carga.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_carga no puede ser vacío, verifique.`,
            });
        }

        if(!codigo_materia || codigo_materia.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro codigo_materia no puede ser vacío, verifique.`,
            });
        }

        if(!borrar_y_cargar ){
            return res.status(404).send({
                msg: `Parámetro borrar_y_cargar es obligatorio y debe ser true o false, verifique.`,
            });
        }

        if(!letra_columna_codigo || letra_columna_codigo.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_descripcion || letra_columna_descripcion.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_descripcion no puede ser vacío, verifique.`,
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
        
        
        //Verifica que existe la materia.
        let materia = await Materia.findByPk(codigo_materia);
        if (!materia) {
            return res.status(400).json({
                msg: 'El código materia no es válido, verifique'
            });
        }

        const tmp_dir = await Configuracion.findOne({
            attributes: ['valor'],
            where: {
                seccion: 'TEMP',
                clave: 'DIR'
            }
        });

        if(!tmp_dir){
            return res.status(404).send({
                msg: `No existe sección TEMP clave DIR en la configuración, verifique.`,
            });
        }

        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir.dataValues.valor}${nombre_archivo_carga}`;
    
        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_carga);
        
        //Se ubica en la hoja TEMARIO
        hoja_excel  = libro_excel.getWorksheet('TEMARIO');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja TEMARIO en el archivo de carga recibido, verifique.`,
            });
        }

        //Limpia Todo en caso que así se haya recibido el parámetro.
        if(borrar_y_cargar){
            //Evita que se consideren los constraint antes de eliminar los registros.
            await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
            await ModuloContenidoTemaConcepto.destroy({ truncate: true });
            await ModuloContenidoTema.destroy({ truncate: true });
            await ModuloContenido.destroy({ truncate: true });
            await Modulo.destroy({ truncate: true });
            await Unidad.destroy({ truncate: true });
            await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    
        }

        let codigo_unidad = '';
        let codigo_modulo = '';
        let codigo_modulo_contenido = '';
        let codigo_modulo_contenido_tema = '';
        let codigo_modulo_contenido_tema_concepto = '';

        let descripcion_unidad = '';
        let descripcion_modulo = '';
        let descripcion_modulo_contenido = '';
        let descripcion_modulo_contenido_tema = '';
        let descripcion_modulo_contenido_tema_concepto = '';
        
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){

            let codigo_actual = hoja_excel.getCell(`${letra_columna_codigo}${i}`).text.trim();
            //Separa el código actual en un arreglo para leer cada posición y verificar
            //si corresponde a una unidad, módulo, propiedad o sub-propiedad.
            let arr_codigo_actual  = codigo_actual.split('.');
            let descripcion_actual = hoja_excel.getCell(`${letra_columna_descripcion}${i}`).text.trim();

            if(codigo_actual.trim() !== '' && descripcion_actual.trim() !== ''){

                //Verifica a que corresponde el código posicionado actual.
                //Los códigos se componen de 5 dígitos, 
                //Si el primer dígito es distinto de '0' y el segundo dígito es igual a '0' entonces estamos parados en una unidad.
               
                if(arr_codigo_actual[0] !== '0' && arr_codigo_actual[1] === '0'){

                    codigo_unidad = codigo_actual;
                    descripcion_unidad = descripcion_actual;

                    //Verifica que la unidad no existe antes de crearla.
                    let unidad = await Unidad.findByPk(codigo_unidad);
                    if (!unidad) {
                        unidad = await Unidad.create({
                            codigo: codigo_unidad,
                            descripcion: descripcion_unidad,
                            codigo_materia,
                        });
                    }

                    codigo_modulo = '';
                    codigo_modulo_contenido = '';
                    codigo_modulo_contenido_tema = '';
                    codigo_modulo_contenido_tema_concepto

                    descripcion_modulo = '';
                    descripcion_modulo_contenido = '';
                    descripcion_modulo_contenido_tema = '';
                    descripcion_modulo_contenido_tema_concepto = '';
                
                //Si el segundo dígito es distinto de '0' y el tercer dígito es igual a '0'
                //entonces estamos parados en un módulo.
                }else if(arr_codigo_actual[1] !== '0' && arr_codigo_actual[2] === '0'){

                    codigo_modulo = codigo_actual;
                    descripcion_modulo = descripcion_actual;

                    //Verifica que el módulo no existe antes de crearlo.
                    let modulo = await Modulo.findByPk(codigo_modulo);
                    if (!modulo) {

                        if(codigo_unidad.trim() === ''){
                            return res.status(400).send({
                                msg: `No se ha capturado una unidad asociada al módulo ${codigo_modulo} ${descripcion_modulo}`,
                            });
                        }

                        await Modulo.create({
                            codigo: codigo_modulo,
                            descripcion: descripcion_modulo,
                            codigo_unidad,
                        });
                    }

                    codigo_modulo_contenido = '';
                    codigo_modulo_contenido_tema = '';
                    codigo_modulo_contenido_tema_concepto = '';

                    descripcion_modulo_contenido = '';
                    descripcion_modulo_contenido_tema = '';
                    descripcion_modulo_contenido_tema_concepto = '';

                //si el tercer dígito es distinto de cero y el cuarto dígito es igual a '0'
                //entonces estamos parados en el contenido de un módulo
                }else if (arr_codigo_actual[2] !== '0' && arr_codigo_actual[3] === '0'){

                    codigo_modulo_contenido = codigo_actual;
                    descripcion_modulo_contenido = descripcion_actual;

                    //Verifica que el contenido del módulo no existe antes de crearlo.
                    let modulo_contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
                    if (!modulo_contenido) {

                        if(codigo_modulo.trim() === ''){
                            return res.status(400).send({
                                msg: `No se ha capturado un módulo asociada al contenido ${codigo_modulo_contenido} ${descripcion_modulo_contenido}`,
                            });
                        }

                        await ModuloContenido.create({
                            codigo: codigo_modulo_contenido,
                            descripcion: descripcion_modulo_contenido,
                            codigo_modulo, 
                        });
                    }
                    
                    codigo_modulo_contenido_tema = '';
                    codigo_modulo_contenido_tema_concepto = '';

                    descripcion_modulo_contenido_tema = '';
                    descripcion_modulo_contenido_tema_concepto = '';
                
                //si el cuarto dígito es distinto de '0' y el quinto dígito es igual a '0'
                //entonces estamos parados en un tema del contenido de un módulo.
                }else if(arr_codigo_actual[3] !== '0' && arr_codigo_actual[4] === '0'){

                    codigo_modulo_contenido_tema = codigo_actual;
                    descripcion_modulo_contenido_tema = descripcion_actual;

                    //Verifica que el tema del contenido no existe antes de crearlo.
                    let modulo_contenido_tema = await ModuloContenidoTema.findByPk(codigo_modulo_contenido_tema);
                    if (!modulo_contenido_tema) {

                        if(codigo_modulo_contenido.trim() === ''){
                            return res.status(400).send({
                                msg: `No se ha capturado una contenido asociada al tema ${codigo_modulo_contenido_tema} ${descripcion_modulo_contenido_tema}`,
                            });
                        }

                        await ModuloContenidoTema.create({
                            codigo: codigo_modulo_contenido_tema,
                            descripcion: descripcion_modulo_contenido_tema,
                            codigo_modulo_contenido, 
                        });
                    }

                    codigo_modulo_contenido_tema_concepto = '';

                    descripcion_modulo_contenido_tema_concepto = '';
                
                //Si el quinto dígito es distinto de '0' entonces estamos parados sobre un concepto.
                }else if(arr_codigo_actual[4] !== '0'){

                    codigo_modulo_contenido_tema_concepto = codigo_actual;
                    descripcion_modulo_contenido_tema_concepto = descripcion_actual;

                    //Verificamos que el concepto del tema no existe antes de crearlo
                    let modulo_contenido_tema_concepto = await ModuloContenidoTema.findByPk(codigo_modulo_contenido_tema_concepto);

                    if (!modulo_contenido_tema_concepto) {

                        if(codigo_modulo_contenido_tema.trim() === ''){
                            return res.status(400).send({
                                msg: `No se ha capturado un tema asociado al concepto ${codigo_modulo_contenido_tema_concepto} ${descripcion_modulo_contenido_tema_concepto}`,
                            });
                        }

                        await ModuloContenidoTemaConcepto.create({
                            codigo: codigo_modulo_contenido_tema_concepto,
                            descripcion: descripcion_modulo_contenido_tema_concepto,
                            codigo_modulo_contenido_tema, 
                        });

                    }

                }
                
            }
            //console.log(codigo_unidad, descripcion_unidad, codigo_modulo, descripcion_modulo, codigo_modulo_contenido, descripcion_modulo_contenido, codigo_modulo_contenido_tema, descripcion_modulo_contenido_tema, codigo_modulo_contenido_tema_concepto, descripcion_modulo_contenido_tema_concepto);
           
        }

        res.json({
            msg:"Todo OK",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: error
        });
    }

}

exports.cargaPreguntas = async (req, res) => {

    /***
     * nombre_carpeta_archivos: Es el nombre de la carpeta que se copiará en el directorio temporal DIR TMP y que contendrá las carpetas con los power point, pistas y videos de las preguntas a subir.
     * nombre_archivo_carga: Es nombre del archivo excel que se encontrará en la carpeta nombre_carpeta_archivos y que contiene todo el mapa de las preguntas y sus propiedades a cargar.
     * nombre_carpeta_archivo_pregunta: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos power point que contienen la pregunta y solución y se deben transformar a imagen.
     * nombre_carpeta_archivo_videos: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos de video (soluciones) en caso que la pregunta los tenga.
     * nombre_carpeta_archivo_pistas: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos power point (pistas) en caso que la pregunta las tenga.
     * letra_columna_nombre_archivo_pregunta: Columna donde se encuentra el nombre del archivo de la pregunta.
     * letra_columna_codigo(_1,_2,_3,_4,_5,_6): Columna donde se encuentra el codigo de modulo|contenido|tema|concepto asociado a la pregunta.
     * letra_columna_alternativa_correcta: Columna donde se encuentra la letra de la alternativa correcta de la pregunta.
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     * 
     * Ejemplo directorio carga:
     * DIR_TEMP
     *    |- nombre_carpeta_archivos
     *         |- nombre_archivo_carga (Excel)
     *         |- nombre_carpeta_archivo_pregunta
     *         |- nombre_carpeta_archivo_videos
     *         |- nombre_carpeta_archivo_pistas 
     */

    const {   

            nombre_carpeta_archivos, nombre_archivo_carga, nombre_carpeta_archivo_pregunta,
            nombre_carpeta_archivo_videos, nombre_carpeta_archivo_pistas,
            letra_columna_nombre_archivo_pregunta,
            letra_columna_codigo_1, letra_columna_codigo_2,
            letra_columna_codigo_3, letra_columna_codigo_4,
            letra_columna_codigo_5, letra_columna_codigo_6,
            letra_columna_alternativa_correcta,
            fila_inicio, fila_fin,

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

        if(!nombre_carpeta_archivo_pregunta || nombre_carpeta_archivo_pregunta.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivo_pregunta no puede ser vacío, verifique.`,
            });
        }

        if(!nombre_carpeta_archivo_videos || nombre_carpeta_archivo_videos.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivo_videos no puede ser vacío, verifique.`,
            });
        }

        if(!nombre_carpeta_archivo_pistas || nombre_carpeta_archivo_pistas.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro nombre_carpeta_archivo_pistas no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_nombre_archivo_pregunta || letra_columna_nombre_archivo_pregunta.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_nombre_archivo_pregunta no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_1 || letra_columna_codigo_1.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_1 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_2 || letra_columna_codigo_2.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_2 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_3 || letra_columna_codigo_3.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_3 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_4 || letra_columna_codigo_4.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_4 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_5 || letra_columna_codigo_5.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_5 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_codigo_6 || letra_columna_codigo_6.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_codigo_6 no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_alternativa_correcta || letra_columna_alternativa_correcta.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_alternativa_correcta no puede ser vacío, verifique.`,
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
        let tmp_dir = await Configuracion.findOne({
            attributes: ['valor'],
            where: {
                seccion: 'TEMP',
                clave: 'DIR'
            }
        });

        if(!tmp_dir){
            return res.status(404).send({
                msg: `No existe sección TEMP clave DIR en la configuración, verifique.`,
            });
        }
        //Extrae el valor.
        tmp_dir = tmp_dir.dataValues.valor;

        //Obtiene el directorio donde serán almacenados los archivos multimedia para la pregunta.
        //Imagen Pregunta, Imagen, Video y Audio para Solucion y Pistas.
        let dir_pregunta = await Configuracion.findOne({
            where:{
                seccion: 'PREGUNTAS',
                clave: 'DIR'
            }
        });
        
        if (!dir_pregunta) {
            return res.status(404).send({
                msg: `No existe sección PREGUNTAS clave DIR en la configuración, verifique.`
            })
        }

        dir_pregunta = dir_pregunta.dataValues.valor;

        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_archivo_carga}`;
    
        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_carga);
        
        //Se ubica en la hoja TEMARIO
        hoja_excel  = libro_excel.getWorksheet('VIDEO');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja VIDEO en el archivo de carga recibido, verifique.`,
            });
        }

        let nombre_archivo_pregunta = '';
        let alternativa_correcta = '';

        let archivo_pregunta_ppt = '';
        //Se usa para generar el archivo de salida cuando el PPT se convierte PDF
        let archivo_pregunta_pdf = '';
        //Se usa para generar los archivos de salida cuando el PDF se convierte a Imagen
        let archivo_pregunta_imagen = '';

        //Para cargar tabla.
        let codigo_pregunta = '';

        //Temario definido en archivo excel.
        

        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){
            
            nombre_archivo_pregunta = hoja_excel.getCell(`${letra_columna_nombre_archivo_pregunta}${i}`).text.trim();
            alternativa_correcta = hoja_excel.getCell(`${letra_columna_alternativa_correcta}${i}`).text.trim();

            archivo_pregunta_ppt = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}.pptx`;
            archivo_pregunta_pdf = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}.pdf`;
            archivo_pregunta_imagen = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}_%d.jpg`;
            
            let resp = await PowerPointToPDF(archivo_pregunta_ppt, archivo_pregunta_pdf);
            console.log(resp.msg);

            resp = await PDFToImage(archivo_pregunta_pdf, archivo_pregunta_imagen);
            console.log(resp.msg);

            const pdf_doc = await PDFDocument.load(fs.readFileSync(archivo_pregunta_pdf));
            const pdf_doc_pages = pdf_doc.getPageCount();
            console.log(`PDF ${archivo_pregunta_pdf} Total Páginas: ${pdf_doc_pages}`);
            
            codigo_pregunta = uuidv4();

            //Crea el directorio (codigo pregunta) para almacenar los archivos de la pregunta.
            //await fs.promises.mkdir(`${dir_pregunta}/${codigo_pregunta}`, {recursive: true});
           
            //Obtiene la imagen de la pregunta que se obtuvo del PDF a IMAGEN y que corresponde a la segunda página del PDF, parten de 0 una vez que .
            let imagen_pregunta = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}_1.jpg`;

            //Mueve la imagen de la pregunta al directorio creado con el nombre del codigo pregunta uuid
            await moverArchivo(imagen_pregunta, `${dir_pregunta}${codigo_pregunta}/img-pregunta.jpg`);
      
            //Graba la pregunta en la base de datos.
            await Pregunta.create({
                codigo: codigo_pregunta,
                rut_usuario_creador: 'SYSTEM',
                texto: '',
                imagen: 'img-pregunta.jpg',
                audio: '',
                video: '',
            });

            //Crea las 5 alternativas a indica cual es la correcta de acuerdo a lo que diga el archivo excel.
            const alternativas = [...letras].splice(0, 5).map( (letra, index) => {

                let correcta = false;
                if(letra === alternativa_correcta) {
                    correcta = true;
                }

                return {
                    codigo: uuidv4(),
                    letra,
                    correcta,
                    numero: index + 1,
                    codigo_pregunta,
                }
            });

            //*********ALTERNATIVAS.
            //Graba las alternativas de la pregunta.
            await PreguntaAlternativa.bulkCreate(alternativas);
           
            //Codigos de las propiedaes asociadas a la pregunta que pueden ser: Modulo|Contenido|Tema|Concepto.
            let codigos_propiedades_pregunta = [
                hoja_excel.getCell(`${letra_columna_codigo_1}${i}`).text.trim(),
                hoja_excel.getCell(`${letra_columna_codigo_2}${i}`).text.trim(),
                hoja_excel.getCell(`${letra_columna_codigo_3}${i}`).text.trim(),
                hoja_excel.getCell(`${letra_columna_codigo_4}${i}`).text.trim(),
                hoja_excel.getCell(`${letra_columna_codigo_5}${i}`).text.trim(),
                hoja_excel.getCell(`${letra_columna_codigo_6}${i}`).text.trim(),
            ];

            for(let codigo_actual of codigos_propiedades_pregunta){
                //Identifica que tipo de dato corresponde el codigo. Modulo|Contenido|Tema|Concepto.
                let arr_codigo_actual = codigo_actual.split('.');
                
                if(codigo_actual.trim() !== ''){

                    //Verifica a que corresponde el código posicionado actual.
                    //Los códigos se componen de 5 dígitos, 
                    
                    //Si el segundo dígito es distinto de '0' y el tercer dígito es igual a '0'
                    //entonces estamos parados en un Modulo.
                    if(arr_codigo_actual[1] !== '0' && arr_codigo_actual[2] === '0'){

                    //si el tercer dígito es distinto de cero y el cuarto dígito es igual a '0'
                    //entonces estamos parados en el contenido de un módulo
                    }else if (arr_codigo_actual[2] !== '0' && arr_codigo_actual[3] === '0'){

                    //si el cuarto dígito es distinto de '0' y el quinto dígito es igual a '0'
                    //entonces estamos parados en un tema del contenido de un módulo.
                    }else if(arr_codigo_actual[3] !== '0' && arr_codigo_actual[4] === '0'){

                    //Si el quinto dígito es distinto de '0' entonces estamos parados sobre un concepto.
                    }else if(arr_codigo_actual[4] !== '0'){

                    }
                    
                }

            }

            const result = findRemoveSync(`${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/`, {extensions: ['.pdf', '.jpg']})

            //Listado de archivos elimandos.
            console.log(result);

        }
    
        res.json({
            msg:"Todo OK",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: error,
        });
    }

}

const PowerPointToPDF = async (archivo_ppt, archivo_pdf) => {

    return new Promise((resolve, reject) => {

        //verificar que el archivo PPT existe.
        if(!fs.existsSync(archivo_ppt)){
            reject({
                error: 100,
                msg: `Archivo ${archivo_ppt} no existe.`,
            });
        }

        //Lee el archivo
        const file = fs.readFileSync(archivo_ppt);
        // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
        libreoffice.convert(file, '.pdf', undefined, (err, done) => {
            if (err) {
                reject({
                    error: 100,
                    msg: `Error al convertir el archivo PPT a PDF: ${err}`,
                })
            }
            // Done contiene el stream del archivo PDF de salida y archivo_pdf sería la ruta donde se guardará.
            fs.writeFileSync(archivo_pdf, done);
            resolve({
                error: 0,
                msg: `PPT a PDF correcto ${archivo_pdf}`,
            })
        });

    });

}

const PDFToImage = (archivo_pdf, archivo_imagen) => {

    return new Promise((resolve, reject) => {

        //verificar que el archivo PDF existe.
        if(!fs.existsSync(archivo_pdf)){
            reject({
                error: 100,
                msg: `Archivo ${archivo_pdf} no existe.`,
            });
        }
        //Comando para convertir PDF a IMAGEN.
        let comando = `convert -density 100 "${archivo_pdf}" -resize 2000x2500 "${archivo_imagen}"`;
        console.log(comando);
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                reject({
                    error: 100,
                    msg: error.message,
                });
            }
            if (stderr) {
                reject({
                    error: 100,
                    msg: `PDF a IMAGEN correcto ${stderr}`,
                });
            }
            resolve({
                error: 0,
                msg: stdout
            });
        });

    });

}

const moverArchivo = (archivo_origen, archivo_destino) => {
    return new Promise((resolve, reject) => {

        //verificar que el archivo PDF existe.
        if(!fs.existsSync(archivo_origen)){
            reject({
                error: 100,
                msg: `Archivo ${archivo_origen} no existe.`,
            });
        }

        mv(archivo_origen, archivo_destino, {mkdirp: true}, function(err) {
            if(err){
                reject({
                    error: 100,
                    msg: err,
                });
            }else{
                resolve({
                    error: 0,
                    msg: `Archivo ${archivo_origen} enviado correctamente a ${archivo_destino}`,
                });
            }
        });
       
    });
   
}