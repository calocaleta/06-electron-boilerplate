const { ipcMain } = require('electron');
const handlerFileSystem = require('./handlerFileSystem');
const handlerDialog = require('./handlerDialog');
const handlerCommand = require('./handlerCommand');

function registerIpcHandlers() {
  ipcMain.on('make-file', handlerFileSystem.makeFile);
  ipcMain.on('make-dir', handlerFileSystem.makeDir);
  ipcMain.on('open-file-dialog', handlerDialog.openDialog);
  ipcMain.handle('run-command', handlerCommand.runCommand);
}

module.exports = registerIpcHandlers;