/* eslint-disable no-restricted-globals */
const http = require('http');

/**
 *  normalizePort returns a valid port whether provided as string
 *  or number
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || 4000);

/**
 *  errorHandler checks some common system errors and handles them properly
 */

//  create an HTTP server object
const server = http.createServer((req, res) => {
  res.end('server responding');
});

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.log(`${bind} requires elevated priviledges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  console.log(`server listening on ${bind}`);
});
