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


ipcMain.handle('run-command', async (event, command, path) => {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    const options = path ? { cwd: path } : undefined;

    exec(command, options, (error, stdout, stderr) => {
        if (error) {
            reject({error: error.message, stdout: null, stderr: stderr});
        } else {
            resolve({error: null, stdout: stdout, stderr: stderr});
        }
      });
  });
});