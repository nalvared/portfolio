const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const pug = require('pug');
const http = require('http');
const https = require('https');
const fs = require('fs');
const i18n = require("i18n");

/**
 * Configure HTTPS credentials thanks to use Let's Encrypt
 */

const credentials = {
  key: fs.readFileSync('/etc/letsencrypt/live/cv.nalvared.com-0002/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cv.nalvared.com-0002/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/cv.nalvared.com-0002/chain.pem')
};

// Creating express APP
const app = express();

/**
 * Configure server
 */
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// i18n for intenationalization
i18n.configure({
  locales: ['en','es'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  objectNotation: true
});
app.use(i18n.init);

// Routes
app.get('/', (req, res) => {
    res.render("home");

});

/**
 * Launching
 */
var httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
});

var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
  console.log('Application is running in non-safe mode over the port 8080');
  console.log('All traffic will be redirect to https server');
});

httpsServer.listen(8443, () => {
  console.log('Application is running in safe mode over the port 8443');
});
