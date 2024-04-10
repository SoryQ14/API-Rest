var express = require('express'); 
var app = express(); 

app.get('/', function(req, res){
    res.send('Web inicial de mi API, jsjs'); 
}); 

app.get('/saludo', function(req, res){
    res.send('Hola Mundo, :)'); 
}); 

app.get('/despedida', function(req, res){
    res.send('Adios Mundo Cruel, :('); 
}); 

app.listen(3000, function(){
    console.log('Aplicacion ejemplo, escuchando el puerto 3000!');
}); 