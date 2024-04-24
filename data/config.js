const mysql = require('mysql'); 

//set database connection creadentials
const config = {
    host: 'localhost', 
    user: 'root', 
    password: '12345', 
    database: 'api',
};

//Create a MySQL pool 
const pool = mysql.createPool(config); 

//Export the pool
module.exports = pool; 