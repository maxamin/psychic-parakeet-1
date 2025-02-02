const xpath = require('xpath');
const {DOMParser, XMLSerializer} = require('xmldom');

const express = require('express');
const router = express.Router();

const users = `
<?xml version="1.0" encoding="UTF-8"?>
<users>
<user>
<userid>joe</userid>
<email>joe@example.com</email>
<password>123456</password>
</user>
<user>
<userid>bill</userid>
<email>bill@example.com</email>
<password>password</password>
</user>
<user>
<userid>tom</userid>
<email>tom@example.com</email>
<password>password123</password>
</user>
<user>
<userid>admin</userid>
<email>admin@example.com</email>
<password>root</password>
</user>
</users>
`;

const doc = new DOMParser().parseFromString(users);
// const serializer = new XMLSerializer()

// http://localhost:3000/xpath?userid=%27%20or%20%271%27=%271
router.get('/xpath', function(req, res) {

    const userid = req.query.userid;

    // const query = xpath.parse("//user[userid/text()=$userid]");
    const query = xpath.parse("//user[userid/text()='" + userid + "']");

    const element = query.select({
            node: doc,
            variables: {
                userid: userid
            }
        });

    res.render('xml', {title: 'XPath Query Results', result: element.toString()})
});


// // currently doesnt work
// router.post('/xxe', (req, res) => {

//   const xml = req.body.xml;
//   const doc = new DOMParser().parseFromString(xml);

//   // console.log(doc)

//   res.send(serializer.serializeToString(doc));
// })

module.exports = router;
