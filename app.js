const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const ejsLayout = require("express-ejs-layouts")
require('dotenv').config()
require('./src/config/db')

const apiRouter = require('./src/router/api-router')
const frontRouter = require('./src/router/front-router')
const adminRouter = require('./src/router/admin-router')
const burcApiRouter = require('./src/router/burcapi-router')

app.use(session({
   name: 'falhub.com',
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: (1000 * 60 * 100)
   }
}))
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


app.listen(process.env.PORT || 3000, () => { console.log(process.env.PORT+' dinleniyor') })