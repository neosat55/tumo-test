const fastify = require('fastify')({
  logger: true
});

fastify.register(require('./src/routes/v1/users'), {prefix: '/v1'});

fastify.listen({port: 3000}, (err, address) => {
  console.log(address);
});