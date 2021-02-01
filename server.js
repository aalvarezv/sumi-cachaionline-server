const express = require('express')
const cors = require('cors')
const timeout = require('connect-timeout')



//Creamos el servidor.
const app = express()
//Creamos el servidor de socket-
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
})

let mensajes = [];

io.on('connection', socket => {
    console.log('Cliente conectado...');

    socket.on('disconnect', function() {
        console.log('Cliente desconectado!');
    });
    
    
    socket.on('join', data => {
        mensajes.push({mensaje: data})
        socket.emit('mensajeAll', mensajes)
        socket.broadcast.emit('mensajeAll',mensajes)
    });

});


server.listen(4000, err => {
    if(err) throw err
    console.log('socket running on http://localhost:4000')
})

//Time out
app.use(timeout('1d'))

//habilitar cors.
app.use(cors('*'))

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