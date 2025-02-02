
const express = require('express');
const router = express.Router();

const {cat, cmd, environ, indirect} = require('./command');
const files = require('./files')
const rce = require('./rce');
const ssti = require('./ssti');
const xml = require('./xml');
const user = require('./user');
const xss = require('./xss');
const ssrf = require('./ssrf');
const openRedirect = require('./open-redirect');
// const polluted = require('./polluted');
// const logic = require('./logic');

// the following is vulnerable to a format string injection. The following places a `NaN` in the logs: `http://localhost:3000/test?format=%f`
router.all('/', function(req, res, next) {
  const ip = req.connection.remoteAddress;
  console.log("URL: " + req.url, ip);
  next();
});



// const vulnerabilities = [{
//     title: "Command Injection",

// }];

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {title: 'Home'});
});



// /* GET lfi. */
// router.get('/lfi', function(req, res) {
//   res.render('lfi', { title: 'Home', file: req.query.file});
// });

// router.use(command);
router.get('/cmd', cmd);
router.get('/cat', cat);
router.get('/environ', environ);
router.get('/indirect', indirect);

router.get('/redirect', openRedirect);

router.use(rce);
router.use(files);
router.use(ssti);
router.use(xml);
router.use(xss);
router.use(ssrf);
router.use(user);
// router.use(polluted);
// router.use(logic);


module.exports = router;
