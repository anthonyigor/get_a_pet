const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

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
            await createUserToken(newUser, req, res)

        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res) {
        const {email, password} = req.body

        //validations
        if (!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }

        // check if user exists
        const user = await User.findOne({email: email})

        if (!user) {
            res.status(422).json({message: 'Não há usuário cadastrado com esse email'})
        }

        // check password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({message: 'Senha inválida'})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser 

        // get user by token
        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'mysecret')
            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {

        const id = req.params.id
        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json({user})

    }

    static async editUser(req, res) {
        res.status(200).json({message: 'Update realizado'})

        return
    }

}
