// Imports
const express     = require('express');
const bodyParser  = require('body-parser');
const apiRouter   = require('./apiRoutes').router;
const cors        = require('cors');

// Instantiate server
const server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());


// Configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('ok');
});

server.use('/api/', apiRouter);

// Launch server
server.listen(8000, function() {
    console.log('Server en écoute Port 8000:)');
});
