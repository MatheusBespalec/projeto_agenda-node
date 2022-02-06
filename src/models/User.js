const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const UserModel = mongoose.model('User', UserSchema)

class User {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }

    async login() {
        this.user = await UserModel.findOne({ email: this.body.email })

        if (! this.user) {
            this.errors.push('E-mail ou senha incorretos!')
            return
        } else if (!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('E-mail ou senha incorretos!')
            return
        }
    }

    async register() {
        this.validate()
        if (this.errors.length > 0) return
        
        await this.userExists()
        if (this.errors.length > 0) return

        const salt = bcrypt.genSaltSync()
        this.body.password = bcrypt.hashSync(this.body.password, salt)

        this.user = UserModel.create(this.body)
    }

    validate() {
        this.cleanUp()
        
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail Inválido')
        if (this.body.name.length < 1) this.errors.push('O nome deve ter mais de 1 caracter')
        if (this.body.password.length < 3 || this.body.password.length > 20) {
            this.errors.push('A senha deve ter de 3 a 20 caracteres')
        }
    }

    async userExists() {
        const user = await UserModel.findOne({ email: this.body.email })
        if (user) this.errors.push('Este e-mail já esta cadastrado!')
    }

    cleanUp() {
        for (let i in this.body) {
            if (typeof this.body[i] != 'string') {
                this.body[i] = ''
            }
        }

        this.body = {
            name: this.body.name,
            email: this.body.email,
            password: this.body.password 
        } 
    }
}

module.exports = User