// é aqui que vai ser configurado o servidor express

const express = require('express');
const path = require('path');
const Youch = require('youch');
const Sentry = require('@sentry/node');
require('express-async-errors');
const routes = require('./routes');
const sentryConfig = require('./config/sentry');


class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  };

  middlewares() {
    this.server.use(express.json());

    // acessar arquivos estaticos, ex.: Imagens
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  };

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  };

  //Da uma tratativa nas mensagens de erros, para dar uma visualização melhor para o desenvolvedor. Igual o GraphQL
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  };
};

module.exports = new App().server;