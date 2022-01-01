const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
const session = require('express-session')
const ejsLayout = require("express-ejs-layouts")
require('dotenv').config()
require('./src/config/db')
const fbdatabase = require('./src/config/firebaseConfig')

//routers
const apiRouter = require('./src/router/api-router')
const frontRouter = require('./src/router/front-router')
const adminRouter = require('./src/router/admin-router')
const burcApiRouter = require('./src/router/burcapi-router')


const sessionMiddleware = session({
   name: 'falhub.com',
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: (1000 * 60 * 100)
   }
})
app.use(sessionMiddleware)
app.use(express.static(path.resolve(__dirname, './src/uploads/usersPhoto')))
app.use(express.static(path.resolve(__dirname, './src/uploads/coffeeFal')))
app.use(express.static(path.resolve(__dirname, './src/assets')))

app.use(
   express.urlencoded({
      extended: false
   })
)
app.use(express.json())

app.use(ejsLayout)
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "src/views"))


app.use('/', frontRouter)
app.use('/api', apiRouter)
app.use('/burc/api', burcApiRouter)
app.use('/staff/admin', adminRouter)

io.use((socket, next) => {
   sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {

   const session = socket.request.session;

   fbdatabase.ref('/spchat/' + session.userId).on('value', (snapshot) => {
      snapshot.forEach(msg => {
         socket.emit('message', { msg: msg.val(), key: msg.key })
      })
   })

   socket.on('disconnect', () => { socket.removeAllListeners("message") })
   socket.on('result', (res) => { send = false })

});

server.listen(process.env.PORT || 3000, () => { console.log(process.env.PORT + ' dinleniyor') })

