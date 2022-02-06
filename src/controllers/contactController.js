const Contact = require('../models/Contact')

module.exports.create = (req, res) => {
    res.render('contact', {
        title: 'Novo Contato'
    })
}

module.exports.store = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.create()

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('back'))
            return
        }

        req.flash('success', 'O contato de ' + req.body.name + ' foi cadastrado com sucesso')
        req.session.save(() => res.redirect('/'))
    } catch (e) {
        req.flash('errors', ['Erro ao cadastrar contato!'])
        req.session.save(() => res.redirect('back'))
        console.log(e)
    }
}

module.exports.edit = async (req, res) => {
    try {
        const contact = await Contact.find(req.params.id)

        res.render('contact', {
            title: 'Editar Contato',
            contact
        })
    } catch (e) {
        return res.render('errors/404', {
            title: 'Erro 404',
            errorMessage: 'Contato não encontrado'
        })
    }
}

module.exports.update = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.update(req.params.id)

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            return req.session.save(() => res.redirect('back'))
        }

        req.flash('success', 'Contato atualizado com sucesso!')
        return req.session.save(() => res.redirect('/contato/' + req.params.id + '/editar'))
    } catch (e) {
        return res.render('errors/404', {
            title: 'Erro 404',
            errorMessage: 'Contato não encontrado'
        })
    }
    
}

module.exports.destroy = async (req, res) => {
    try {
        await Contact.destroy(req.params.id)

        req.flash('success', 'Contato removido com sucesso!')
        return req.session.save(() => res.redirect('back'))
    } catch (e) {
        req.flash('errors', ['Opss! Houve um erro ao excluir o contato'])
        return req.session.save(() => res.redirect('back'))
    }
    
}