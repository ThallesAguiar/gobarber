const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
    name: {
        type: String,
        allowNull: false
    },
    path: {
        type: String,
        allowNull: false,
        unique: true
    }
},
    {
        timestamps: true, //createdAt, updatedAt. Armazena automatico pelo mongoose dt de criação e atualização
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    })

fileSchema.virtual('url').get(function () {
    return `http://localhost:3333/files/${this.path}`
})

module.exports = model('File', fileSchema)