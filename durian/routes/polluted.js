const express = require('express');
const router = express.Router();

const keys = {};

// http://localhost:3000/polluted?key=__proto__&val[toString]=1
router.get('/polluted', function(req, res) {
  // console.log("Query %o", req.query);

  const userKey = req.query.key;
  const userVal = req.query.val;

  keys[userKey] = userVal;
  // console.log("Keys %o", keys);
  // Object.assign(Object.constructor.prototype, keys);
  // console.log("proto %o", Object);


  res.render('polluted', { title: 'Polluted', keys: JSON.stringify(keys, null, 2)});
});


module.exports = router;
