const fs = require('fs')
const ExcelJS = require('exceljs')
const uuidv4 = require('uuid').v4

const { UnidadMineduc, UnidadMineducUnidadCachai, UnidadMineducObjetivo,
UnidadMineducHabilidad, UnidadMineducConocimientoPrevio, sequelize, NivelAcademico, Unidad, Modulo, ModuloContenido, ModuloContenidoTema, ModuloContenidoTemaConcepto,
UnidadMineducConocimientoPrevioUnidadCachai } = require('../database/db')

exports.cargaMasivaMineduc = async(req, res) => {

    try{

        const { 
            nombre_archivo_carga,
            archivo_base64,
        } = req.body

 
        //Directorio temporal donde se guardará el archivo zip con la información de las preguntas a cargar.
        const tmp_dir = process.env.DIR_TEMP;
        //genera la ruta del archivo excel a leer.
        let archivo_carga = `${tmp_dir}${nombre_archivo_carga}`;
        //Guarda el archivo en el directorio temporal.
        await fs.writeFileSync(`${archivo_carga}`, archivo_base64, 'base64')

        const workbook = new ExcelJS.Workbook();

        let hoja_excel = null
        const libro_excel = await workbook.xlsx.readFile(archivo_carga);

        //validaciones
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 1');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 1 en el archivo excel para unidades MINEDUC, verifique.`,
            });
        }

        let errors = []
        

        for(let i = 2; i <= 1000; i++){
            let codigoNivelAcademico = hoja_excel.getCell(`C${i}`).text;
            let nivelAcademico = await NivelAcademico.findByPk(codigoNivelAcademico);
            if(codigoNivelAcademico === ''){
                break
            }
            if(!nivelAcademico){
                errors.push({
                    msg: `Código nivel academico ${codigoNivelAcademico} no es válido, fila ${i} columna C`
                })
            }
        }

        hoja_excel  = libro_excel.getWorksheet('MINEDUC 2');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 2 en el archivo excel para cargar unidades MINEDUC vs unidades Cachai, verifique.`,
            });
        }

        for(let i = 2; i <= 1000; i++){

            let codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            
            if(codigoUnidadMineduc === ''){
                break
            }
            
            let codigoUnidadCachai = hoja_excel.getCell(`C${i}`).text;
            let unidadCachai = await Unidad.findByPk(codigoUnidadCachai);
            if(!unidadCachai){
                errors.push({
                    msg: `Código unidad ${codigoUnidadCachai} no es válido, fila ${i} columna C`
                })
            }

            let codigoModuloCachai = hoja_excel.getCell(`D${i}`).text;
            if(codigoModuloCachai.trim() !== ""){
                let moduloCachai = await Modulo.findByPk(codigoModuloCachai)
                if(!moduloCachai){
                    errors.push({
                        msg: `Código modulo ${codigoModuloCachai} no es válido, fila ${i} columna D`
                    })
                }
            }

            let codigoContenidoCachai = hoja_excel.getCell(`E${i}`).text;
            if(codigoContenidoCachai.trim() !== ""){
                let contenidoCachai = await ModuloContenido.findByPk(codigoContenidoCachai)
                if(!contenidoCachai){
                    errors.push({
                        msg: `Código contenido ${codigoModuloCachai} no es válido, fila ${i} columna E`
                    })
                }
            }

            let codigoTemaCachai = hoja_excel.getCell(`F${i}`).text;
            if(codigoTemaCachai.trim() !== ""){
                let temaCachai = await ModuloContenidoTema.findByPk(codigoTemaCachai)
                if(!temaCachai){
                    errors.push({
                        msg: `Código tema ${codigoTemaCachai} no es válido, fila ${i} columna F`
                    })
                }
            }

            let codigoConceptoCachai = hoja_excel.getCell(`G${i}`).text;
            if(codigoConceptoCachai.trim() !== ""){
                let conceptoCachai = await ModuloContenidoTemaConcepto.findByPk(codigoConceptoCachai)
                if(!conceptoCachai){
                    errors.push({
                        msg: `Código concepto ${codigoConceptoCachai} no es válido, fila ${i} columna G`
                    })
                }
            }

        }

        hoja_excel  = libro_excel.getWorksheet('MINEDUC 3');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 3 en el archivo excel para cargar los objetivos, verifique.`,
            });
        }

        
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 4');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 4 en el archivo excel para cargar las habilidades, verifique.`,
            });
        }
               
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 5');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 5 en el archivo excel para cargar conocimientos previos, verifique.`,
            });
        }


        hoja_excel  = libro_excel.getWorksheet('MINEDUC 6');

        if (!hoja_excel) {
            return res.status(404).send({
                msg: `No existe la hoja MINEDUC 6 en el archivo excel para cargar conocimientos previos unidad MINEDUC vs unidad Cachai, verifique.`,
            });
        }

        for(let i = 2; i <= 1000; i++){

            let codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            
            if(codigoUnidadMineduc === ''){
                break
            }

            let codigoUnidadCachai = hoja_excel.getCell(`C${i}`).text;
            let unidadCachai = await Unidad.findByPk(codigoUnidadCachai);
            if(!unidadCachai){
                errors.push({
                    msg: `Código unidad ${codigoUnidadCachai} no es válido, fila ${i} columna C`
                })
            }

            let codigoModuloCachai = hoja_excel.getCell(`D${i}`).text;
            if(codigoModuloCachai.trim() !== ""){
                let moduloCachai = await Modulo.findByPk(codigoModuloCachai)
                if(!moduloCachai){
                    errors.push({
                        msg: `Código modulo ${codigoModuloCachai} no es válido, fila ${i} columna D`
                    })
                }
            }

            let codigoContenidoCachai = hoja_excel.getCell(`E${i}`).text;
            if(codigoContenidoCachai.trim() !== ""){
                let contenidoCachai = await ModuloContenido.findByPk(codigoContenidoCachai)
                if(!contenidoCachai){
                    errors.push({
                        msg: `Código contenido ${codigoModuloCachai} no es válido, fila ${i} columna E`
                    })
                }
            }

            let codigoTemaCachai = hoja_excel.getCell(`F${i}`).text;
            if(codigoTemaCachai.trim() !== ""){
                let temaCachai = await ModuloContenidoTema.findByPk(codigoTemaCachai)
                if(!temaCachai){
                    errors.push({
                        msg: `Código tema ${codigoTemaCachai} no es válido, fila ${i} columna F`
                    })
                }
            }

            let codigoConceptoCachai = hoja_excel.getCell(`G${i}`).text;
            if(codigoConceptoCachai.trim() !== ""){
                let conceptoCachai = await ModuloContenidoTemaConcepto.findByPk(codigoConceptoCachai)
                if(!conceptoCachai){
                    errors.push({
                        msg: `Código concepto ${codigoConceptoCachai} no es válido, fila ${i} columna G`
                    })
                }
            }

        }

        if(errors.length > 0){
            errors.unshift({
                msg: `Error en carga de archivo`
            })

            return res.status(400).send({
                errors
            })
        }
        
        //Limpia las tablas
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
        await UnidadMineducConocimientoPrevioUnidadCachai.destroy({truncate: true})
        await UnidadMineducConocimientoPrevio.destroy({truncate: true})
        await UnidadMineducHabilidad.destroy({truncate: true})
        await UnidadMineducObjetivo.destroy({truncate: true})
        await UnidadMineducUnidadCachai.destroy({truncate: true})
        await UnidadMineduc.destroy({truncate: true})
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
       
        //Se ubica en la hoja 
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 1');

        //Carga los registros en la base de datos.
        for(let i = 2; i <= 1000; i++){

            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            let descripcionUnidadMineduc = hoja_excel.getCell(`B${i}`).text;
            let codigoNivelAcademico = hoja_excel.getCell(`C${i}`).text;
            //INSERT A LA TABLA QUE CORRESPONDA
            //si no hay mas información, detengo
            if(codigoUnidadMineduc === ''){
                break
            }

            await UnidadMineduc.create({
                codigo: codigoUnidadMineduc,
                descripcion: descripcionUnidadMineduc,
                codigo_nivel_academico: codigoNivelAcademico
            })

        }  


        //Se ubica en la hoja CARGA
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 2');

        for(let i = 2; i <= 1000; i++){

            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            if(codigoUnidadMineduc === ''){
                break
            }

            let codigoUnidadCachai = hoja_excel.getCell(`C${i}`).text;
            let codigoModuloCachai = hoja_excel.getCell(`D${i}`).text;
            let codigoContenidoCachai = hoja_excel.getCell(`E${i}`).text;
            let codigoTemaCachai = hoja_excel.getCell(`F${i}`).text;
            let codigoConceptoCachai = hoja_excel.getCell(`G${i}`).text;
            

            await UnidadMineducUnidadCachai.create({
                codigo: uuidv4(),
                codigo_unidad_mineduc: codigoUnidadMineduc,
                codigo_unidad_cachai: codigoUnidadCachai,
                codigo_modulo_cachai: codigoModuloCachai.trim() !== "" ? codigoModuloCachai : null,
                codigo_contenido_cachai: codigoContenidoCachai.trim() !== "" ? codigoContenidoCachai : null,
                codigo_tema_cachai: codigoTemaCachai.trim() !== "" ? codigoTemaCachai : null,
                codigo_concepto_cachai: codigoConceptoCachai.trim() !== "" ? codigoConceptoCachai : null,
            })

        } 

        hoja_excel  = libro_excel.getWorksheet('MINEDUC 3');

        for(let i = 2; i <= 1000; i++){
            
            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            if(codigoUnidadMineduc === ''){
                break
            }
            let numeroObjetivo = hoja_excel.getCell(`C${i}`).text;
            let descripcionObjetivo = hoja_excel.getCell(`D${i}`).text;

            if(codigoUnidadMineduc === ''){
                break
            }
            
            await UnidadMineducObjetivo.create({
                codigo: uuidv4(),
                codigo_unidad_mineduc: codigoUnidadMineduc,
                numero_objetivo: numeroObjetivo,
                descripcion_objetivo: descripcionObjetivo
            })

        }
        
        
        hoja_excel  = libro_excel.getWorksheet('MINEDUC 4');

        for(let i = 2; i <= 1000; i++){

            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
           
            if(codigoUnidadMineduc === ''){
                break
            }

            let numeroHabilidad = hoja_excel.getCell(`C${i}`).text;
            let descripcionHabilidad = hoja_excel.getCell(`D${i}`).text;

            await UnidadMineducHabilidad.create({
                codigo: uuidv4(),
                codigo_unidad_mineduc: codigoUnidadMineduc,
                numero_habilidad: numeroHabilidad,
                descripcion_habilidad: descripcionHabilidad
            })

        } 

        hoja_excel  = libro_excel.getWorksheet('MINEDUC 5');

        for(let i = 2; i <= 1000; i++){

            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            let numeroConocimientoPrevio = hoja_excel.getCell(`B${i}`).text;
            let descripcionConocimientoPrevio = hoja_excel.getCell(`C${i}`).text;

            if(codigoUnidadMineduc === ''){
                break
            }
            
            await UnidadMineducConocimientoPrevio.create({
                codigo: uuidv4(),
                codigo_unidad_mineduc: codigoUnidadMineduc,
                numero_conocimiento_previo: numeroConocimientoPrevio,
                descripcion_conocimiento_previo: descripcionConocimientoPrevio
            })

        } 

        hoja_excel  = libro_excel.getWorksheet('MINEDUC 6');

        for(let i = 2; i <= 1000; i++){

            codigoUnidadMineduc = hoja_excel.getCell(`A${i}`).text;
            if(codigoUnidadMineduc === ''){
                break
            }

            let numeroConocimientoPrevio = hoja_excel.getCell(`B${i}`).text;
            let codigoUnidadCachai = hoja_excel.getCell(`C${i}`).text;
            let codigoModuloCachai = hoja_excel.getCell(`D${i}`).text;
            let codigoContenidoCachai = hoja_excel.getCell(`E${i}`).text;
            let codigoTemaCachai = hoja_excel.getCell(`F${i}`).text;
            let codigoConceptoCachai = hoja_excel.getCell(`G${i}`).text;
            
            await UnidadMineducConocimientoPrevioUnidadCachai.create({
                codigo: uuidv4(),
                codigo_unidad_mineduc: codigoUnidadMineduc,
                numero_conocimiento_previo: numeroConocimientoPrevio,
                codigo_unidad_cachai: codigoUnidadCachai,
                codigo_modulo_cachai: codigoModuloCachai.trim() !== "" ? codigoModuloCachai : null,
                codigo_contenido_cachai: codigoContenidoCachai.trim() !== "" ? codigoContenidoCachai : null,
                codigo_tema_cachai: codigoTemaCachai.trim() !== "" ? codigoTemaCachai : null,
                codigo_concepto_cachai: codigoConceptoCachai.trim() !== "" ? codigoConceptoCachai : null,
            })

        } 

        res.json({
            msg: 'Carga realizada exitosamente'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }

}