const User = require('../models/User')

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

    }

}