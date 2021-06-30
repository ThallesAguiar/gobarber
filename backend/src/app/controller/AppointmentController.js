const appointmentModel = require('../model/Appointment');
const userModel = require('../model/User');
const notificationModel = require('../model/Notification');
const Yup = require('yup');
const { startOfMinute, parseISO, isBefore, format, subHours } = require('date-fns'); //biblioteca utilitarios de datas JS
const pt = require('date-fns/locale/pt');

const Mail = require('../../lib/Mail');

class AppointmentController {

    async index(req, res) {

        const { page = 1 } = req.query;
        // const pageOptions = {
        //     page: req.query.page || 1,
        //     limit: req.query.limit || 20
        // }

        const appointments = await appointmentModel.find(
            { provider: req.userId, canceled_at: null }, //filtro
            ['_id', 'date', 'past', 'cancelable'], //argumentos que retornarão
            { sort: { date: 1 }, limit: 20, skip: (page - 1) * 20 } //regras e paginação
        ).populate({
            path: 'provider',
            model: 'User',
            select: ['_id', 'name'],
            populate: {
                path: 'avatar',
                model: 'File',
                select: ['_id', 'path', 'url']
            }
        });

        return res.json(appointments);
    };


    async store(req, res) {
        const schema = Yup.object().shape({
            provider: Yup.string().required(),
            date: Yup.date().required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' })
        }

        const { provider: provider_id, date } = req.body

        // Check if provider_id is a provider.
        const isProvider = await userModel.findOne({ _id: provider_id, provider: true })
        if (!isProvider) return res.status(401).json({ error: 'You can only create appointments with providers' })

        // Prevent the provider from making an appointment with himself.
        console.log(isProvider)

        const minutesStart = startOfMinute(parseISO(date));

        // Check for past dates. Confere se a data escolhida pelo usuario é menor que o dia atual.
        if (isBefore(minutesStart, new Date())) return res.status(400).json({ error: 'Past dates are not permitted' })

        // Check date availability
        const checkAvailability = await appointmentModel.findOne({
            provider: provider_id,
            canceled_at: null,
            date: minutesStart
        });

        if (checkAvailability) return res.status(400).json({ error: 'Appointment date is not available' });

        const appointment = await appointmentModel({
            user: req.userId,
            provider: provider_id,
            date: minutesStart
        }).save();

        //Notify appointment provider
        const user = await userModel.findById(req.userId)
        const formattedDate = format(
            minutesStart,
            "dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
        );

        await notificationModel.create({
            content: `Novo agendamento de ${user.name} para o dia ${formattedDate}`,
            provider: provider_id
        });

        return res.json(appointment);
    };


    async delete(req, res) {
        const appointment = await appointmentModel.findById(req.params._id)
            .populate({
                path: 'user',
                model: 'User',
                select: ['name']
            })
            .populate({
                path: 'provider',
                model: 'User',
                select: ['name', 'email'],
            });

        //        Objeto              String
        if (appointment.user._id != req.userId) return res.status(401).json({ error: "You don't have permission to cancel this appointment." });

        // Checks whether the appointment has already been canceled.
        if (appointment.canceled_at) return res.status(401).json({ error: 'This appointment already are canceled.' })

        const dateWithSub = subHours(appointment.date, 2);
        /** EX.:
         * appointment.date: 13:00
         * dateWithSub: 13:00 - 2horas = 11:00
         * now: 11:21h
         * Como o horario já passou das duas horas, o agendamento não pode ser cancelado.
         */
        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'You can only cancel appointments 2 hours in advance.'
            });
        };

        appointment.canceled_at = new Date();

        await appointment.save();

        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado.',
            // uso o template para dizer qual o template que estou usando. Uso o nome do template, e não precisa colocar o .hbs
            template: 'cancellation',
            // context serve para enviar todas as variveis que criei no template(body)
            context: {
                provider: appointment.provider.name,
                client: appointment.user.name,
                date: format(appointment.date, "dd 'de' MMMM', às' H:mm'h'", { locale: pt }),
            }
        });

        return res.json(appointment);
    }
};


module.exports = new AppointmentController();