const { join, extname } = require('path');
const { readdir, mkdir, copyFile, rm  } = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');


const makePage = async () => {

  const folder = join(__dirname, 'project-dist'); 
  const change = /{{[a-z]+}}/g;

const clear = async (clear) => {

  await rm(clear, {recursive: true, force: true});
  await mkdir(clear, { recursive: true });

}

const files = async (item1_1, item1_2, writeStream) => {
  const one = join(item1_1, item1_2);
  const files = await readdir(one, { withFileTypes: true });

  for (const file of files) {

    if (file.isFile()) {
      const type = extname(file.name);
      const oldFile = join(one, file.name);

      if (type === '.css') {

        const readableStream = createReadStream(oldFile, 'utf-8');
        readableStream.on('data', (chunk) => writeStream.write(chunk));
      }
    } else files(one, file.name);
  }
};

const makeContent = async (folder, name) => {

  const fileBundel = join(folder, name); 
  const writeStream = createWriteStream(fileBundel, 'utf-8');
  files(__dirname, 'styles', writeStream);
  
}

const makeAssets = async (item1_1,item1_2, item2_1, item2_2) => {

  const one = join(item1_1, item1_2);
  const two = join(item2_1,item2_2);
  await clear(two);

  const files = await readdir(one, { withFileTypes: true });

  for (const file of files) {

    if (file.isFile()) {
      const oldFile = join(one, file.name);
      const newFile = join(two, file.name);
      await copyFile(oldFile, newFile);
    } else makeAssets(one, file.name, two, file.name);
  }
};

const write = (text) => {

  const linkResult = join(folder, 'index.html');
  const writeStream = createWriteStream(linkResult, 'utf-8');
  writeStream.write(text);
  writeStream.end();

}

const comp = (item) => {

  let nameFile = item.replace('{{', '');
  nameFile = nameFile.replace('}}', '');
  const linkFile = join(__dirname, 'components', `${nameFile}.html`);
  const readableStream = createReadStream(linkFile, 'utf8');

  return readableStream;

}

const HTMLread = () => {

  const linkFile = join(__dirname, 'template.html');
  const readableStream = createReadStream(linkFile, 'utf8');
  let arr = [];
  let textHTML = '';

  readableStream.on('data', (chunk) => {
    arr = chunk.match(change); 
    textHTML = chunk;
  });

  readableStream.on('end', () => {
    arr.forEach((item, i) => {
      const steam = comp(item);
      steam.on('data', (chunk) => {
        textHTML = textHTML.replace(item, chunk);
      });
      steam.on('end', () => {
        if (i === arr.length - 1) write(textHTML);
      });
    });
  });

}

  await clear(folder);
  HTMLread();
  await makeAssets(__dirname, 'assets', folder, 'assets');
  await makeContent(folder, 'style.css');
 
}

makePage();








