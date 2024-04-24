//cargue la conexion del grupo MySQL
const { response, request } = require('express');
const pool =  require('../data/config'); 

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
        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send('user added with ID: ${result.insertId}');
        });
    });
    //actualizar un usuario existente 
    app.put('/users/:id', (request, response) => {
        const id = request.params.id; 

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