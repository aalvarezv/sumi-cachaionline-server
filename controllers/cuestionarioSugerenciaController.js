const { CuestionarioSugerencia } = require('../database/db');
const fs = require('fs');
const uuidv4 = require('uuid').v4;
const ExcelJS = require('exceljs');
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
            nombre_cuestionario, 
            codigo_materia, 
            fecha_cuestionario, 
            link_cuestionario,
            archivo_base64 
        } = req.body;

        let nombre_archivo_carga = `CARGA-SUGERENCIAS-${nombre_cuestionario}.xlsx`
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
        
        //Elimina todo el cuestionario del usuario.
        await CuestionarioSugerencia.destroy({
            where:{
                rut_usuario,
                codigo_materia,
                nombre_cuestionario,
            }
        })

        const codigo_cuestionario = uuidv4()
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

            await CuestionarioSugerencia.create({
                codigo: codigo_cuestionario,
                rut_usuario,
                codigo_materia,
                nombre_cuestionario,
                codigo_pregunta,
                alternativa,
                fecha_cuestionario,
                link_cuestionario,
                alternativa_correcta,
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

exports.getCuestionarios = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }

    try {

        const {
            rut_usuario, 
            codigo_materia, 
            fecha_cuestionario_desde, 
            fecha_cuestionario_hasta
        } = req.query

        const cuestionarios = await CuestionarioSugerencia.findAll({
            attributes: ['codigo',['nombre_cuestionario','nombre']],
            where:{
                rut_usuario,
                codigo_materia,
                fecha_cuestionario: {[Op.between]: [fecha_cuestionario_desde, fecha_cuestionario_hasta]}
            },
            group: 'codigo'
        })

        res.json({
            cuestionarios,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error'
        })
    }


}


