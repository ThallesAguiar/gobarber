const { Schema, model } = require('mongoose')

const NotificationSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
});

module.exports = model('Notification', NotificationSchema);