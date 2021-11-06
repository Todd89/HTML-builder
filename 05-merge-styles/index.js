const fs = require('fs');
const path = require('path');


let pathOfSource = path.join(__dirname, 'styles',);
let pathOfTarget = path.join(__dirname, "project-dist/bundle.css");

function addBundle() {
  fs.readdir(pathOfSource, { withFileTypes: true }, (err, files) => {
    if(err) {
      return console.error(err);
    } else {
      files.map(el => {
        if(el.isFile() === true) {
          let info = el.name.split(".")
          if(info[1] === "css") {

            fs.readFile(`${pathOfSource}/${el.name}`, "utf8", (err, fileContent) => {
              if(!err) {
                fs.appendFile(pathOfTarget, `${fileContent}`, function (error) {
                  if(error) throw error
                })
              }
            });
          }
        }
      })
    }
  })
}

fs.readFile(pathOfTarget, 'utf8', function (err, data) {
  if(!err) {
    fs.unlink((pathOfTarget), function (err) {
      if(err) {
        console.log(err);
      }
    });
    addBundle()
  } else {
    addBundle()
  }
})