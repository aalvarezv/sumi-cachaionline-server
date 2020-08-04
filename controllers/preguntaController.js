const {Pregunta, Unidad} = require('../config/db');
const { validationResult } = require('express-validator');




exports.crearPregunta = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try{
    
        const {codigo, descripcion, imagen, puntaje, codigo_unidad} = req.body;

        
        let pregunta = await Pregunta.findByPk(codigo);
        if (pregunta) {
            console.log('La pregunta ya existe');
            return res.status(400).json({
                msg: 'La pregunta ya existe'
            });
        }


        
        let unidad = await Unidad.findByPk(codigo_unidad);
        if(!unidad){
            console.log('La unidadingresado no es válido');
            return res.status(400).json({
                msg: 'La unidad ingresado no es válido'
            });
        }

        pregunta = await Pregunta.create({
            codigo, 
            descripcion, 
            imagen, 
            puntaje, 
            codigo_unidad
        });

        
        res.json({
            pregunta
        });
    
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarPreguntas = async (req, res) =>{
    
    try {

        const pregunta = await Pregunta.findAll();
        res.json({
            pregunta
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarPregunta = async (req, res) => {

    try{

        const {codigo, descripcion, imagen, puntaje, codigo_unidad} = req.body;

        
        let pregunta = await Pregunta.findByPk(codigo);
        if(!pregunta){
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }
        
        let unidad = await Unidad.findByPk(codigo_unidad);
        if(!unidad){
            return res.status(404).send({
                msg: `La unidad rol ${codigo_unidad} no existe`
            })
        }

        
        pregunta = await pregunta.update({
                descripcion,
                imagen,
                puntaje,
                codigo_unidad
        },{ where: {
                codigo
        }})

        res.json({
            msg: "Pregunta actualizada exitosamente"
        });

     } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarPregunta = async (req, res) => {

    try{    

        const {codigo} = req.params;
        
        let pregunta = await Pregunta.findByPk(codigo);
        if(!pregunta){
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }
        pregunta = await Pregunta.destroy({
            where: {
                codigo
            }
        });

       
        res.json({
            msg: 'Pregunta eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosPreguntas = async (req, res) => {

    try {
        const {codigo} = req.params
        
        const pregunta = await Pregunta.findByPk(codigo);
        
        if(!pregunta){
            return res.status(404).send({
                msg: `La pregunta ${codigo} no existe`
            })
        }
        
        res.json({
            pregunta
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}