const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    static async register(req, res) {
        const {name, email, phone, password, confirmpassword} = req.body

        // validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }
        
        if (!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }
        
        if (!phone) {
            res.status(422).json({message: 'O número de telefone é obrigatório'})
            return
        }
        
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória'})
            return
        }
        
        if (!confirmpassword) {
            res.status(422).json({message: 'Necessário confirmar senha'})
            return
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
        
        // get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body
        let image = ''

        // validations
        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        user.name = name
        
        if (!email) {
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        // check if email is linked to a existent user
        const userExists = await User.findOne({email: email})
        if (user.email !== email && userExists) {
            res.status(422).json({message: 'Por favor, utilize outro email'})
            return
        }

        user.email = email
        
        if (!phone) {
            res.status(422).json({message: 'O número de telefone é obrigatório'})
            return
        }

        user.phone = phone
        
        if (password != confirmpassword) {
            res.status(422).json({message: 'As senhas não conferem'})
            return
        }
        else if (password === confirmpassword && password != null) {

            //create password
            const salt = await bcrypt.genSalt(12)
            const passswordHash = await bcrypt.hash(password, salt)

            user.password = passswordHash
        }
        try {
            await User.findOneAndUpdate(
                {_id: user.id},
                {$set: user},
                {new: true}
            )

            res.status(200).json({message: 'Usuário atualizado com sucesso'})
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}
