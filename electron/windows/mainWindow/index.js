const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 620,
    icon: path.join(__dirname, 'icon.png'),
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../../preload.js')
    }
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  //win.webContents.openDevTools();
  win.setMenu(null);
  win.loadFile('./public/index.html');
}

module.exports = createMainWindow;