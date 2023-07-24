const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController {

    static async register(req, res) {
        const {name, email, phone, password, confirmpassword} = req.body

        // validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
        }
        
        if (!email) {
            res.status(422).json({message: 'O email é obrigatório'})
        }
        
        if (!phone) {
            res.status(422).json({message: 'O número de telefone é obrigatório'})
        }
        
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
        }
        
        if (!confirmpassword) {
            res.status(422).json({message: 'Necessário confirmar senha'})
        }

        if (password !== confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha precisa ser igual a senha informada'})
            return
        }

        const userExists = await User.findOne({email: email})

        if (userExists) {
            res.status(422).json({message: 'Email já cadastrado em outro usuário'})
        }

        // password cryptography
        const salt = await bcrypt.genSalt(12)
        const passswordHash = await bcrypt.hash(password, salt)

        const user = new User ({
            name: name,
            email: email,
            phone: phone,
            password: passswordHash
        })

        // save user in db
        try {
            const newUser = await user.save()
            res.status(201).json({message: 'Usuário cadastrado com sucesso!'})

        } catch (error) {
            res.status(500).json({message: error})
        }
    }

}