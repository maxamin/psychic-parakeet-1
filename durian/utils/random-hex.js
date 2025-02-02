// const crypto = require('crypto');

function randomString(size) {
 if (size === 0) {
  throw new Error('Zero-length randomHexString is useless.');
 }

 // if (size % 2 !== 0) {
 //  throw new Error('randomHexString size must be divisible by 2.');
 // }

 // Math.random().toString(36).substr(2);

 return Math.random().toString(36).substr(2,size);
}



module.exports = randomString;