const { Configuracion } = require("../database/db")

const getPoliticasCondiciones = async (req, res) => {

    try {
        
        const politicas = await Configuracion.findOne({
            attributes: ['valor'],
            where: {
                seccion: 'POLITICAS',
                clave: 'CONDICIONES',
            }
        })
    
        res.json({
            politicas,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: 'Hubo un error'
        })
    }
   

}

module.exports = {
    getPoliticasCondiciones,
}