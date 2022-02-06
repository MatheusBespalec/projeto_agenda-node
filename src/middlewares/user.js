module.exports.user = (req, res, next) => {
    res.locals.user = req.session.user
    next()
}

module.exports.isLogged = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login')
    next()
}

module.exports.isGuest = (req, res, next) => {
    if (req.session.user) return res.redirect('/')
    next()
}