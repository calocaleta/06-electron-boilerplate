import React, { useState, useEffect } from 'react';
import { executeCommand, executeCommands } from '../handlers';

const Instalation = () => {
    const [selectedPath, setSelectedPath] = useState("");

    const openDialog = () => {
        window.ipcRenderer.send('open-file-dialog');
    };

    const createStructure = () => {
        window.ipcRenderer.send('make-dir', { newPath: 'EJEMPLO01', currentPath: selectedPath});
        window.ipcRenderer.send('make-dir', { newPath: 'EJEMPLO02', currentPath: selectedPath});
        window.ipcRenderer.send('make-dir', { newPath: 'EJEMPLO01/ejemplo03', currentPath: selectedPath});
        window.ipcRenderer.send('make-dir', { newPath: 'EJEMPLO01/ejemplo02', currentPath: selectedPath});
        window.ipcRenderer.send('make-file', { newFile: 'EJEMPLO01/ejemplo02/ejemplo04.txt', content: 'Hola mundo!',currentPath: selectedPath});
        window.ipcRenderer.send('make-file', { newFile: 'EJEMPLO01/ejemplo03/archivo.js', content: `const fs = require('fs');
        //ejemplo`,currentPath: selectedPath});
    }

    const onClick = async () => {
        const commands = [
            'npm init -y',
            'npm install electron',
            'npm install tailwindcss autoprefixer postcss-cli',
            'npx tailwindcss init',
            'npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli webpack-dev-server',
            'npm install react react-dom'
          ];
        await executeCommand('npm -v', selectedPath);
        await executeCommands(commands, selectedPath);
          
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
                onClick={onClick}>
                    Ejecuta comando!
            </button>
            <button onClick={createStructure}>Crear Estructura</button>
            <button onClick={openDialog}>Seleccionar Directorio</button>
            <p>Directorio seleccionado: - {selectedPath} -</p>
            Instalado!
        </div>
    )
}

export default Instalation