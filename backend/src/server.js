const app = require('./app')
const mongoose = require('mongoose')

//Conecção com BD 
mongoose.connect(`mongodb+srv://Aguiar:pedigree821@cluster0-m7gxb.mongodb.net/gobarder?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Database connected!'))


app.listen(3333)
console.log(`Executando em http://localhost:3333`)