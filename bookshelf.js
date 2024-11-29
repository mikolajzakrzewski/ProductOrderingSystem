const knex = require('knex');
const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

const bookshelf = require('bookshelf')(knex(config[environment]));

module.exports = bookshelf;