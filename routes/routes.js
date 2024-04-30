const { response, request } = require('express');
const { sql, poolPromise } = require('../data/config');

// Ruta de la app
const router = app => {
    // Mostrar mensaje de bienvenida del root
    app.get('/', (request, response) => {
        response.send({
            message: '¡Bienvenido a Node.js Express REST API!'
        });
    });
    // Mostrar todos los usuarios
    app.get('/users', async (request, response) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query('SELECT * FROM users');
            response.send(result.recordset);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            response.status(500).send('Error interno del servidor');
        }
    });

    // Mostrar un solo usuario por id
    app.get('/users/:id', async (request, response) => {
        const id = request.params.id;
        try {
            const pool = await poolPromise;
            const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM users WHERE id = @id');
            response.send(result.recordset);
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            response.status(500).send('Error interno del servidor');
        }
    });

    // Agregar un nuevo usuario
    app.post('/users', async (request, response) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nombre', sql.NVarChar, request.body.nombre) // Cambio de 'username' a 'nombre'
                .input('password', sql.NVarChar, request.body.password)
                .query('INSERT INTO users (nombre, password) VALUES (@nombre, @password)'); // Cambio de 'username' a 'nombre'
            response.status(201).send(`Usuario agregado con ID: ${result.insertId}`);
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            response.status(500).send('Error interno del servidor');
        }
    });

    // Actualizar un usuario existente
    app.put('/users/:id', async (request, response) => {
        const id = request.params.id;
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('nombre', sql.NVarChar, request.body.nombre) // Cambio de 'username' a 'nombre'
                .input('password', sql.NVarChar, request.body.password)
                .query('UPDATE users SET nombre = @nombre, password = @password WHERE id = @id'); // Cambio de 'username' a 'nombre'
            response.send('Usuario actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            response.status(500).send('Error interno del servidor');
        }
    });

    // Eliminar un usuario
    app.delete('/users/:id', async (request, response) => {
        const id = request.params.id;
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM users WHERE id = @id');
            response.send('Usuario eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            response.status(500).send('Error interno del servidor');
        }
    });
};

// Exportar el router
module.exports = router;
