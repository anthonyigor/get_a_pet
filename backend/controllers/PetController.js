const Pet = require('../models/Pet')

module.exports = class PetController {

    static async createPet(req, res) {
        res.json({message: 'Pet criado!'})
    }

}