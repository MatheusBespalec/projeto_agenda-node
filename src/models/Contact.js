const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    created_at: { type: Date, required: false, default: Date.now }
})

const ContactModel = mongoose.model('Contact', ContactSchema)

class Contact {
    constructor(body) {
        console.log(body.phone)
        this.body = {
            name: body.name,
            email: body.email,
            phone: body.phone
        }
        this.errors = []
        this.data = null
    }

    async create() {
        this.validate()
        if (this.errors.length > 0) return

        await this.exists()
        if (this.errors.length > 0) return

        this.data = ContactModel.create(this.body)
    }

    async exists() {
        const contactName = await ContactModel.findOne({ name: this.body.name })
        const contactEmail = await ContactModel.findOne({ email: this.body.email })
        const contactPhone = await ContactModel.findOne({ phone: this.body.phone })
        
        if (contactName) this.errors.push('Já existe um contato com esse nome') 
        if (contactEmail === 'undefined') this.errors.push('Já existe um contato com esse email') 
        if (contactPhone === 'undefined') this.errors.push('Já existe um contato com esse telefone')
    }

    validate() {
        if (this.body.name == '') this.errors.push('O nome é um campo obrigatório')
        if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido')
        if (this.body.phone && this.body.phone.length < 7) this.errors.push('Numero de telefone inválido')
    }

    static async find(id) {
        return await ContactModel.findById(id)
    }

    async update(id) {
        this.validate()
        if (this.errors.length > 0) return
        return await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
    }

    static async all() {
        return await ContactModel.find().sort({ created_at: -1 })
    }

    static async destroy(id) {
        return await ContactModel.findByIdAndDelete(id)
    }
}

module.exports = Contact