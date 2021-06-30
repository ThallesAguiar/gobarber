const { Schema, model } = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        allowNull: false
    },
    email: {
        type: String,
        allowNull: false,
        unique: true
    },
    password: {
        type: String,
        allowNull: false
    },
    provider: {
        type: Boolean,
        default: false,
        allowNull: false
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        default: null,
    }
},
    {
        timestamps: true, //createdAt, updatedAt. Armazena automatico pelo mongoose dt de criação e atualização
    })

// userSchema.pre('save', function(next){
//     // console.log("passando pelo middleware do model user")
//     const user = this //o this se refere ao esquema atual que estou, que seria o userSchema

//     if(!user.isModified('password')){
//         next()
//     }else{
//         bcrypt.hash(user.password, 10)
//         .then( hash => {
//             user.password = hash
//             next()
//         }).catch(next)
//     }

// })
userSchema.pre('remove', function(next){
    // console.log("passando pelo middleware do model user")
    const user = this //o this se refere ao esquema atual que estou, que seria o userSchema
    console.log(user)
    this.model('Appointment').update({user: user._id},{$set:{user_Deleted: true}});

    if(user._id && user.provider === true) {
        this.model('Appointment').update({user: user._id},{$set:{provider_Deleted: true}});
    }

    next();

})

module.exports = model('User', userSchema)