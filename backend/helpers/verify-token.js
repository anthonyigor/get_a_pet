const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req, res, next) => {

    // stop if no have authorization token in header
    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    try {
        const verified = jwt.verify(token, 'mysecret')
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({message: 'token inválido!'})
    }

}

module.exports = checkToken