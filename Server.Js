const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

mongoose.Promise = global.Promise;
mongoose.connection.on('error',(error)=>{
    console.error(`ERROR: ${error.message}`);
});

const app = require('./App');

app.set('PORT', process.env.PORT || 3001);

const server = app.listen(app.get('PORT'), ()=>{
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
})