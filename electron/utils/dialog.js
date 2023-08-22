const { dialog } = require('electron');

const openFileDialog = (callback) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            callback(null, result.filePaths[0]);
        } else {
            callback('Dialog cancelled by user.');
        }
    }).catch(err => {
        callback(err);
    });
};

module.exports = {
  openFileDialog
};