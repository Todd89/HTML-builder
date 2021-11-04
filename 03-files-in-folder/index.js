const fs = require('fs');
const path = require('path');

let paths = path.join(__dirname) + "/secret-folder";
let files = [];
fs.readdir (paths,{withFileTypes: true}, (err, data) => {
  data.map (el => {if (el.isFile() == true) {
    let info = el.name.split(".")

      fs.stat(`${paths}/${el.name}`, (error, stats) => {
        console.log (`${info[0]} - ${info[1]} - ${stats.size / 1000}kb`)

      })
    }
  })
});



