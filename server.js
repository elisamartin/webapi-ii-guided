const express = require('express');
const hubRoutes = require('./routes');

const server = express();

server.use(hubRoutes);

module.exports = server;
