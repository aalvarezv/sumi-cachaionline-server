const { Modulo, Unidad } = require('../config/db');

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
