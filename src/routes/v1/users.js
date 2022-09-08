const {users} = require('../../services');
const {db} = require('../../../infrastructure/db');
const {MassHistory} = require('../../helpers/history');

module.exports = function(fastify, opts, done) {
  fastify.post('/mass-changes', async(req) => {
    const history = new MassHistory('users', db);
    const {body: {filter, updatee}} = req;

    try {
      return await users.massChanges(filter, updatee, {db, history});
    } catch(e) {
      return {err: e.message}
    }
  });

  done();
};