const app = require('express')()
const cors = require('cors')
const serveStatic = require( "serve-static")

if(process.env.NODE_ENV === 'dev'){
    require('dotenv').config({ path: './.env.development' })
}else{
    require('dotenv').config({ path: './.env.production' })
}

const { sequelize } = require('./database/db')


//puerto de la app.
const PORT = process.env.PORT || 3001
//habilitar express.json.
app.use(require('express').json({ extended: true, limit: '150mb' }))
//habilitar cors.
app.use(cors('*'))
//cargar rutas apirest
app.use(require('./routes/index'))

//path de archivos estaticos.
app.use('/static', serveStatic(process.env.PATH_STATIC));

//socket
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors: {
        origin: '*'
    }
})

const { socketEvents } = require('./sockets')
process.setMaxListeners(10);

io.sockets.on('connection', socket => {

    console.log('Cliente conectado...'+socket.id, io.engine.clientsCount)

    socket.emit("onconnected", data => {
        console.log(data)
    });

    socketEvents(socket)

    socket.on('disconnect', () => {
        console.log('Cliente desconectado! quedan',io.engine.clientsCount)
    });

});

//Inicia el servidor.
server.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT} ${new Date().toLocaleTimeString()}`)

    sequelize.sync({ force: Number(process.env.DB_FORCE) }).then(async() => {

        console.log('Se estableció la conexión a la base de datos')

    })

})
