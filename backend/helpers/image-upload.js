const multer = require('multer')
const path = require('path')

// destination folder settings
const imageStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        let folder = ""

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        }
        else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        callback(null, `public/images/${folder}`)
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer ({
    storage: imageStorage,
    fileFilter(req, file, callback) {
        
        // the regex search for png/jpg in filename
        if (!file.originalname.match(/\.(png|jpg)$/)){
            return callback(new Error('Por favor, faça o upload em formato jpeg ou png.'))
        }
        callback(undefined, true)
    }
})

module.exports = {imageUpload}