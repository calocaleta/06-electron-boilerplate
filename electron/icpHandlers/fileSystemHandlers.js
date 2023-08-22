const { makeDir, makeFile } = require('../utils/fileSystem');
const path = require('path');

function createStructure(event, basePath) {
    try {
        makeDir(path.join(basePath, 'EJEMPLO01'));
        makeDir(path.join(basePath, 'EJEMPLO01', 'ejemplo02'));
        makeDir(path.join(basePath, 'EJEMPLO01', 'ejemplo03'));
        makeFile(path.join(basePath, 'EJEMPLO01', 'ejemplo03', 'ejemplo04.txt'), 'Hola mundo!');
        makeFile(path.join(basePath, 'EJEMPLO01', 'ejemplo02', 'archivo.js'), `const fs = require('fs');`);

        event.sender.send('create-dir-response', { success: true });
    } catch (error) {
        //callback(error);
        event.sender.send('create-dir-response', { success: false, error: error.message });
    }
}

module.exports = {
  createStructure
};