module.exports.checkCsrf = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
        return res.send(err)
        return res.render('errors/csrf', {
            title: 'Erro'
        })
    }
}

module.exports.csrfToken = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}
