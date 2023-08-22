const fs = require('fs');

const makeFile = (filePath, content) => {
    fs.writeFile(filePath, content, (error) => {
        if (error) {
            //callback(error);
        } else {
            //callback(null, `Archivo ${filePath} creado`);
        }
    });
};

const makeDir = (dirPath) => {
    fs.mkdir(dirPath, { recursive: true }, (error) => {
        if (error) {
            //callback(error);
        } else {
            //callback(null, `Directorio ${dirPath} creado`);
        }
    });
};

module.exports = {
  makeFile,
  makeDir
};