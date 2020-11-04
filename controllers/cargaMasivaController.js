const { Configuracion, Unidad, Materia, 
        Modulo, ModuloContenido, ModuloContenidoTema, 
        ModuloContenidoTemaConcepto } = require('../config/db');
const fsp = require('fs').promises;
const ExcelJS = require('exceljs');


exports.cargaMateriasUnidadesModulos = async (req, res) => {

    /***
     * archivo_base64: Archivo excel en formato base64.
     * archivo_nombre: Nombre del archivo excel.
     * archivo_extension: Extensión del archivo excel.
     * letra_columna_codigo: Columna donde se encuentra el código del dato a insertar. Ejemplo: A
     * letra_columna_descripcion: Columna donde se encuentra la descripción del dato a insertar.
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     * codigo_materia: Codigo materia existente en el sistema al cual pertenecen los datos cargados.
     */

    const { archivo_base64, archivo_nombre, archivo_extension, 
            letra_columna_codigo, letra_columna_descripcion,
            fila_inicio, fila_fin, codigo_materia} = req.body;

    try{

        if(!codigo_materia || codigo_materia.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro codigo_materia no puede ser vacío, verifique.`,
            });
        }

        if(!archivo_nombre || archivo_nombre.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_nombre no puede ser vacío, verifique.`,
            });
        }

        if(!archivo_extension || archivo_extension.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_extension no puede ser vacío, verifique.`,
            });
        }

        if(!archivo_base64 || archivo_base64.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_base64 no puede ser vacío, verifique.`,
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

       
        //guarda el archivo base64 en el directorio temporal
        const archivo_carga = `${tmp_dir.dataValues.valor}${archivo_nombre}${archivo_extension}`;
        await fsp.writeFile(archivo_carga, archivo_base64, 'base64')

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
            let arr_codigo_actual = codigo_actual.split('.');
            let descripcion_actual =  hoja_excel.getCell(`${letra_columna_descripcion}${i}`).text.trim();

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
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}


exports.cargaPreguntas = async (req, res) => {

    /***
     * archivo_base64: Archivo excel en formato base64.
     * archivo_nombre: Nombre del archivo excel.
     * archivo_extension: Extensión del archivo excel.
     * letra_columna_codigo: Columna donde se encuentra el código del dato a insertar. Ejemplo: A
     * letra_columna_descripcion: Columna donde se encuentra la descripción del dato a insertar.
     * fila_inicio: Fila donde se inicia de la lectura de los datos.
     * fila_fin: Fila donde termina la lectura de los datos.
     */

    const { archivo_base64, archivo_nombre, archivo_extension, 
            letra_columna_codigo_1, letra_columna_codigo_2,
            letra_columna_codigo_3, letra_columna_codigo_4,
            letra_columna_codigo_5, letra_columna_codigo_6,
            fila_inicio, fila_fin} = req.body;

    try{

        if(!archivo_nombre || archivo_nombre.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_nombre no puede ser vacío, verifique.`,
            });
        }

        if(!archivo_extension || archivo_extension.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_extension no puede ser vacío, verifique.`,
            });
        }

        if(!archivo_base64 || archivo_base64.trim() === ''){
            return res.status(404).send({
                msg: `Parámetro archivo_base64 no puede ser vacío, verifique.`,
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

       
        //guarda el archivo base64 en el directorio temporal
        const archivo_carga = `${tmp_dir.dataValues.valor}${archivo_nombre}${archivo_extension}`;
        await fsp.writeFile(archivo_carga, archivo_base64, 'base64')

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

        let codigo_unidad = '';
        let codigo_modulo = '';
        let codigo_modulo_propiedad = '';
        let codigo_modulo_propiedad_subpropiedad = '';

        
        for(let i = Number(fila_inicio); i <= Number(fila_fin); i++){

            
            
           
        }
    

        res.json({
            msg:"Todo OK",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}