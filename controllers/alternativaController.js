const {Alternativa, Pregunta} = require('../config/db');





exports.crearAlternativa = async (req, res) => {
    
    try{
    
        const {codigo, descripcion, correcta, codigo_pregunta} = req.body;

        
        let alternativa = await Alternativa.findByPk(codigo);
        if (alternativa) {
            console.log('La alternativa ya existe');
            return res.status(400).json({
                msg: 'La alternativa ya existe'
            });
        }


        
        let pregunta = await Pregunta.findByPk(codigo_pregunta);
        if(!pregunta){
            console.log('La pregunta ingresada no es válida');
            return res.status(400).json({
                msg: 'La pregunta ingresada no es válida'
            });
        }
       
        
        alternativa = await Alternativa.create({
            codigo, 
            descripcion, 
            correcta, 
            codigo_pregunta
        });

        
        res.json({
            alternativa
        });
    
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarAlternativas = async (req, res) =>{

    try {

        const alternativas = await Alternativa.findAll();
        res.json({
            alternativas
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    
}

exports.actualizarAlternativa = async (req, res) => {

    try{

        const {codigo, descripcion, correcta, codigo_pregunta} = req.body;

        
        let alternativa = await Alternativa.findByPk(codigo);
        if(!alternativa){
            return res.status(404).send({
                msg: `La alternativa ${codigo} no existe`
            })
        }
        
        let pregunta = await Pregunta.findByPk(codigo_pregunta);
        if(!pregunta){
            return res.status(404).send({
                msg: `El codigo pregunta ${codigo_pregunta} no existe`
            })
        }

       
        alternativa = await Alternativa.update({
                descripcion,
                correcta,
                codigo_pregunta
        },{ where: {
                codigo
        }})

        res.json({
            msg: "Alternativa actualizada exitosamente"
        });

     } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarAlternativa = async (req, res) => {

    try{    
        
        const {codigo} = req.params;
        
        let alternativa = await Alternativa.findByPk(codigo);
        if(!alternativa){
            return res.status(404).send({
                msg: `La alternativa ${codigo} no existe`
            })
        }
        
        alternativa = await Alternativa.destroy({
            where: {
                codigo
            }
        });

        
        res.json({
            msg: 'Alternativa eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosAlternativa = async (req, res) => {

    try {
        
        const {codigo} = req.params
        
        const alternativa = await Alternativa.findByPk(codigo);
        if(!alternativa){
            return res.status(404).send({
                msg: `La alternativa ${codigo} no existe`
            })
        }
        
        res.json({
            alternativa
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}