const express = require('express')
const app = express()
const session = require('express-session')
require('dotenv').config()
require('./src/config/db')

const apiRouter = require('./src/router/api-router')

app.use(session({
   name: 'falhub.com',
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: (1000 * 60 * 100)
   } 
}))

app.use(
   express.urlencoded({
      extended: true
   })
)
app.use(express.json())
app.use('/api', apiRouter)


app.listen(3000, () => { console.log('3000 portu dinlemede') })