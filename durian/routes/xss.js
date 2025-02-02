const express = require('express');
const router = express.Router();

// http://localhost:3000/xss?poc=<svg/onload=alert()>
router.get('/xss', function(req, res) {
    res.send(req.query.poc + '');
});

const stored = [];

// http://localhost:3000/stored/get
router.get('/store/get', function(req, res) {
    const id = parseInt(req.query.index);
    res.json(stored);
});

// http://localhost:3000/stored/get/:id
router.get('/store/get/:id', function(req, res) {
    const id = parseInt(req.params.id);
    if (id >= stored.length) { return res.end(); }
    res.send(stored[id]);
});

// http://localhost:3000/store/post
router.post('/store/post', function(req, res) {
    const poc = req.body.poc;
    stored.push(poc)
    res.send('Stored your payload');
});


module.exports = router;
