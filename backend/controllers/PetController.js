const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const Pet = require('../models/Pet')

module.exports = class PetController {

    static async createPet(req, res) {
        
        const {name, age, weight, color} = req.body
        const available = true
        const images = req.files

        // validations
        if (!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }
        if (!age) {
            res.status(422).json({message: "A idade é obrigatória!"})
            return
        }
        if (!weight) {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        }
        if (!color) {
            res.status(422).json({message: "A cor é obrigatória!"})
            return
        }
        if (images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        }

        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet ({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        // map the image array(req.files) and add only the filenames in database
        images.map((image) => {
            pet.images.push(image.filename)
        })

        // save pet in db
        try {
            const newPet = await pet.save()
            res.status(201).json({message: 'Pet cadastrado com sucesso!', newPet})
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getPets(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        res.status(200).json({pets: pets})
    }

    static async getUserPets(req, res) {
        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        const userPets = await Pet.find({'user._id': user._id}).sort('-createdAt')
        res.status(200).json({userPets: userPets})

    }

    static async getUserAdoptions(req, res) {
        // get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        const userPets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')
        res.status(200).json({userPets: userPets})

    }

}