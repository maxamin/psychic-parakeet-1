
const express = require('express');
const router = express.Router();

const Secrets = require('../lib/secrets');

// const secret = Math.random().toString(36).substr(2);
const encSec = new Secrets('des-ede3-cbc', 'keyboard cat');

class User {
    constructor(userid, email, password) {
        this.userid = userid;
        this.email = email;
        this.passEnc = encSec.encrypt(password);
    }
}

const users = [];
users.push(new User('joe', 'joe@example.com', 'password'))
users.push(new User('jim', 'jim@example.com', '123456'))

// list all users
router.get('/user', (req, res) => {
    res.json(users);
});

// create a user
router.post('/user', (req, res) => {
    users.push(new User(req.body.userid, req.body.email, req.body.password))
    res.json(users[user.length - 1])
});

// list a user
router.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(id);
});

// update a user
router.patch('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json();
});

// delete a user
router.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json();
});

router.get('/login', (req, res) => {
  const email = req.query.email ;
  const password = req.query.password;

  const index = users.findIndex((user) => {
    return user.email === email && user.passEnc === encSec.encrypt(password);
  })

  if (index) {
    res.send(users[index]);
  } else {
    res.send(new User())
  }
})

module.exports = router;
