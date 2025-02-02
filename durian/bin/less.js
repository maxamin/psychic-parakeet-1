#!/usr/bin/env node

// const less = require('less');

const fs = require('fs');

const args = process.argv.slice(2);

// console.log(process.argv);
// console.log(args);

// less.render(args.join(' '), {javascriptEnabled: true}, function(error, output) {
//     if (error) { throw error; }
//     console.log(output.css);
// });

console.log(__dirname);
console.log(fs.readFileSync(args.join(' ')));


