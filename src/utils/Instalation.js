import React, { useState, useEffect } from 'react';



const Instalation = () => {
    const [selectedPath, setSelectedPath] = useState("");

    const openDialog = () => {
        window.ipcRenderer.send('open-file-dialog');
    };

/*     const path=''
    makeDir(`${path}EJEMPLO01`);
    makeDir(`${path}EJEMPLO01/ejemplo02`);
    makeDir(`${path}EJEMPLO01/ejemplo03`);
    makeFile(`${path}EJEMPLO01/ejemplo03/ejemplo04.txt`, 'Hola mundo!');
    makeFile(`${path}EJEMPLO01/ejemplo02/archivo.js`, `const fs = require('fs');`); */

    const createStructure = () => {
        window.ipcRenderer.send('create-structure', selectedPath);
    }


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
            <button onClick={createStructure}>Crear Estructura</button>
            <button onClick={openDialog}>Seleccionar Directorio</button>
            <p>Directorio seleccionado: - {selectedPath} -</p>
            Instalado!
        </div>
    )
}

export default Instalation