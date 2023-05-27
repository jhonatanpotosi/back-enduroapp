const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      return console.error('Database connection was closed.');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      return console.error('Database credentials error');
    }
    if (err.code === 'ECONNREFUSED') {
      return console.error('Database connection was refused');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      return console.error('Database has to many connections');
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
      return console.error('Database does not exist');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;