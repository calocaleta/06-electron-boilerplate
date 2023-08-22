import React, { useState, useEffect } from 'react';


const executeCommand = async (command, path) => {
    try {
        const result = await window.ipcRenderer.exec(command, path);  // Pasar path como segundo argumento
        console.log(result.stdout);
        return result;
    } catch (error) {
        console.error(error.error);
    }
};

const Instalation = () => {
    const [selectedPath, setSelectedPath] = useState("");

    const openDialog = () => {
        window.ipcRenderer.send('open-file-dialog');
    };

    const createStructure = () => {
        window.ipcRenderer.send('create-structure');
    }

    const onClick = async () => {
        try {
            const result = await executeCommand(`npm init -y`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
            const result2 = await executeCommand(`npm install electron`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
            const result3 = await executeCommand(`npm install tailwindcss autoprefixer postcss-cli`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
            const result4 = await executeCommand(`npx tailwindcss init`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
            const result5 = await executeCommand(`npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader webpack webpack-cli webpack-dev-server`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
            const result6 = await executeCommand(`npm install react react-dom`, selectedPath);  // Pasa selectedPath como segundo argumento
            if (result && result.stdout) {
                console.log(result.stdout);
            }
        } catch (error) {
            console.error(error.error);
        }
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
            <button onClick={onClick}>Ejecuta comando</button>
            <button onClick={createStructure}>Crear Estructura</button>
            <button onClick={openDialog}>Seleccionar Directorio</button>
            <p>Directorio seleccionado: - {selectedPath} -</p>
            Instalado!
        </div>
    )
}

export default Instalation