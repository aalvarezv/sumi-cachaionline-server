const express = require('express')
const cors = require('cors')

//Creamos el servidor.
const app = express()

//habilitar cors.
app.use(cors())

//Puerto de la app.
const PORT = process.env.PORT || 3001

//Habilitar express.json.
app.use(express.json({ extended: true, limit: '150mb' }))

//Import de rutas.
app.use(require('./routes/index'))

//Inicia el servidor.
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT} ${new Date().toLocaleTimeString()}`)
})