require('dotenv').config();

const app = require('./App');

app.set('PORT', process.env.PORT || 3001);

const server = app.listen(app.get('PORT'), ()=>{
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
})