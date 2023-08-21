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
      preload: path.join(__dirname, 'preload.js')
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

const makeFile = (path, content) => {
  fs.writeFile(path, content, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Archivo ${path} creado`);
      }
  });
}

const makeDir = (path) => {
  fs.mkdir(path, { recursive: true }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Directorio ${path} creado`);
      }
  });
}

ipcMain.on('create-structure', (event, basePath) => {
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
});