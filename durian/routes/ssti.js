const jade = require('jade');
const less = require('less');

const express = require('express');
const router = express.Router();

// http://localhost:3000/jade?templ=pre=JSON.stringify(global.process.env,null,2)
router.get('/jade', function(req, res) {
    res.send(jade.compile(req.query.templ)(req.query.args));
});


// http://localhost:3000/less?style=body{color:`JSON.stringify(global.process.env,null,2)`}
router.get('/less', function(req, res) {
    less.render(req.query.style, {javascriptEnabled: true}, function(error, output) {
        if (error) { throw error; }
        res.render('less', { title: 'Less', userstyle: output.css });
    });
});

module.exports = router;
