const express = require('express');
const helmet = require("helmet")
const server = express();

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
// request method, request url, and a timestamp
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] - ${req.method} to ${req.originalUrl} - `)
  next()
}

server.use(helmet())
server.use(express.json())
server.use(logger)
module.exports = server;
