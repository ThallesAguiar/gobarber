const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const { resolve } = require('path'); //vai indicar o diretório, onde vai estar o templates de email. Percorrer até os diretórios.
const express_handlebars = require('express-handlebars');
const node_mailer_hdbars = require('nodemailer-express-handlebars');


class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });

        this.configureTemplates();
    };

    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

        this.transporter.use('compile'/**como ele irá compilar os layouts */, node_mailer_hdbars({
            viewEngine: express_handlebars.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs',
            }),
            viewPath,
            extName: '.hbs',
        }));
    };

    sendMail(message) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message,
        })
    }
};

module.exports = new Mail();

