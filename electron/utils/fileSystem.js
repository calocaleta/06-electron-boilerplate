const fs = require('fs');

const makeFile = (path, content) => {
    fs.writeFile(path, content, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log(`Archivo ${path} creado`);
    }
});
}

const makeDir = (path) => {
    console.log('DEBUG02',path);
    fs.mkdir(path, { recursive: true }, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log(`Directorio ${path} creado`);
    }
});
}

module.exports = {
  makeFile,
  makeDir
};