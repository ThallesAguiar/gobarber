const notificationModel = require('../model/Notification');
const userModel = require('../model/User');

class NotificationController {
    async index(req, res) {
        // check if user logged is a provider
        const isProvider = await userModel.findOne({ _id: req.userId, provider: true });
        if (!isProvider) return res.status(401).json({ error: 'You are not a provider' });


        const notifications = await notificationModel.find({ provider: req.userId }).sort({ createdAt: -1 }).limit(20);

        return res.json(notifications);
    };


    async update(req, res) {
        const notification = await notificationModel.findByIdAndUpdate(
            req.params._id,
            { read: true },
            { new: true }
        );
        return res.json(notification);
    }
}



module.exports = new NotificationController();