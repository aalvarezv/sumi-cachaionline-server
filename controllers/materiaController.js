const {Materia} = require('../config/db');


exports.crearMateria = async (req, res) =>{

    try{

        const {codigo, descripcion} = req.body;

        let materia = await Materia.findByPk(codigo);
        if(materia) {
            console.log('La materia ya existe');
            return res.status(400).json({
                msg: 'La materia ya existe'
            });        
        }

        materia = await Materia.create({
            codigo,
            descripcion
        });

        res.json({
            materia
        })

    }catch(error){
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error'
        })
    }
}

exports.listarMaterias = async (req, res) =>{
   
    try{
        const materia = await Materia.findAll();
        res.json({
            materia
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarMaterias = async (req, res) =>{

    try{

        const {codigo, descripcion} = req.body;

        let materia = await Materia.findByPk(codigo);
        if(!materia){
            return res.status(404).send({
                msg: `La materia ${codigo} no existe`
            })
        }

        materia = await Materia.update({
            descripcion
        },{ where: {
            codigo
        }})

        res.json({
            msg: "Materia actualizada existosamente"
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarMaterias = async (req, res) =>{

    try{
        const {codigo} = req.params;
        let materia = await Materia.findByPk(codigo);
        if(!materia){
            return res.status(404).send({
                msg: `La materia ${codigo} no existe`
            })
        }


        materia = await Materia.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Materia eliminada exitosamente'
        });

    } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosMaterias = async (req, res) =>{

    try{
        const {codigo} = req.params

        const materia = await Materia.findByPk(codigo);

        if(!materia){
            return res.satus(404).send({
                msg: `La materia ${codigo} no existe`
            })
        }
        res.json({
            materia
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}