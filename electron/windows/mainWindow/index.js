const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../../preload/index.js')
    }
  });
  win.webContents.openDevTools();
  win.setMenu(null);
  win.loadFile('./public/index.html');
}

module.exports = createMainWindow;