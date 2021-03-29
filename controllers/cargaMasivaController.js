const { Configuracion, Unidad, Materia, 
        Modulo, ModuloContenido, ModuloContenidoTema, 
        ModuloContenidoTemaConcepto, Pregunta, PreguntaAlternativa,
        PreguntaSolucion, PreguntaPista,
        sequelize} = require('../database/db');
const { letras } = require('../helpers');
const uuidv4 = require('uuid').v4;
const { PDFDocument } = require('pdf-lib');
const findRemoveSync = require('find-remove');
const fs = require('fs');
const ExcelJS = require('exceljs');

const { creaPreguntaModulo, 
        creaPreguntaModuloContenido, 
        creaPreguntaModuloContenidoTema, 
        creaPreguntaModuloContenidoTemaConcepto,
        powerPointToPDF,
        pdfToImage,
        moverArchivo, } = require('../helpers');

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

        const tmp_dir = process.env.DIR_TEMP;

        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_archivo_carga}`;
    
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
     * Todas las preguntas a procesar se encuentran en un directorio que contiene archivos power point.
     * Estos archivos se componen de: 
     * Primer slice: Tiene logo de cachaiOnline.
     * Segundo slice: Tiene la pregunta.
     * Tercer slice a N slice: Tiene la solución de la pregunta.
     * También existe un directorio que contiene video de la pregunta y su solución y otro directorio que contiene power point con pistas de la pregunta. Tanto los videos como pistas no son obligatorios por lo tanto algunas preguntas tendrán o no videos y pistas.
     * nombre_carpeta_archivos: Es el nombre de la carpeta que se copiará en el directorio temporal DIR TMP y que contendrá las carpetas con los power point, pistas y videos de las preguntas a subir.
     * nombre_archivo_carga: Es nombre del archivo excel que se encontrará en la carpeta nombre_carpeta_archivos y que contiene todo el mapa de las preguntas y sus propiedades a cargar.
     * nombre_carpeta_archivo_pregunta: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos power point que contienen la pregunta y solución y se deben transformar a imagen.
     * nombre_carpeta_archivo_videos: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos de video (soluciones) en caso que la pregunta los tenga.
     * nombre_carpeta_archivo_pistas: Es el nombre de la carpeta que se encontrará en la nombre_carpeta_archivos y que contendrá los archivos power point (pistas) en caso que la pregunta las tenga.
     * letra_columna_nombre_archivo_pregunta: Columna donde se encuentra el nombre del archivo de la pregunta.
     * letra_columna_codigo(_1,_2,_3,_4,_5,_6): Columna donde se encuentra el codigo de modulo|contenido|tema|concepto asociado a la pregunta.
     * letra_columna_alternativa_correcta: Columna donde se encuentra la letra de la alternativa correcta de la pregunta.
     * letra_columna_cantidad_alternativas: Columna donde se encuentra la cantidad de alternativas de la pregunta.
     * letra_columna_duracion_pregunta: Columna donde se encuentra los segundos que duran una pregunta.
     * letra_columna_tipos_archivos_solucion: Columna que indica los tipos de archivo de solución que tiene la pregunta ejemplo: 0: No tiene archivos, 1: Imagen, 2: Video y 3: Imagen y Video. 
     * letra_columna_pregunta_numero_pistas: Columna donde se indica la cantidad de pistas que tiene una pregunta.
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     * letra_columna_recordar: Columna donde se indica el nivel de capacidad para recordar que necesita el/la alumno/a para poder resolver la pregunta.
     * letra_columna_comprender: Columna donde se indica el nivel de capacidad para comprender que necesita el/la alumno/a para poder resolver la pregunta.
     * letra_columna_aplicar: Columna donde se indica el nivel de capacidad para aplicar que necesita el/la almuno/a para poder resolver la pregunta.
     * letra_columna_anilzar: Columna donde se indica el nivel de capacidad para analizar que necesita el/la alumno/a para poder resolver la pregunta.
     * letra_columna_evaluar: Columna donde se indica el nivel de capacidad para evaluar que necesita el/la almuno/a para poder resolver la pregunta.
     * letra_columna_crear: Columna donde se indica el nivel de capacidad para crear que necesita el/la almuno/a para poder resolver la pregunta. 
     * 
     * 
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
            letra_columna_cantidad_alternativas,
            letra_columna_duracion_pregunta,
            letra_columna_tipos_archivos_solucion,
            letra_columna_pregunta_numero_pistas,
            fila_inicio, fila_fin,
            letra_columna_recordar, letra_columna_comprender,
            letra_columna_aplicar, letra_columna_analizar,
            letra_columna_evaluar, letra_columna_crear

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

        if(!letra_columna_cantidad_alternativas || letra_columna_cantidad_alternativas.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_cantidad_alternativas no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_duracion_pregunta || letra_columna_duracion_pregunta.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_duracion_pregunta no puede ser vacío, verifique.`,
            });
        }


        if(!letra_columna_tipos_archivos_solucion || letra_columna_tipos_archivos_solucion.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_tipos_archivos_solucion no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_pregunta_numero_pistas || letra_columna_pregunta_numero_pistas.trim() === '' ){
            return res.status(404).send({
                msg: `Parámetro letra_columna_pregunta_numero_pistas no puede ser vacío, verifique.`,
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

        if(!letra_columna_recordar || letra_columna_recordar.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_recordar no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_comprender || letra_columna_comprender.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_comprender no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_aplicar || letra_columna_aplicar.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_aplicar no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_analizar || letra_columna_analizar.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_analizar no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_evaluar || letra_columna_evaluar.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_evaluar no puede ser vacío, verifique.`,
            });
        }

        if(!letra_columna_crear || letra_columna_crear.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro letra_columna_crear no puede ser vacío, verifique.`,
            });
        }

        //Directorio temporal donde se guardará el archivo de carga.
        const tmp_dir = process.env.DIR_TEMP;

        //Obtiene el directorio donde serán almacenados los archivos multimedia para la pregunta.
        //Imagen Pregunta, Imagen, Video y Audio para Solucion y Pistas.
        const dir_pregunta = process.env.DIR_PREGUNTAS;

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
                 
                let nombre_archivo_pregunta = hoja_excel.getCell(`${letra_columna_nombre_archivo_pregunta}${i}`).text;
                let archivo_pregunta_ppt = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}.pptx`;

                //Verifica que existe el archivo de pregunta.
                if(!fs.existsSync(archivo_pregunta_ppt)){
                    errores = [
                        ...errores,
                        { 
                            fila: i,
                            error: `Archivo pregunta ${archivo_pregunta_ppt} no existe`,  
                        }
                    ]
                }

                let alternativas = ['A','B','C','D','E'];
                let alternativa_correcta = hoja_excel.getCell(`${letra_columna_alternativa_correcta}${i}`).text.trim();
                if(alternativas.filter(alternativa => alternativa === alternativa_correcta.trim()).length === 0){
                    errores = [
                        ...errores,
                        { 
                        fila: i,
                        error: `Alternativa pregunta ${alternativa_correcta} no se encuentra dentro de las posibilidades, Letras A, B, C, D y E`,  
                        }
                    ]
                }

                let duracion_pregunta = hoja_excel.getCell(`${letra_columna_duracion_pregunta}${i}`).text.trim();
                if(Number(duracion_pregunta) <= 0){
                    errores = [
                        ...errores,
                        { 
                        fila: i,
                        error: `Duración pregunta ${duracion_pregunta} no es un número válido`,  
                        }
                    ]
                }

                let cantidad_alternativas = hoja_excel.getCell(`${letra_columna_cantidad_alternativas}${i}`).text.trim();
                if(Number(cantidad_alternativas) <= 0){
                    errores = [
                        ...errores,
                        { 
                        fila: i,
                        error: `Cantidad alternativas pregunta ${cantidad_alternativas} no es un número válido`,  
                        }
                    ]
                }

                //Validación de codigos de las propiedaes asociadas a la pregunta que pueden ser: Modulo|Contenido|Tema|Concepto.
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
                            //Verifica que el módulo existe.
                            const modulo = await Modulo.findByPk(codigo_actual);
                            if (!modulo){
                                errores = [
                                    ...errores,
                                    { 
                                    fila: i,
                                    error: `Código módulo ${codigo_actual} no existe`,  
                                    }
                                ]
                            }
                        //si el tercer dígito es distinto de cero y el cuarto dígito es igual a '0'
                        //entonces estamos parados en el contenido de un módulo
                        }else if (arr_codigo_actual[2] !== '0' && arr_codigo_actual[3] === '0'){

                            const modulo_contenido = await ModuloContenido.findByPk(codigo_actual);
                            //Verifica que el modulo contenido existe.
                            if(!modulo_contenido){        
                                errores = [
                                    ...errores,
                                    { 
                                    fila: i,
                                    error: `Código módulo contenido ${codigo_actual} no existe.`,  
                                    }
                                ]
                            }
                        
                        //si el cuarto dígito es distinto de '0' y el quinto dígito es igual a '0'
                        //entonces estamos parados en un tema del contenido de un módulo.
                        }else if(arr_codigo_actual[3] !== '0' && arr_codigo_actual[4] === '0'){
                        
                            const modulo_contenido_tema = await ModuloContenidoTema.findByPk(codigo_actual);
                            //Verifica que el módulo contenido tema existe.
                            if(!modulo_contenido_tema){
                                errores = [
                                    ...errores,
                                    { 
                                    fila: i,
                                    error: `Código módulo contenido tema ${codigo_actual} no existe.`,  
                                    }
                                ]
                            }
                        //Si el quinto dígito es distinto de '0' entonces estamos parados sobre un concepto.
                        }else if(arr_codigo_actual[4] !== '0'){
    
                            const modulo_contenido_tema_concepto = await ModuloContenidoTemaConcepto.findByPk(codigo_actual)
                            //Verifica que el modulo contenido tema concepto existe.
                            if(!modulo_contenido_tema_concepto){
                                errores = [
                                    ...errores,
                                    { 
                                    fila: i,
                                    error: `Código módulo contenido tema concepto ${codigo_actual} no existe.`,  
                                    }
                                ]
                            }
                            
                        }
                        
                    }
    
                }

                //VALIDAR SOLUCIONES La pregunta también puede contener archivos adicionales de solución. Como videos o imagenes.
                const tipo_solucion = Number(hoja_excel.getCell(`${letra_columna_tipos_archivos_solucion}${i}`).text.trim());
            
                let archivo_solucion_mp4 = '';

                switch (tipo_solucion) {
                    case 0: //No tiene ningún archivo de solución adicional.
                        break;
                    case 1: //imagen (No se considera ya que las soluciones de imagen están incluidas en el power point de la pregunta)
                        break;
                    case 2: //video
                        //genera el path del video.
                        archivo_solucion_mp4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_videos}/${nombre_archivo_pregunta}-VD.mp4`;
                        //Verifica que el archivo existe.
                        if(!fs.existsSync(archivo_solucion_mp4)){
                            errores = [
                                ...errores,
                                { 
                                fila: i,
                                error: `Archivo video solución  ${archivo_solucion_mp4} no existe.`,  
                                }
                            ]
                        }
                    case 3: //imagen y video
                        break
                    
                }

                const pregunta_numero_pistas = Number(hoja_excel.getCell(`${letra_columna_pregunta_numero_pistas}${i}`).text.trim());
                //Si el archivo tiene pistas.
                if(pregunta_numero_pistas > 0){
    
                    let archivo_pista_ppt = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/${nombre_archivo_pregunta}-${pregunta_numero_pistas}.pptx`;
                    
                    if(!fs.existsSync(archivo_pista_ppt)){
                        errores = [
                            ...errores,
                            { 
                            fila: i,
                            error: `Archivo power point pista ${archivo_pista_ppt} no existe.`,  
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

        //Lee filas del archivo excel y comienza el proceso.
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){
            
            let nombre_archivo_pregunta = hoja_excel.getCell(`${letra_columna_nombre_archivo_pregunta}${i}`).text;
            let alternativa_correcta = hoja_excel.getCell(`${letra_columna_alternativa_correcta}${i}`).text.trim();
            let duracion_pregunta = hoja_excel.getCell(`${letra_columna_duracion_pregunta}${i}`).text.trim();
            let recordar = hoja_excel.getCell(`${letra_columna_recordar}${i}`).text.trim();
            let comprender = hoja_excel.getCell(`${letra_columna_comprender}${i}`).text.trim();
            let aplicar = hoja_excel.getCell(`${letra_columna_aplicar}${i}`).text.trim();
            let analizar = hoja_excel.getCell(`${letra_columna_analizar}${i}`).text.trim();
            let evaluar = hoja_excel.getCell(`${letra_columna_evaluar}${i}`).text.trim();
            let crear = hoja_excel.getCell(`${letra_columna_crear}${i}`).text.trim();
           
           
            let archivo_pregunta_ppt = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}.pptx`;
            let archivo_pregunta_pdf = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}.pdf`;
            let archivo_pregunta_imagen = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}_%d.jpg`;
            
            let resp = await powerPointToPDF(archivo_pregunta_ppt, archivo_pregunta_pdf);
            console.log(resp.msg);

            resp = await pdfToImage(archivo_pregunta_pdf, archivo_pregunta_imagen);
            console.log(resp.msg);

            const pdf_doc = await PDFDocument.load(fs.readFileSync(archivo_pregunta_pdf));
            const pdf_doc_pages = pdf_doc.getPageCount();
            console.log(`PDF ${archivo_pregunta_pdf} Total Páginas: ${pdf_doc_pages}`);
            
            let codigo_pregunta = uuidv4();

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
                duracion: duracion_pregunta,
                recordar,
                comprender,
                aplicar,
                analizar,
                evaluar,
                crear,
            });

            //*********ALTERNATIVAS.
            //Crea las 5 alternativas a indica cual es la correcta de acuerdo a lo que diga el archivo excel.
            const cantidad_alternativas = Number(hoja_excel.getCell(`${letra_columna_cantidad_alternativas}${i}`).text.trim());
            const alternativas = [...letras].splice(0, cantidad_alternativas).map( (letra, index) => {

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

                        //Verifica que el módulo existe antes de asociarlo a la pregunta.
                        const modulo = await Modulo.findByPk(codigo_actual);
                        if (!modulo){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo ${codigo_actual} no existe, verifique`,
                            });
                        }
                        await creaPreguntaModulo(codigo_pregunta, codigo_actual);

                    //si el tercer dígito es distinto de cero y el cuarto dígito es igual a '0'
                    //entonces estamos parados en el contenido de un módulo
                    }else if (arr_codigo_actual[2] !== '0' && arr_codigo_actual[3] === '0'){

                        //Obtiene el modulo al cual corresponde el contenido.
                        const modulo_contenido = await ModuloContenido.findByPk(codigo_actual);
                        //Verifica que el modulo contenido existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido ${codigo_actual} no existe, verifique`,
                            });
                        }
                        const codigo_modulo = modulo_contenido.dataValues.codigo_modulo;
                        //Asocia la pregunta al módulo
                        await creaPreguntaModulo(codigo_pregunta, codigo_modulo);
                        //Asocia la pregunta al módulo contenido
                        await creaPreguntaModuloContenido(codigo_pregunta, codigo_actual);


                    //si el cuarto dígito es distinto de '0' y el quinto dígito es igual a '0'
                    //entonces estamos parados en un tema del contenido de un módulo.
                    }else if(arr_codigo_actual[3] !== '0' && arr_codigo_actual[4] === '0'){

                        //Obtiene el contenido al cual corresponde el tema
                        const modulo_contenido_tema = await ModuloContenidoTema.findByPk(codigo_actual);
                        //Verifica que el módulo contenido tema existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido_tema){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido tema ${codigo_actual} no existe, verifique`,
                            });
                        }
                        //Obtiene el codigo modulo contenido.
                        const codigo_modulo_contenido = modulo_contenido_tema.dataValues.codigo_modulo_contenido;
                        
                        //Obtiene el modulo al cual corresponde el contenido.
                        const modulo_contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
                        //Verifica que el modulo contenido existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido ${codigo_modulo_contenido} no existe, verifique`,
                            });
                        }
                        const codigo_modulo = modulo_contenido.dataValues.codigo_modulo;

                        //Asocia la pregunta al módulo
                        await creaPreguntaModulo(codigo_pregunta, codigo_modulo);
                        //Asocia la pregunta al módulo contenido
                        await creaPreguntaModuloContenido(codigo_pregunta, codigo_modulo_contenido);
                        //Asocia la pregunta al módulo contenido tema
                        await creaPreguntaModuloContenidoTema(codigo_pregunta, codigo_actual);

                    //Si el quinto dígito es distinto de '0' entonces estamos parados sobre un concepto.
                    }else if(arr_codigo_actual[4] !== '0'){

                        //Obtiene el tema al cual corresponde el concepto.
                        const modulo_contenido_tema_concepto = await ModuloContenidoTemaConcepto.findByPk(codigo_actual)
                        //Verifica que el modulo contenido tema concepto existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido_tema_concepto){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido tema concepto ${codigo_actual} no existe, verifique`,
                            });
                        }
                        //Obtiene el codigo modulo contenido tema.
                        const codigo_modulo_contenido_tema = modulo_contenido_tema_concepto.dataValues.codigo_modulo_contenido_tema;

                        //Obtiene el contenido al cual corresponde el tema
                        const modulo_contenido_tema = await ModuloContenidoTema.findByPk(codigo_modulo_contenido_tema);
                        //Verifica que el módulo contenido tema existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido_tema){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido tema ${codigo_modulo_contenido_tema} no existe, verifique`,
                            });
                        }
                        //Obtiene el codigo modulo contenido.
                        const codigo_modulo_contenido = modulo_contenido_tema.dataValues.codigo_modulo_contenido;
                        
                        //Obtiene el modulo al cual corresponde el contenido.
                        const modulo_contenido = await ModuloContenido.findByPk(codigo_modulo_contenido);
                        //Verifica que el modulo contenido existe antes de asociarlo a la pregunta.
                        if(!modulo_contenido){
                            return res.status(404).send({
                                error: 100,
                                msg: `Código módulo contenido ${codigo_modulo_contenido} no existe, verifique`,
                            });
                        }
                        const codigo_modulo = modulo_contenido.dataValues.codigo_modulo;

                        //Asocia la pregunta al módulo
                        await creaPreguntaModulo(codigo_pregunta, codigo_modulo);
                        //Asocia la pregunta al módulo contenido
                        await creaPreguntaModuloContenido(codigo_pregunta, codigo_modulo_contenido);
                        //Asocia la pregunta al módulo contenido tema
                        await creaPreguntaModuloContenidoTema(codigo_pregunta, codigo_modulo_contenido_tema);
                        //Asocia la pregunta al modulo contenido tema concepto.
                        await creaPreguntaModuloContenidoTemaConcepto(codigo_pregunta, codigo_actual);

                    }
                    
                }

            }

            let numero_solucion = 0;
            //SOLUCIONES IMG.
            for(let i = 2; i < pdf_doc_pages; i++){
                //Genera el path donde se encuentra la solución de la imagen. 
                //Corresponde al directorio donde se convierte el ppt a pdf y luego el pdf a imagen.
                //La imagen 2 en adelante son soluciones.
                let archivo_solucion_jpg = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/${nombre_archivo_pregunta}_${i}.jpg`;
                //Genera el número de la solución.
                numero_solucion = i - 1;
                //Mueve el archivo de imagen de la solución hasta el directorio de los archivos de la pregunta.
                await moverArchivo(archivo_solucion_jpg, `${dir_pregunta}${codigo_pregunta}/soluciones/img-solucion-${numero_solucion}.jpg`);

                //crea el registro en la bd donde se asocia la solución a la pregunta.
                await PreguntaSolucion.create({
                    codigo: uuidv4(),
                    codigo_pregunta,
                    numero: numero_solucion,
                    texto: '',
                    imagen:`img-solucion-${numero_solucion}.jpg`, 
                    audio: '',
                    video: '',
                });

            }

            //La pregunta también puede contener archivos adicionales de solución. Como videos o imagenes.
            const tipo_solucion = Number(hoja_excel.getCell(`${letra_columna_tipos_archivos_solucion}${i}`).text.trim());
            
            let archivo_solucion_mp4 = '';

            switch (tipo_solucion) {
                case 0: //No tiene ningún archivo de solución adicional.
                    break;
                case 1: //imagen (No se considera ya que las soluciones de imagen están incluidas en el power point de la pregunta)
                    break;
                case 2: //video
                    numero_solucion+1
                    //genera el path del video.
                    archivo_solucion_mp4 = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_videos}/${nombre_archivo_pregunta}-VD.mp4`;
                    //Verifica que el archivo existe.
                    if(!fs.existsSync(archivo_solucion_mp4)){
                        return res.status(404).send({
                            error: 100,
                            msg: `Archivo ${archivo_solucion_mp4} no existe.`,
                        });
                    }
                    
                    //Mueve el archivo de video de la solución hasta el directorio de los archivos de la pregunta.
                    fs.copyFileSync(archivo_solucion_mp4, `${dir_pregunta}${codigo_pregunta}/soluciones/vd-solucion-${numero_solucion}.mp4`);

                    //crea el registro en la bd donde se asocia la solución a la pregunta.
                    await PreguntaSolucion.create({
                        codigo: uuidv4(),
                        codigo_pregunta,
                        numero: numero_solucion,
                        texto: '',
                        imagen: '',
                        audio: '',
                        video: `vd-solucion-${numero_solucion}.mp4`,
                    });

                case 3: //imagen y video
                    break
                
            }


            //PISTAS
            const pregunta_numero_pistas = Number(hoja_excel.getCell(`${letra_columna_pregunta_numero_pistas}${i}`).text.trim());
            //Si el archivo tiene pistas.
            if(pregunta_numero_pistas > 0){

                let archivo_pista_ppt = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/${nombre_archivo_pregunta}-${pregunta_numero_pistas}.pptx`;
                let archivo_pista_pdf = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/${nombre_archivo_pregunta}-${pregunta_numero_pistas}.pdf`;
                let archivo_pista_imagen = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/${nombre_archivo_pregunta}-${pregunta_numero_pistas}_%d.jpg`;
                //Convierte el archivo ppt de pistas a pdf.
                let resp = await powerPointToPDF(archivo_pista_ppt, archivo_pista_pdf);
                console.log(resp.msg);
                //Convierte el archivo pdf de pistas a imagen.
                resp = await pdfToImage(archivo_pista_pdf, archivo_pista_imagen);
                console.log(resp.msg);
                //Obtiene el número de páginas del archivo PDF.
                const pdf_doc = await PDFDocument.load(fs.readFileSync(archivo_pista_pdf));
                const pdf_doc_pages = pdf_doc.getPageCount();
                console.log(`PDF pistas ${archivo_pista_pdf} Total Páginas: ${pdf_doc_pages}`);
                
                //PISTAS IMG.
                for(let i = 0; i < pdf_doc_pages; i++){
                    //Genera el path donde se encuentra la imagen de la pista. 
                    let archivo_pista_jpg = `${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/${nombre_archivo_pregunta}-${pregunta_numero_pistas}_${i}.jpg`;
                    //Genera el número de la solución.
                    let numero_pista = i + 1;
                    //Mueve el archivo de imagen de la solución hasta el directorio de los archivos de la pregunta.
                    await moverArchivo(archivo_pista_jpg, `${dir_pregunta}${codigo_pregunta}/pistas/img-pista-${numero_pista}.jpg`);

                    //crea el registro en la bd donde se asocia la pista a la pregunta.
                    await PreguntaPista.create({
                        codigo: uuidv4(),
                        codigo_pregunta,
                        numero: numero_pista,
                        texto: '',
                        imagen:`img-pista-${numero_pista}.jpg`, 
                        audio: '',
                        video: '',
                    });

                }

                //ELIMINA TODOS LOS ARCHIVOS PDF y JPG que no son utilizados.
                const res_rm_pista = findRemoveSync(`${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pistas}/`, {extensions: ['.pdf', '.jpg']})

                //Listado de archivos elimandos.
                console.log(res_rm_pista);

                //Archivo ppt pista que se debe eliminar al finalizar el proceso.
                console.log(archivo_pista_ppt);
                
            }

            //Archivo ppt pregunta que se debe eliminar al finalizar el proceso.
            console.log(archivo_pregunta_ppt);
            //Archivo mp4 video que se debe eliminar al finalizar el proceso.
            console.log(archivo_solucion_mp4);

            //ELIMINA TODOS LOS ARCHIVOS PDF y JPG que no son utilizados.
            const res_rm_pregunta = findRemoveSync(`${tmp_dir}${nombre_carpeta_archivos}/${nombre_carpeta_archivo_pregunta}/`, {extensions: ['.pdf', '.jpg']})
            //Listado de archivos elimandos.
            console.log(res_rm_pregunta);

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

