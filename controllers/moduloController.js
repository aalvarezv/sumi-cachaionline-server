const { Modulo, Unidad, NivelAcademico } = require('../config/db');
const { validationResult } = require('express-validator');


exports.crearModulo = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try{
    
        const {codigo, descripcion, codigo_unidad, codigo_nivel_academico} = req.body;

        
        let modulo = await Modulo.findByPk(codigo);
        if (modulo) {
            console.log('El modulo ya existe');
            return res.status(400).json({
                msg: 'El modulo ya existe'
            });
        }


        
        let unidad = await Unidad.findByPk(codigo_unidad);
        if(!unidad){
            console.log('El codigo unidad ingresado no es válido');
            return res.status(400).json({
                msg: 'El codigo unidad ingresado no es válido'
            });
        }

        let nivelAcademico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if(!nivelAcademico){
            console.log('El codigo nivel academico ingresado no es válido');
            return res.status(400).json({
                msg: 'El codigo nivel academico ingresado no es válido'
            });
        }

        modulo = await Modulo.create({
            codigo, 
            descripcion,
            codigo_unidad,
            codigo_nivel_academico
        });

        
        res.json({
            modulo
        });
    
    }catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.listarModulos = async (req, res) => {
    
    try {
        
        const modulos = await Modulo.findAll();
        res.json({
            modulos
        });
       
        res.json({
            modulos
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
    
}

exports.actualizarModulo = async (req, res) => {

    try{

        const {codigo, descripcion, codigo_unidad, codigo_nivel_academico} = req.body;

        
        let modulo = await Modulo.findByPk(codigo);
        if(!modulo){
            return res.status(404).send({
                msg: `El modulo ${codigo} no existe`
            })
        }
        
        let unidad = await Unidad.findByPk(codigo_unidad);
        if(!unidad){
            return res.status(404).send({
                msg: `La unidad ${codigo_unidad} no existe`
            })
        }

        let nivelAcademico = await NivelAcademico.findByPk(codigo_nivel_academico);
        if(!nivelAcademico){
            return res.status(404).send({
                msg: `El nivel academico ${codigo_nivel_academico} no existe`
            })
        }

        
        modulo = await Modulo.update({
                descripcion,
                codigo_unidad,
                codigo_nivel_academico
        },{ where: {
                codigo
        }})

        res.json({
            msg: "Modulo actualizado exitosamente"
        });

     } catch(error){
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}

exports.eliminarModulo = async (req, res) => {

    try{    

        const {codigo} = req.params;
        
        let modulo = await Modulo.findByPk(codigo);
        if(!modulo){
            return res.status(404).send({
                msg: `El modulo ${codigo} no existe`
            })
        }
        modulo = await Modulo.destroy({
            where: {
                codigo
            }
        });

       
        res.json({
            msg: 'Modulo eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }
}

exports.datosModulo = async (req, res) => {

    try {
        const {codigo} = req.params
        
        const modulo = await Modulo.findByPk(codigo);
        
        if(!modulo){
            return res.status(404).send({
                msg: `El modulo ${codigo} no existe`
            })
        }
        
        res.json({
            modulo
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: 'Hubo un error, por favor vuelva a intentar'
        })
    }


}
