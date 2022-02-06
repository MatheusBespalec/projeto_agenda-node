const express = require('express')
const route = express.Router()
const { isLogged, isGuest } = require('./src/middlewares/user')

// Controllers
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contactController = require('./src/controllers/contactController')

// Rotas
route.get('/', isLogged, homeController)

route.get('/login', isGuest, loginController.index)
route.post('/login', isGuest, loginController.login)
route.post('/register', isGuest, loginController.register)
route.get('/logout', isLogged, loginController.logout)

route.get('/contato', isLogged, contactController.create)
route.post('/contato/register', isLogged, contactController.store)
route.get('/contato/:id/editar', isLogged, contactController.edit)
route.post('/contato/:id/update', isLogged, contactController.update)
route.get('/contato/:id/destroy', isLogged, contactController.destroy)

module.exports = route