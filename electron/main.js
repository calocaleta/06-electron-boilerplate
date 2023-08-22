const { app} = require('electron');
const createMainWindow = require('./windows/mainWindow');
const registerIpcHandlers = require('./icpHandlers');

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

registerIpcHandlers();


/* ipcMain.on('create-structure', (event, basePath) => {
  try {
    makeDir(`${basePath}/EJEMPLO01`);
    makeDir(`${basePath}/EJEMPLO01/ejemplo02`);
    makeDir(`${basePath}/EJEMPLO01/ejemplo03`);
    makeFile(`${basePath}/EJEMPLO01/ejemplo03/ejemplo04.txt`, 'Hola mundo!');
    makeFile(`${basePath}/EJEMPLO01/ejemplo02/archivo.js`, `const fs = require('fs');`);

    event.sender.send('create-dir-response', { success: true });
  } catch (error) {
    console.error(error);
    event.sender.send('create-dir-response', { success: false, error: error.message });
  }
  
});

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
      properties: ['openDirectory']
  }).then(result => {
      if (!result.canceled) {
          console.log("Dialog Result:", result.filePaths[0]);
          event.sender.send('selected-directory', result.filePaths[0]);
      }
  }).catch(err => {
      console.log(err);
  });
}); */