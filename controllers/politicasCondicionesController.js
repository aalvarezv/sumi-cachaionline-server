const { Configuracion } = require("../database/db")

const getPoliticasCondiciones = (req, res) => {

    try {
        
        const politicas = Configuracion.findOne({
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