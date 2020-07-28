const {Unidad, Materia} = require('../config/db');

exports.crearUnidad = async (req, res) =>{

    try{
        const{codigo, descripcion, codigo_materia} = req.body;

        let unidad = await Unidad.findByPk(codigo);
        if(unidad){
            console.log('La unidad ya existe');
            return res.status(400).json({
                msg: 'La unidad ya existe'
            });
        }

        let materia = await Materia.findByPk(codigo_materia);
        if(!materia){
            console.log('La materia ingresada no es valida')
            return res.status(400).json({
                msg: 'la materia ingresada no es valida'
            });
        }

        unidad = await Unidad.create({
            codigo,
            descripcion,
            codigo_materia
        });

        res.json({
            unidad
        });

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error'
        })
    }
}

exports.listarUnidades = async (req, res) =>{

    try{
        const unidad = await Unidad.findAll();
        res.json({
            unidad
        });
    }catch(error){
        console.log(error);
        res.satus(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        })
    }
}

exports.actualizarUnidades = async (req, res) =>{

    try{
        const {codigo, descripcion, codigo_materia} = req.body;

        let unidad = await Unidad.findByPk(codigo);
        if(!unidad){
            return res.status(400).send({
                msg: `La unidad ${codigo} no existe`
            })
        }

        let materia = await Materia.findByPk(codigo_materia);
        if(!materia){
            return res.status(400).send({
                msg: `La materia ${codigo_materia} no existe`
            })
        }

        unidad = await Unidad.update({
            descripcion,
            codigo_materia
        },{ where: {
            codigo
        }})

        res.json({
            msg: "Unidad actualizada exitosamente"
        });

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        })
    }
}

exports.eliminarUnidades = async (req, res) => {

    try{

        const{rut} = req.params;

        let unidad = await Unidad.findByPk(codigo);
        if(!unidad){
            return res.status(404).send({
                msg: `La unidad ${codigo} no existe`
            })
        }
        unidad = await Unidad.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: "Unidad eliminada correctamente"
        });

    }catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        })
    }
}

exports.datosUnidad = async (req, res) => {

    try {
        
        const {codigo} = req.params
        o
        const unidad = await Unidad.findByPk(codigo);
        if(!unidad){
            return res.status(404).send({
                msg: `El usuario ${codigo} no existe`
            })
        }
        //envia la información del usuario
        res.json({
            unidad
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}
