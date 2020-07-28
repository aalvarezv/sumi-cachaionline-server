const {NivelAcademico} = require('../config/db');



exports.crearNivelAcademico = async (req, res) =>{

    try{

        const {codigo, descripcion} = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if(nivelAcademico) {
            console.log('El nivel academico ya existe');
            return res.status(400).json({
                msg: 'El nivel academico ya existe'
            });        
        }

        nivelAcademico = await NivelAcademico.create({
            codigo,
            descripcion
        });

        res.json({
            nivelAcademico
        })

    }catch(error){
        console.log(error);
        res.satus(500).send({
            msg: 'Hubo un error'
        })
    }
}

exports.listarNivelesAcademicos = async (req, res) =>{
   
    try{
        const nivelAcademico = await NivelAcademico.findAll();
        res.json({
            nivelAcademico
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.actualizarNivelAcademico = async (req, res) =>{

    try{

        const {codigo, descripcion} = req.body;

        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if(!nivelAcademico){
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
        }

        nivelAcademico = await NivelAcademico.update({
            descripcion
        },{ where: {
            codigo
        }})

        res.json({
            msg: "Nivel academico actualizado existosamente"
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.eliminarNivelAcademico = async (req, res) =>{

    try{
        const {codigo} = req.params;
        let nivelAcademico = await NivelAcademico.findByPk(codigo);
        if(!nivelAcademico){
            return res.status(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
        }


        nivelAcademico = await NivelAcademico.destroy({
            where: {
                codigo
            }
        });

        res.json({
            msg: 'Nivel academico eliminado exitosamente'
        });

    } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosNivelAcademico = async (req, res) =>{

    try{
        const {codigo} = req.params

        const nivelAcademico = await NivelAcademico.findByPk(codigo);

        if(!nivelAcademico){
            return res.satus(404).send({
                msg: `El nivel academico ${codigo} no existe`
            })
        }
        res.json({
            nivelAcademico
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}