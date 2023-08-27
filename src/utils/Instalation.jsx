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
            'npm install react react-dom'
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
    <div className="w-full h-screen m-0 p-0 flex flex-col">
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
    content: [
            './public/*.html', './public/*.js',
            './src/*.html', './src/*.js', './src/*.jsx', './src/*.tsx',
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


let result = await readFile('package.json', selectedPath);
        
result = result.data.replace(/"test": "echo \\"Error: no test specified\\" && exit 1"/g, `"build:tailwind": "postcss ./src/tailwind.custom.css -o ./public/styles/style.css --watch",
"build:tailwind-once": "postcss ./src/tailwind.custom.css -o ./public/styles/style.css",
"build": "webpack --mode production",
"start": "webpack --mode production && electron .",
"dev": "webpack serve --mode development"`);
result = result.replace(/"main": "index.js"/g, '"main": "electron/main.js"');
makeFile('package.json', result, selectedPath);
await executeCommand('npm run build:tailwind-once', selectedPath);
await executeCommand('code .', selectedPath);

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

    return (
        <div className="w-full h-screen m-0 p-0 flex flex-col">


        <div className="relative bg-gray-900">
            <div className="relative h-80 overflow-hidden bg-indigo-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
                <img
                className="h-full w-full object-cover object-left"
                src="background.jpg"
                alt=""
                />
                <svg
                viewBox="0 0 926 676"
                aria-hidden="true"
                className="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]"
                >
                <path
                    fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
                    fillOpacity=".4"
                    d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
                />
                <defs>
                    <linearGradient
                    id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
                    x1="926.392"
                    x2="-109.635"
                    y1=".176"
                    y2="321.024"
                    gradientUnits="userSpaceOnUse"
                    >
                    <stop stopColor="#776FFF" />
                    <stop offset={1} stopColor="#FF4694" />
                    </linearGradient>
                </defs>
                </svg>
            </div>
            <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
                <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
                <h2 className="text-base font-semibold leading-7 text-indigo-400">Visual Electron 1.0.0</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Two Step Installation</p>
                <p className="mt-6 text-base leading-7 text-gray-300">
                    This installer will let you set up a clean ElectronJS installation in just two easy steps, complete with libraries for file access, command execution, dialog box management, and even AI API connections. Save time and focus on what really matters - writing code!
                </p>
                <div className="mt-8">
                    <a
                    href="#"
                    className="inline-flex rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    onClick={openDialog}
                    >
                    Select your project folder
                    </a>
                    <a
                    href="#"
                    className="ml-5 inline-flex rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={onClick}
                    >
                    Install Electron
                    </a>
                    <p className='text-white'>Current Path: {selectedPath} </p>
                </div>
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default Instalation