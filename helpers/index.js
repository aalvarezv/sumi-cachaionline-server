const { exec } = require("child_process");
const libreoffice = require('libreoffice-convert');
const mv = require('mv');
const fs = require('fs');
const { PreguntaModulo, PreguntaModuloContenido, 
    PreguntaModuloContenidoTema, PreguntaModuloContenidoTemaConcepto,
    Configuracion } = require('../database/db');
const mime = require('mime-types');

const letras = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
    'Q', 'R', 'S', 'U', 'V', 'W', 'X', 'Y',
    'Z' 
]

const fileToBase64 = file => {

    return new Promise(async(resolve, reject) => {
        try {
            
            let binaryData = fs.readFileSync(file);
            let base64String = new Buffer.from(binaryData).toString('base64');
            let file_type = mime.lookup(file);
            resolve(`data:${file_type};base64,${base64String}`);

        } catch (error) {
            reject(error);
        }

    });

}

const creaPreguntaModulo = async (codigo_pregunta, codigo_modulo) => {

    return new Promise(async (resolve, reject) => {
        try{
            //Asocia la pregunta al módulo.
            //Verifica que no existe antes de crear.
            const pregunta_modulo = await PreguntaModulo.findOne({
                where:{
                    codigo_pregunta,
                    codigo_modulo,
                }
            });
            //Si la pregunta no está asociada al modulo, crea la asociación.
            if(!pregunta_modulo){
                await PreguntaModulo.create({
                    codigo_pregunta,
                    codigo_modulo,
                });
            }
    
            resolve({
                error: 0,
                msg: `Pregunta ${codigo_pregunta} asociada a modulo ${codigo_modulo}`,
            });
    
        } catch (error) {
            console.log(error);
            reject({
                error: 100,
                msg: error,
            });
        }

    });
    
}

const creaPreguntaModuloContenido = async (codigo_pregunta, codigo_modulo_contenido) => {

    return new Promise(async (resolve, reject) => {
        try{
            //Asocia la pregunta al módulo contenido.
            //Verifica que no existe antes de crear.
            const pregunta_modulo_contenido = await PreguntaModuloContenido.findOne({
                where:{
                    codigo_pregunta,
                    codigo_modulo_contenido,
                }
            });
            //Si la pregunta no está asociada al modulo contenido, crea la asociación.
            if(!pregunta_modulo_contenido){
                await PreguntaModuloContenido.create({
                    codigo_pregunta,
                    codigo_modulo_contenido,
                });
            }
    
            resolve({
                error: 0,
                msg: `Pregunta ${codigo_pregunta} asociada a modulo contenido ${codigo_modulo_contenido}`,
            });
    
        } catch (error) {
            console.log(error);
            reject({
                error: 100,
                msg: error,
            });
        }

    });
    
}

const creaPreguntaModuloContenidoTema = async (codigo_pregunta, codigo_modulo_contenido_tema) => {

    return new Promise(async (resolve, reject) => {
        try{
            //Asocia la pregunta al módulo contenido tema.
            //Verifica que no existe antes de crear.
            const pregunta_modulo_contenido_tema = await PreguntaModuloContenidoTema.findOne({
                where:{
                    codigo_pregunta,
                    codigo_modulo_contenido_tema,
                }
            });
            //Si la pregunta no está asociada al modulo contenido tema, crea la asociación.
            if(!pregunta_modulo_contenido_tema){
                await PreguntaModuloContenidoTema.create({
                    codigo_pregunta,
                    codigo_modulo_contenido_tema,
                });
            }
    
            resolve({
                error: 0,
                msg: `Pregunta ${codigo_pregunta} asociada a modulo contenido tema ${codigo_modulo_contenido_tema}`,
            });
    
        } catch (error) {
            console.log(error);
            reject({
                error: 100,
                msg: error,
            });
        }

    });
    
}

const creaPreguntaModuloContenidoTemaConcepto = async (codigo_pregunta, codigo_modulo_contenido_tema_concepto) => {

    return new Promise(async (resolve, reject) => {
        try{
            //Asocia la pregunta al módulo contenido tema concepto.
            //Verifica que no existe antes de crear.
            const pregunta_modulo_contenido_tema_concepto = await PreguntaModuloContenidoTemaConcepto.findOne({
                where:{
                    codigo_pregunta,
                    codigo_modulo_contenido_tema_concepto,
                }
            });
            //Si la pregunta no está asociada al modulo contenido tema concepto, crea la asociación.
            if(!pregunta_modulo_contenido_tema_concepto){
                await PreguntaModuloContenidoTemaConcepto.create({
                    codigo_pregunta,
                    codigo_modulo_contenido_tema_concepto,
                });
            }
    
            resolve({
                error: 0,
                msg: `Pregunta ${codigo_pregunta} asociada a modulo contenido tema concepto ${codigo_modulo_contenido_tema_concepto}`,
            });
    
        } catch (error) {
            console.log(error);
            reject({
                error: 100,
                msg: error,
            });
        }

    });
    
}

const powerPointToPDF = async (archivo_ppt, archivo_pdf) => {

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

const pdfToImage = (archivo_pdf, archivo_imagen) => {

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


//limpia texto del nombre de los campos del objeto.
const limpiaTextoObjeto = (obj, textoReemplazar) => {
    
return obj.map(item => {
    //objeto a arreglo
    let entries = Object.entries(item).map(entry => {
        return entry
    })
    //recorro el arreglo y elimino el texto que se necesita.
    entries = entries.map( entry => {
        const key = entry[0].replace(textoReemplazar,'')
        const val = entry[1]
        return [key, val]
    })
    //arreglo a objeto.
    const obj = Object.fromEntries(entries);
    return obj

})

}

const isUrl = (s) => {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
 }

module.exports = {
    letras,
    creaPreguntaModulo,
    creaPreguntaModuloContenido,
    creaPreguntaModuloContenidoTema,
    creaPreguntaModuloContenidoTemaConcepto,
    powerPointToPDF,
    pdfToImage,
    moverArchivo,
    fileToBase64,
    limpiaTextoObjeto,
    isUrl,
}