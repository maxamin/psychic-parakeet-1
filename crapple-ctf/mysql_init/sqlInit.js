var authH = require("../core/authHandler.js");
var db = require('../models');

module.exports.initDb = function(){
	db.User.bulkCreate([
	  { name: 'Bossman', login: 'bossman', email: 'bossman@crapple.com', password: authH.createHash('yOuW1ln3v3RgUe55th3Passw0rd'), role: 'admin' },
	  { name: 'Sam', login: 'skirby', email: 'skirby@qualcomm.com', password: authH.createHash('iamsam123'), role: 'null' },
	  { name: 'Bob', login: 'bdylan', email: 'bdylan@crapple.com', password: authH.createHash('afwn49eraiotsj'), role: 'null' },
	  { name: 'Gordan', login: 'gfreeman', email: 'gfreeman@crapple.com', password: authH.createHash('af40tjaworfes'), role: 'null' },
	  { name: 'Rick', login: 'rsanchez', email: 'rsanchez@crapple.com', password: authH.createHash('aw458FADIasn'), role: 'admin' },
	  { name: 'Tyler', login: 'tthecreator', email: 'tthecreator@crapple.com', password: authH.createHash('SGNOI3mfdsdj'), role: 'null' },
	  { name: 'Travis', login: 'tscott', email: 'tscott@crapple.com', password: authH.createHash('ast05jfasmifdj'), role: 'null' }
	]).then(() => { 
	  return db.User.findAll();
	}).then(users => {
	  //console.log(users) // ... in order to get the array of user objects
	});
}

