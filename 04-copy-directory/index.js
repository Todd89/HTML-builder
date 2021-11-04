const fs = require('fs');
const path = require('path');

function copyDir() {

  let pathOfSource = path.join(__dirname) + "/files";
  let pathOfTarget = path.join(__dirname) + "/files-copy";

  fs.stat(`${pathOfTarget}`, function (err) {
    if(!err) {
      fs.readdir(pathOfTarget, (err, files) => {
        if(err) {
          return console.error(err);
        } else {
          for(let file of files) {
            fs.unlink(`${pathOfTarget}/${file}`, function (err) {
              if(err) {
                console.log(err);
              }
            });
          }
          fs.readdir(pathOfSource, { withFileTypes: true }, (err, data) => {
            data.map(el => {
              if(el.isFile() == true) {
                fs.copyFile(`${pathOfSource}/${el.name}`, `${pathOfTarget}/${el.name}`, (err) => {
                  if(err) {
                    console.log("Error Found:", err);
                  }
                })
              }
            })
          })
        }

      })
    } else {
      fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
        if(err) {
          return console.error(err);
        }
        fs.readdir(pathOfSource, { withFileTypes: true }, (err, data) => {
          data.map(el => {
            if(el.isFile() == true) {
              fs.copyFile(`${pathOfSource}/${el.name}`, `${pathOfTarget}/${el.name}`, (err) => {
                if(err) {
                  console.log("Error Found:", err);
                }
              })
            }
          })
        })
      });
    }
  });
}

copyDir()
