const { response, request } = require('express');
const { sql, poolPromise } = require('../data/config');

var sha1 = require('js-sha1');
const { sha256, sha224 } = require('js-sha256');
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
            const Passwordsha256 = encryptPasswordSHA256(request.body.password);
            const Passwordsha1 = encryptPasswordSHA1(request.body.password);
            const Passwordmd5 = encryptPasswordMD5(request.body.password); 
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nombre', sql.NVarChar, request.body.nombre) // Cambio de 'username' a 'nombre'
                .input('password', sql.NVarChar, request.body.password)
                .input('passwordSha1',sql.NVarChar, Passwordsha1)
                .input('passwordSha256', sql.NVarChar,Passwordsha256)
                .input('passwordMd5', sql.NVarChar,Passwordmd5)
                .query('INSERT INTO users (nombre, password, passwordSha1, passwordSha256, passwordMd5) VALUES (@nombre, @password, @Passwordsha256, @Passwordsha1, @Passwordmd5)'); // Cambio de 'username' a 'nombre'
            response.status(201).send(`Usuario agregado con ID: ${result.insertId}`);
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            response.status(500).send('Error interno del servidor');
        }
    });

    // Actualizar un usuario existente
    app.put('/users/:id', async (request, response) => {
        const Passwordsha256 = encryptPasswordSHA256(request.body.password);
        const Passwordsha1 = encryptPasswordSHA1(request.body.password);
        const Passwordmd5 = encryptPasswordMD5(request.body.password); 
        const id = request.params.id;
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('nombre', sql.NVarChar, request.body.nombre) // Cambio de 'username' a 'nombre'
                .input('password', sql.NVarChar, request.body.password)
                .input('passwordSha1',sql.NVarChar, Passwordsha1)
                .input('passwordSha256', sql.NVarChar,Passwordsha256)
                .input('passwordMd5', sql.NVarChar,Passwordmd5)
                .query('UPDATE users SET nombre = @nombre, password = @password, passwordSha1 = @passwordSha1, passwordSha256 = @passwordSha256, passwordMd5 = @passwordMd5 WHERE id = @id'); // Cambio de 'username' a 'nombre'
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
