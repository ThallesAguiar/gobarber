const userModel = require('../model/User');
const appointmentModel = require('../model/Appointment');

const { startOfDay, endOfDay, parseISO } = require('date-fns');


class ScheduleController {

    async index(req, res) {
        const checkUserProvider = await userModel.find({ _id: req.userId, provider: true });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const { date } = req.query;
        const parsedDate = parseISO(date)

        const Appointments = await appointmentModel.find({
            provider: req.userId,
            canceled_at: null,
            date: {
                $gt: startOfDay(parsedDate),
                $lt: endOfDay(parsedDate)
            }
        }, {/**Atributos pra retorno */ },
            {
                sort: { date: 1 }
            });

        return res.json(Appointments);
    }

}

module.exports = new ScheduleController();