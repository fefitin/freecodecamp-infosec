const express = require('express');
const helmet = require('helmet');
const app = express();

//Hide powered by header
app.use(helmet.hidePoweredBy());
//X-Frame-Options: DENY to prevent clickjacking (among others)
app.use(helmet.frameguard({ action: 'deny' }));
//X-XSS-Protection to prevent Cross Site Scripting Attacks (all inputs should be sanitized, this is just another protection layer)
app.use(helmet.xssFilter());
//X-Content-Type-Options: nosniff
app.use(helmet.noSniff());
//X-Download-Options: noopen (do not open html files in browser, IE only)
app.use(helmet.ieNoOpen());
//Strict-Transport-Security to force HTTPS
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60, force: true }));
//Disable DNS prefetching (performance penalty)
app.use(helmet.dnsPrefetchControl());
//Disable caching (not related to security, just to try it out)
app.use(helmet.noCache());
//Set Content Security Policy to limit the origin of resources
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
    },
  })
);

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
