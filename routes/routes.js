//cargue la conexion del grupo MySQL
const { response, request } = require('express');
const pool =  require('../data/config'); 

var sha1 = require('js-sha1');
var { sha256, sha224 } = require('js-sha256');
var md5 = require('md5');

const encryptPasswordSHA1 = (password) => {
    return sha1(password);
};

const encryptPasswordSHA256 = (password) => {
    return sha256(password);
};


const encryptPasswordMD5 = (password) => {
    return md5(password);
};

//Ruta de la app
const router = app =>{
    //Mostrar mensaje de bienvenida del root 
    app.get('/', (request, response)=>{
        response.send({
            menssage: 'Bienvienido a Node.js Express REST API!'
        });
    });
    //Mostrar todos los usuarios 
    app.get('/users', (request, response)=>{
        pool.query('SELECT * FROM users', (error,result)=>{
            if(error) throw error;

            response.send(result);
        });
    });
    //mostrar un solo usuario por id
    app.get('/users/:id', (request, response)=>{
        const id = request.params.id;

        pool.query('SELECT * FROM users WERE id = ?', id, (error, result) => {
            if (error) throw error;
            
            response.send(result);
        });
    });
    //agregar un nuevo usuario
    app.post('/users', (request, response) => {
        const Passwordsha256 = encryptPasswordSHA256(request.body.password);
        const Passwordsha1 = encryptPasswordSHA1(request.body.password);
        const Passwordmd5 = encryptPasswordMD5(request.body.password); 
        
        request.body.passwordSha1 = Passwordsha1;
        request.body.passwordSha256 = Passwordsha256;
        request.body.passwordMd5 = Passwordmd5;
        
        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send('user added with ID: ${result.insertId}');
        });
    });
    //actualizar un usuario existente 
    app.put('/users/:id', (request, response) => {
        const id = request.params.id; 
        const Passwordsha256 = encryptPasswordSHA256(request.body.password);
        const Passwordsha1 = encryptPasswordSHA1(request.body.password);
        const Passwordmd5 = encryptPasswordMD5(request.body.password); 
        
        request.body.passwordSha1 = Passwordsha1;
        request.body.passwordSha256 = Passwordsha256;
        request.body.passwordMd5 = Passwordmd5;

        pool.query('UPDATE users SET ? WHERE id = ?',[request.body, id], (error, result) =>{
            if(error) throw error;

            response.send('User updated succesfully.'); 
        });
    }); 
    //Eliminar un usuario 
    app.delete('/users/:id', (request, response) =>{
        const id = request.params.id; 

        pool.query('DELETE FROM users WHERE id = ?', id, (error,result) =>{
            if (error) throw error; 
            response.send('User deleted.');
        });
    });
}
//Exportar el router 
module.exports = router; 