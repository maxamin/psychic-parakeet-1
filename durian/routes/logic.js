const express = require('express');
const router = express.Router();



// http://localhost:3000/logic
router.get('/lastIndexOf', function(req, res) {
  const host = req.headers.host;
  const origin = req.headers.origin || '';

  let result = "Nope, not local enough";

  if (origin.lastIndexOf('local') || host.lastIndexOf('local')) {
    result = "Yup, very local";
  }

  res.render('logic', {
    host: host,  
    origin: origin,
    result: result
  });
});

function fileExt(filename) {
  return filename.match(/(?<=\.)(txt)/);
}

// http://localhost:3000/logic
router.get('/reanchor', function(req, res) {
  const filename = req.query.filename;

  const exts = ['txt'];

  let allowed = "false";

  const file = fileExt(filename);

  if (exts.includes(file[0])) {
    allowed = "true";
  }

  res.send(allowed);
});



module.exports = router;
