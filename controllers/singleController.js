const { 
    Single, 
    Usuario, 
    NivelAcademico, 
    Institucion
 } = require('../config/db');
const uuidv4 = require('uuid').v4;
const { validationResult } = require('express-validator');

exports.iniciarSingle = async(req, res) => {

    //si hay errores de la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
 
    try {
        
        const {
            filtro_materia, 
            filtro_unidad,
            filtro_modulo,
            filtro_contenido,
            filtro_tema,
            filtro_concepto,
            cantidad_preguntas,
            tiempo,
            rut_usuario,
            codigo_institucion,
            codigo_nivel_academico,
        } = req.body;

        //verifica que el usuario sea válido.
        let usuario = await Usuario.findByPk(rut_usuario);
        if (!usuario) {
            return res.status(400).json({
                msg: 'El rut usuario no es válido'
            });
        }

        //verifica que la institucion sea válida.
        let institucion = await Institucion.findByPk(codigo_institucion);
        if (!institucion) {
            return res.status(400).json({
                msg: 'El código institución no es válido'
            });
        }

        //verifica que el nivel academico sea válido.
        let nivel_academico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if (!nivel_academico) {
            return res.status(400).json({
                msg: 'El código nivel academico no es válido'
            });
        }

        let codigo = uuidv4();
        //Guarda el nuevo ring
        single = await Single.create({
            codigo, 
            filtro_materia, 
            filtro_unidad,
            filtro_modulo,
            filtro_contenido,
            filtro_tema,
            filtro_concepto,
            cantidad_preguntas,
            tiempo,
            rut_usuario,
            codigo_institucion,
            codigo_nivel_academico,
            codigo_estado : "1",
            fecha_hora_inicio: new Date(),
        }); 


        //envía la respuesta
        res.json({
            codigo
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        });
    }

}


exports.finalizarSingle = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let { 
            codigo,
         } = req.body;

        //verifica que el single a actualizar existe.
        let single = await Single.findByPk(codigo);
        if (!single) {
            return res.status(404).send({
                msg: `El codigo single ${codigo} no existe`
            })
        }
        
        //actualiza los datos.
        single = await Single.update({
            codigo_estado: "3",
            fecha_hora_fin: new Date(),
        }, {
            where: {
                codigo
            }
        })

        res.json({
            codigo,
            msg: `Finalizado correctamente`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}