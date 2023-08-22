const { app , ipcMain } = require('electron');
const createMainWindow = require('./windows/mainWindow');
const registerIpcHandlers = require('./icpHandlers');

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

registerIpcHandlers();

// Añade el siguiente manejador
ipcMain.handle('run-command', async (event, command) => {
  return new Promise((resolve, reject) => {
      const { exec } = require('child_process'); 
      exec(command, (error, stdout, stderr) => {
          if (error) {
              reject({error: error.message, stdout: null, stderr: stderr});
          } else {
              resolve({error: null, stdout: stdout, stderr: stderr});
          }
      });
  });
});