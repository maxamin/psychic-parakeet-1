const {createReadStream, createWriteStream} = require('fs');

// const unzip = require('unzip');
const unzip = require('unzipper');

createReadStream('./public/zip-slip.zip')
  .pipe(unzip.Parse())
  .on('entry', function (entry) {
    const fileName = entry.path;
    // console.log(fileName);

    if (fileName.indexOf('..') === -1) {
      entry.pipe(createWriteStream(fileName));
    } else {
      console.log(fileName)
    }
    // entry.pipe(fs.createWriteStream(fileName));
  });
