const { openFileDialog } = require('../utils/dialog');

function openDialog(event) {
    openFileDialog((error, filePath) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Dialog Result:", filePath);
            event.sender.send('selected-directory', filePath);
        }
    });
}

module.exports = {
  openDialog
};