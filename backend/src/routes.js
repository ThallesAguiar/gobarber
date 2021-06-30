const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');


// Importação de controllers
const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');
const FileController = require('./app/controller/FileController');
const ProviderController = require('./app/controller/ProviderController');
const AppointmentController = require('./app/controller/AppointmentController');
const ScheduleController = require('./app/controller/ScheduleController');
const NotificationController = require('./app/controller/NotificationController');
const AvailableController = require('./app/controller/AvailableController');


// importando middlewares
const authMiddleware = require('./app/middlewares/auth');


const routes = new Router();
const upload = multer(multerConfig);



routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// este middleware somente irá valer o que tiver abaixo dele.(Esta forma é global)
// pode tbm declarar estes meddlewares localmente.
// Middleware de autenticaçao que retorna o id do usuario logado
routes.use(authMiddleware);


routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);


routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:_id', AppointmentController.delete);


routes.get('/schedule', ScheduleController.index);


routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:_id', NotificationController.update);


routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;