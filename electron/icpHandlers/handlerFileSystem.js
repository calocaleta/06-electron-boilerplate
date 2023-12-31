const fs = require('fs');
const path = require('path');

const makeFile = (event, {currentPath, newFile, content}) => {
    fs.writeFile(path.join(currentPath, newFile), content, (error) => {
        if (error) {
            event.sender.send('create-file-response', { success: false, error: error.message });
        } else {
            event.sender.send('create-file-response', { success: true });
        }
    });
};

const readFile = async (event, {currentPath, file}) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(currentPath, file), 'utf8', (error, data) => {
            if (error) {
                reject({ success: false, error: error.message });
            } else {
                resolve({ success: true, data });
            }
        });
    });
};

const makeDir = (event, {currentPath, newPath}) => {
    fs.mkdir(path.join(currentPath, newPath), { recursive: true }, (error) => {
        if (error) {
            event.sender.send('create-dir-response', { success: false, error: error.message });
        } else {
            event.sender.send('create-dir-response', { success: true });
        }
    });
};

module.exports = {
  makeFile,
  makeDir,
  readFile,
};