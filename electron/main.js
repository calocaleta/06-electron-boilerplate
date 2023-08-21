const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Establece esto a 'false'
      contextIsolation: true,
      preload: 'preload.js'
    }
  });
  win.webContents.openDevTools();
  win.setMenu(null);
  win.loadFile('./public/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('create-dir', (event, dirName) => {
  fs.mkdir(dirName, { recursive: true }, (error) => {
      if (error) {
          event.sender.send('create-dir-response', { success: false, error: error.message });
      } else {
          event.sender.send('create-dir-response', { success: true });
      }
  });
});
