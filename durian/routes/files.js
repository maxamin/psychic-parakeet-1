const {Readable} = require('stream');
const express = require('express');
const router = express.Router();
const {join} = require('path');
const {readdirSync, readFileSync, createWriteStream} = require('fs');
const unzipper = require('unzipper');

const UPLOADS = join(__dirname, '../uploads');

/* GET upload page. */
router.get('/file/upload', function(req, res) {

  const files = readdirSync(UPLOADS).filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

  res.render('upload', { title: 'Upload', files: files});
});

router.post('/file/upload', function(req, res) {
  const file = req.files.file;
  const mvPath = join(UPLOADS, file.name);
  file.mv(mvPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect('/upload');
  });

});

// receive a zip file and unzip it

router.post('/file/zip', (req, res, next) => {
  let file = req.files.file;

  const stream = Readable.from(file.data);

  stream.pipe(unzipper.Parse())
    .on('entry', entry => {
      const fileName = entry.path+'';
      // console.log(fileName.indexOf('..'));
      if (fileName.indexOf('..') == -1) {
        entry.pipe(createWriteStream(fileName));
      }
    });

  res.end();
});

router.get('/file/download/:name', function (req, res, next) {
  var options = {
    root: join(__dirname, '..'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

router.get('/file', (req, res) => {
  const file = req.query.file;
  const path = join(__dirname, file);
  const content = readFileSync(path, {encoding: 'utf8'});
  res.render('file', {
    title: 'File',
    path: path,
    content: content
  })
});

module.exports = router;
