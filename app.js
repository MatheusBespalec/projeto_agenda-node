const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const csrf = require('csurf')
const helmet = require('helmet')
const routes = require('./routes')
const { checkCsrf, csrfToken } = require('./src/middlewares/csrf')
const messages = require('./src/middlewares/messages')
const { user } = require('./src/middlewares/user')

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => app.emit('connect_mongo'))
    .catch(e => console.log(e))

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: 'nsaonsdojfnaslncaondalnslkfnao',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}))
app.use(express.urlencoded({ extended: true }))
app.use(csrf())
app.use(flash())
// app.use(helmet())
app.use(checkCsrf)
app.use(csrfToken)
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(messages)
app.use(user)
app.use(routes)

app.on('connect_mongo', () => {
    app.listen('3000', () => console.log('Aplicação rodando na porta 3000'))
})
