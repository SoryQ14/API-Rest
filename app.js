//Requiere packeages and set the port
const express = require('express'); 
const port = 3002; 
//para permitit manejo de POST y PUT
const bodyParser = require('body-parser'); 
const routes = require('./routes/routes'); 
const app = express(); 

//usar Node.js body parsing middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended:true,
})); 

routes(app); 

//iniciar el servidor 
const server = app.listen(port,(error) =>{
    if (error) return console.log(`Error : ${error}`); 

    console.log(`El servidor  escucha en el puerto ${server.address().port}`); 
}); 