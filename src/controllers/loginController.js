const User = require('../models/User')

module.exports.index = (req, res) => {
    res.render('login', {
        title: 'Login'
    })
}

module.exports.login = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.login()
    
        if (user.errors.length > 0) {
            req.flash('errors', user.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
        req.session.user = user.user
        req.session.save(() => res.redirect('back'))
    } catch (e) {
        req.flash('errors', ['Erro ao fazer login!'])
        req.session.save(() => res.redirect('back'))
        console.log(e)
    }
}

module.exports.register = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.register()
    
        if (user.errors.length > 0) {
            req.flash('errors', user.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
    
        req.session.user = user.user
        req.session.save(() => res.redirect('back'))
    } catch (e) {
        req.flash('errors', ['Erro ao cadastrar usuário!'])
        req.session.save(() => res.redirect('back'))
        console.log(e)
    }
}

module.exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}