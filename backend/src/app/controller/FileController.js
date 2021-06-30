const fileModel = require('../model/File')

class FileController {
    async store(req, res) {

        const { originalname: name, filename: path } = req.file

        const file = await fileModel({ name, path }).save()

        return res.json(file)
    }
}

module.exports = new FileController()