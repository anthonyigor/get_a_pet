const router = require('express').Router()

const PetController = require('../controllers/PetController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

router.get('/', PetController.getPets)
router.post('/create', verifyToken, imageUpload.array('images'), PetController.createPet)
router.get('/:id', PetController.getPet)
router.delete('/:id', verifyToken, PetController.deletePet)
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.editPet)
router.get('/mypets', verifyToken, PetController.getUserPets)
router.get('/myadoptions', verifyToken, PetController.getUserAdoptions)

module.exports = router