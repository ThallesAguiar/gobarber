const { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } = require('date-fns');
const appointmentModel = require("../model/Appointment");

class AvailableController {
    async index(req, res) {

        const { date } = req.query;

        if (!date) return res.status(400).json({ error: 'Invalid date' });

        const searchDate = Number(date);

        const appointments = await appointmentModel.find({
            provider: req.params.providerId,
            canceled_at: null,
            date: {
                $gt: startOfDay(searchDate),
                $lt: endOfDay(searchDate)
            }
        }, {/**Atributos pra retorno */ },
            {
                sort: { date: 1 }
            });

        const schedule = [
            //manhã
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            //tarde
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            //noite
            '18:00',
            '18:30',
            '19:00',
            '19:30',
        ];

        const available = schedule.map(time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0/**este 0 é o valor que estou setando como zero nos segundos. E antes do 0 vem a data e a hora e minuto */);

            /**este RETURN retorna o valores do MAP */
            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"/**formato timestamp, ex.: 2020-06-10T21:00:00-03:00 */),
                available: isAfter(value, new Date())/** <--confere se o horário ja passou */ &&
                    !appointments.find(a => format(a.date, 'HH:mm') === time /** <-- confere se o horário ja não esta marcado. */),
            };
        });

        return res.json(available);
    };
};

module.exports = new AvailableController();