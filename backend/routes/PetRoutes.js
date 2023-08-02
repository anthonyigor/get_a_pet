const router = require('express').Router()

const PetController = require('../controllers/PetController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

router.get('/', PetController.getPets)
router.get('/:id', PetController.getPet)
router.post('/create', verifyToken, imageUpload.array('images'), PetController.createPet)
router.delete('/:id', verifyToken, PetController.deletePet)
router.get('/mypets', verifyToken, PetController.getUserPets)
router.get('/myadoptions', verifyToken, PetController.getUserAdoptions)

module.exports = router