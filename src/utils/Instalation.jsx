import React, { useState, useEffect } from 'react';
import { executeCommand, executeCommands } from '@utils';
import { makeFile, makeDir } from '@utils';


const Instalation = () => {
    const [selectedPath, setSelectedPath] = useState("");

    
    const createStructure = () => {
        
        makeDir('EJEMPLO01',selectedPath);
        makeDir('EJEMPLO02',selectedPath);
        makeDir('EJEMPLO01/ejemplo03',selectedPath);
        makeDir('EJEMPLO01/ejemplo02',selectedPath);
        
        makeFile('EJEMPLO01/ejemplo02/ejemplo04.txt', 'Hola mundo!',selectedPath);
        makeFile('EJEMPLO01/ejemplo03/archivo.js', `const fs = require('fs');
        //ejemplo`,selectedPath);
    }
    
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

        makeDir('electron/utils',selectedPath);
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
import Instalation from './utils/Instalation';

const App = () => {
    return (
    <div className="bg-slate-600">
    <Instalation />
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
                onClick={createStructure}>
                    Crear Estructura
            </button>
            
        </div>
    )
}

export default Instalation