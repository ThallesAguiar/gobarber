const { Schema, model } = require("mongoose");
const { isBefore, subHours } = require('date-fns');

const appointmentSchema = new Schema({
    date: {
        type: Date,
        allowNull: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        allowNull: false
    },
    user_Deleted: {
        type: Boolean,
        default: false
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        allowNull: true
    },
    provider_Deleted: {
        type: Boolean,
        default: false
    },
    canceled_at: {
        type: Date,
        default: null
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

appointmentSchema.virtual('past').get(function () {
    return isBefore(this.date, new Date());
});
appointmentSchema.virtual('cancelable').get(function () {
    return isBefore(new Date(), subHours(this.date, 2));
});

module.exports = model('Appointment', appointmentSchema);