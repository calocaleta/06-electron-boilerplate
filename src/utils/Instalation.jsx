import React, { useState, useEffect } from 'react';
import { executeCommand, executeCommands } from '@utils';
import { makeFile, readFile, makeDir } from '@utils';


const Instalation = () => {
    const [selectedPath, setSelectedPath] = useState("");
  
    const onClick = async () => {
        const commands = [
            'npm init -y',
            'npm install electron',
            'npm install tailwindcss autoprefixer postcss-cli',
            'npx tailwindcss init',
            'npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli webpack-dev-server',
            'npm install react react-dom',
            'code .'
        ];
        await executeCommands(commands, selectedPath);

        makeDir('electron',selectedPath);
        makeFile('electron/main.js', `const { app , ipcMain } = require('electron');
const createMainWindow = require('./windows/mainWindow');
const registerIpcHandlers = require('./icpHandlers');

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    app.quit();
    }
});

registerIpcHandlers();
`,selectedPath);
        makeFile('electron/preload.js', `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel, callback) => {
            ipcRenderer.on(channel, callback);
        },
        exec: async (command, path) => {
            return ipcRenderer.invoke('run-command', command, path);
        }
    }
);
`,selectedPath);
        makeDir('electron/icpHandlers',selectedPath);
        makeFile('electron/icpHandlers/index.js', `const { ipcMain } = require('electron');
const handlerFileSystem = require('./handlerFileSystem');
const handlerDialog = require('./handlerDialog');
const handlerCommand = require('./handlerCommand');

function registerIpcHandlers() {
    ipcMain.on('make-file', handlerFileSystem.makeFile);
    ipcMain.on('make-dir', handlerFileSystem.makeDir);
    ipcMain.on('open-file-dialog', handlerDialog.openDialog);
    ipcMain.handle('run-command', handlerCommand.runCommand);
}

module.exports = registerIpcHandlers;`,selectedPath);
makeFile('electron/icpHandlers/handlerCommand.js', `async function runCommand (event, command, path) {
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
};

module.exports = {
    runCommand
};`,selectedPath);
makeFile('electron/icpHandlers/handlerDialog.js', `const { openFileDialog } = require('../utils/dialog');

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
};`,selectedPath);
makeFile('electron/icpHandlers/handlerFileSystem.js', `const fs = require('fs');
const path = require('path');

const makeFile = (event, {currentPath, newFile, content}) => {
    fs.writeFile(path.join(currentPath, newFile), content, (error) => {
        if (error) {
            event.sender.send('create-file-response', { success: false, error: error.message });
        } else {
            event.sender.send('create-file-response', { success: true });
        }
    });
};

const readFile = (event, {currentPath, file}) => {
    fs.readFile(path.join(currentPath, file), 'utf8', (error, data) => {
        if (error) {
            event.sender.send('read-file-response', { success: false, error: error.message });
        } else {
            event.sender.send('read-file-response', { success: true, data });
        }
    });
};

const makeDir = (event, {currentPath, newPath}) => {
    fs.mkdir(path.join(currentPath, newPath), { recursive: true }, (error) => {
        if (error) {
            event.sender.send('create-dir-response', { success: false, error: error.message });
        } else {
            event.sender.send('create-dir-response', { success: true });
        }
    });
};

module.exports = {
  makeFile,
  makeDir,
};`,selectedPath);

        makeDir('electron/utils',selectedPath);
makeFile('electron/utils/index.js', `export * from './command';
export * from './filesystem';
export * from './dialog';`,selectedPath);
makeFile('electron/utils/command.js', `export const executeCommand = async (command, path) => {
    try {
        const result = await window.ipcRenderer.exec(command, path);
        console.log(result.stdout);
        return result;
    } catch (error) {
        console.error(error.error);
        throw error;
    }
};

export const executeCommands = async (commands, path) => {
    for (const command of commands) {
        try {
            await executeCommand(command, path);
        } catch (error) {
            console.error(error.error);
        }
    }
};`,selectedPath);
makeFile('electron/utils/dialog.js', `const { dialog } = require('electron');

const openFileDialog = (callback) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled) {
            callback(null, result.filePaths[0]);
        } else {
            callback('Dialog cancelled by user.');
        }
    }).catch(err => {
        callback(err);
    });
};

module.exports = {
  openFileDialog
};`,selectedPath);
makeFile('electron/utils/filesystem.js', `export const makeFile = async (newFile, content, currentPath) => {
    try {
        const result = await window.ipcRenderer.send('make-file', { newFile: newFile, content: content,currentPath: currentPath});
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.error);
        throw error;
    }
};

export const readFile = async (file, currentPath) => {
    try {
        const result = await window.ipcRenderer.send('read-file', { file: file, currentPath: currentPath});
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.error);
        throw error;
    }
};

export const makeDir = async (newPath, currentPath) => {
    try {
        const result = await window.ipcRenderer.send('make-dir', { newPath: newPath, currentPath: currentPath});
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.error);
        throw error;
    }

};`,selectedPath);

        makeDir('electron/windows',selectedPath);
        makeDir('electron/windows/mainWindow',selectedPath);
        makeFile('electron/windows/mainWindow/index.js', `const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
    const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../preload.js')
    }
    });
    win.webContents.openDevTools();
    win.setMenu(null);
    win.loadFile('./public/index.html');
}

module.exports = createMainWindow;`,selectedPath);

        makeDir('public',selectedPath);
        makeFile('public/index.html', `<!DOCTYPE html>
<html>
<head>
    <title>Formulario Electron</title>
    <link rel="stylesheet" href="styles/style.css">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
</head>
<body>
    <div id="app"></div>
    <script src="../dist/bundle.js"></script>
</body>
</html>`,selectedPath);
        makeDir('public/styles',selectedPath);

        makeDir('src',selectedPath);
        makeFile('src/index.js', `import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
    <div className="bg-slate-600">
    <h1>APP ELECTRON!</h1>
    </div>
    )
};

    ReactDOM.render(<App />, document.getElementById('app'));`,selectedPath);
         makeFile('src/tailwind.custom.css', `@tailwind base;
@tailwind components;
@tailwind utilities;`,selectedPath);

         makeFile('.babelrc', `{
    "presets": ["@babel/preset-env", "@babel/preset-react"]
}`,selectedPath);
          makeFile('.gitignore', `/node_modules/
node_modules/
dist/`,selectedPath);
          makeFile('postcss.config.js', `module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer')
    ]
}`,selectedPath);
        makeFile('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/*.html', './src/*.js', './src/*.jsx', './src/*.tsx',
            './src/**/*.html', './src/**/*.js', './src/**/*.jsx', './src/**/*.tsx'],
    theme: {
    extend: {},
    },
    plugins: [],
}
        `,selectedPath);
          makeFile('webpack.config.js', `const path = require('path');

module.exports = {
entry: './src/index.js',
output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
},
module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
        loader: 'babel-loader'
        }
    }
    ]
},
resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
    '@utils': path.resolve(__dirname, './electron/utils/'),
    '@electron': path.resolve(__dirname, './electron/'),
    '@public': path.resolve(__dirname, './public/'),
    },
},
target: 'electron-renderer',
};`,selectedPath);
        
    };
    
    const openDialog = () => {
        window.ipcRenderer.send('open-file-dialog');
    };
    
    useEffect(() => {
        const handleDirectorySelected = (event, path) => {
            console.log("Path recibido:", path);
            setSelectedPath(path);
        };
    
        window.ipcRenderer.on('selected-directory', handleDirectorySelected);
    
        return () => {
            window.ipcRenderer.removeListener('selected-directory', handleDirectorySelected);
        };
    }, []);

    const LeeArchivo = async () => {
        const result = await readFile('package.json', selectedPath);
        console.log(result);
    };

    return (
        <div>
            <button
                className="bg-blue-500 border border-blue-700 text-white rounded px-4 py-2 focus:outline-none active:bg-blue-700 active:border-blue-900" 
                onClick={openDialog}>
                    Seleccionar Directorio
            </button>

            <p>Directorio seleccionado: - {selectedPath} -</p>

            <button
                className="bg-blue-500 border border-blue-700 text-white rounded px-4 py-2 focus:outline-none active:bg-blue-700 active:border-blue-900" 
                onClick={onClick}>
                    Ejecuta comando!
            </button>

            <button
                className="bg-blue-500 border border-blue-700 text-white rounded px-4 py-2 focus:outline-none active:bg-blue-700 active:border-blue-900" 
                onClick={LeeArchivo}>
                    Lee archivo!
            </button>
            
        </div>
    )
}

export default Instalation