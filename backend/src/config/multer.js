const multer = require('multer')
const crypto = require('crypto')
const { extname, resolve } = require('path')

module.exports = {
    // configuração do multer. Onde ele vai guardar as imagens
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return callback(err)

                return callback(null, res.toString('hex') + extname(file.originalname))
            })
        }
    })
}