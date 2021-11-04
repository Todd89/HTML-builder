const fs = require('fs');
const path = require('path');

let paths = path.join(__dirname);
  
 let readableStream = fs.createReadStream(
  `${paths}/text.txt`,
  'utf8'
 );

 readableStream.on('data', function (chunk) {
  console.log(chunk);
});