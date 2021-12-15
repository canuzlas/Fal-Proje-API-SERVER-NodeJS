const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
require('dotenv').config()
require('./src/config/db')

const apiRouter = require('./src/router/api-router')
const frontRouter = require('./src/router/front-router')

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
app.use(express.static(path.resolve(__dirname, './src/assets')))

app.use(
   express.urlencoded({
      extended: false
   })
)
app.use(express.json())

app.use('/api', apiRouter)
app.use('/', frontRouter)

app.listen(process.env.PORT || 3000, () => { console.log(process.env.PORT+' dinleniyor') })