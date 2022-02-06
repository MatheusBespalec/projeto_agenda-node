const Contact = require('../models/Contact')

module.exports = async (req, res) => {
    try {
        const contacts = await Contact.all()
        res.render('index', {
            title: 'Agenda',
            contacts
        })
    } catch (e) {
        return res.render('errors/404', {
            title: 'Opss!',
            errorMessage: 'Ocorreu um erro ao buscar contatos'
        })
    }
    
}