const { Aggregate } = require('mongoose')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

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
        res.status(200).json({userPets})

    }

    static async getPet(req, res) {
        const id = req.params.id

        // check if the id is a valid ObjecId
        if (!ObjectId.isValid(id)) {
            res.status(422).json({message: "ID inválido!"})
            return
        }
        
        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
        }

        res.status(200).json({pet})

    }

    static async deletePet(req, res) {
        const id = req.params.id

        // check if the id is a valid ObjecId
        if (!ObjectId.isValid(id)) {
            res.status(422).json({message: "ID inválido!"})
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // check if user logged is the pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(String(pet.user._id) !== String(user._id)) {
            res.status(422).json({message: 'Erro ao processar solicitação. Não é possível remover um pet de outro usuário!'})
            return
        }

        await Pet.findByIdAndDelete(id)
        res.status(200).json({message: 'Pet removido com sucesso!'})

    }

    static async editPet(req, res) {
        const id = req.params.id

        const {name, age, weight, color, available} = req.body
        const images = req.files

        const updatedData = {}

        // check if the id is a valid ObjecId
        if (!ObjectId.isValid(id)) {
            res.status(422).json({message: "ID inválido!"})
            return
        }

        // check if pet exists
        const pet = await Pet.findById(id)
        if (!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // check if user logged is the pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if(String(pet.user._id) !== String(user._id)) {
            res.status(422).json({message: 'Erro ao processar solicitação. Não é possível editar um pet de outro usuário!'})
            return
        }

        // validations
        if (!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({message: "A idade é obrigatória!"})
            return
        } else {
            updatedData.age = age
        }
        
        if (!weight) {
            res.status(422).json({message: "O peso é obrigatório!"})
            return
        } else {
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({message: "A cor é obrigatória!"})
            return
        } else {
            updatedData.color = color
        }

        if (images.length === 0) {
            res.status(422).json({message: "A imagem é obrigatória!"})
            return
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        if (pet.adopter) {
            updatedData.available = false
        } 

        // update pet with the new data
        try {
            await Pet.findByIdAndUpdate(id, updatedData)
            res.status(200).json({message: 'Pet atualizado com sucesso'})
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }

}