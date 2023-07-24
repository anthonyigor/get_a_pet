const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "mysecret")

    res.status(200).json({
        message: 'Autenticação concluída',
        token: token
    })

}

module.exports = createUserToken