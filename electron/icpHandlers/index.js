const { ipcMain } = require('electron');
const fileSystemHandlers = require('./fileSystemHandlers');
const dialogHandlers = require('./dialogHandlers');

function registerIpcHandlers() {
  ipcMain.on('create-structure', fileSystemHandlers.createStructure);
  ipcMain.on('open-file-dialog', dialogHandlers.openDialog);
  
}

module.exports = registerIpcHandlers;