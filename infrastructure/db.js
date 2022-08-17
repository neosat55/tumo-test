const {dev} = require('../config/db');

const db = require('knex')(dev);

module.exports = {db};