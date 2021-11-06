const fs = require('fs');
const path = require('path');


async function buildHtml() {

  // Copy asset

  function copyAsset() {

    let pathOfSource = path.join(__dirname, "assets");
    let pathOfTarget = path.join(__dirname, "project-dist");

    fs.readdir(pathOfSource, { withFileTypes: true }, (err, folders) => {

      if(err) {
        return console.error(err);
      }

      folders.map(folder => {
        if(!folder.isFile()) {

          fs.mkdir(`${pathOfTarget}/assets/${folder.name}`, { recursive: true }, (err) => {
            if(err) {
              console.log("Error Found:", err);
            }
          })

          fs.readdir(`${pathOfSource}/${folder.name}`, { withFileTypes: true }, (err, files) => {
            if(err) {
              console.log("Error Found:", err);
            }
            files.map(file => {

              fs.copyFile(`${pathOfSource}/${folder.name}/${file.name}`, `${pathOfTarget}/assets/${folder.name}/${file.name}`, (err) => {
                if(err) {
                  console.log("Error Found:", err);
                }
              })
            })
          })
        }
      })
    })
  }

  let pathOfTarget = path.join(__dirname, "project-dist/assets");

  await fs.promises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true })
  await fs.promises.mkdir(pathOfTarget, { recursive: true })

  copyAsset()

  // Make styles

  let pathOfSourceS = path.join(__dirname, "styles");
  let pathOfTargetS = path.join(__dirname, "project-dist", "style.css");

  fs.stat(path.join(__dirname, "project-dist", "style.css"), err => {
    if(!err) {
      fs.unlink(path.join(__dirname, "project-dist", "style.css"), err => {
        if(err) {
          console.log(err);
        }
      });
    } else {
      fs.readdir(pathOfSourceS, { withFileTypes: true }, (err, files) => {
        if(err) {
          return console.error(err);
        } else {
          files.map(el => {
            if(el.isFile() === true) {
              let info = el.name.split(".")
              if(info[1] === "css") {

                fs.readFile(`${pathOfSourceS}/${el.name}`, "utf8", (err, style) => {
                  fs.appendFile(pathOfTargetS, `${style}`, function (error) {
                    if(error) throw error
                  })
                });
              }
            }
          })
        }
      })
    }
    fs.readdir(pathOfSourceS, { withFileTypes: true }, (err, files) => {
      if(err) {
        return console.error(err);
      } else {
        files.map(el => {
          if(el.isFile() === true) {
            let info = el.name.split(".")
            if(info[1] === "css") {

              fs.readFile(`${pathOfSourceS}/${el.name}`, "utf8", (err, style) => {
                fs.appendFile(pathOfTargetS, `${style}`, function (error) {
                  if(error) throw error
                })
              });
            }
          }
        })
      }
    })
  })

  // Build HTML 


  let readableStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf8'
  )
  
  let writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
  
  readableStream.pipe(writeableStream)


  let fileIndex = await fs.promises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf8'); 
  const change = fileIndex.match(/{{[a-z]+}}/g);

  for (el of change) {
    const name = el.slice(2,-2);
    const newContent = await fs.promises.readFile(path.join(__dirname, 'components', `${name}.html`), 'utf8'); 
    const curfileIndex = await fs.promises.readFile(path.resolve(__dirname, 'project-dist', 'index.html'), 'utf8');
    let newfileIndex = curfileIndex.replace(el, newContent);
    await fs.promises.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), newfileIndex);
  }
}

buildHtml()










