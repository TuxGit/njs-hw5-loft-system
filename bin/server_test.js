#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
// const debug = require('debug')('server:serv');
// const socketDebug = require('debug')('socket');
const http = require('http');
// const io = require('socket.io'); -> not work

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(process.env.PORT || '3000');
// server.on('error', onError);
// server.on('listening', onListening);

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError (error) {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   const bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening () {
//   const addr = server.address();
//   const bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }

module.exports = server;
