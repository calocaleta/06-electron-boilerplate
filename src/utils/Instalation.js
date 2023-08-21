import React, { useState, useEffect } from 'react';

function selectDirectory() {
    window.ipcRenderer.send('create-dir', 'EJEMPLO01');
}

const makeDir = (name) => {
    fs.mkdir(name, { recursive: true }, (error) => {
        if (!error) {
            console.error(error)
        }
    });
}

const makeFile = (name,content) => {
    fs.writeFile(name, content, (error) => {
        if (!error) {
            console.error(error)
        }
    });
}

const createStructure = (path) => {
    console.log('Directorio seleccionado:', path);

    makeDir(`${path}/EJEMPLO01`);
    makeDir(`${path}/EJEMPLO01/ejemplo02`);
    makeDir(`${path}/EJEMPLO01/ejemplo03`);
    makeFile(`${path}/EJEMPLO01/ejemplo03/ejemplo04.txt`, 'Hola mundo!');
    makeFile(`${path}/EJEMPLO01/ejemplo02/archivo.js`, `const fs = require('fs');
    import React from 'react'
    
    const makeDir = (name) => {
        fs.mkdir(name, { recursive: true }, (error) => {
            if (error) {
                console.error('Ocurrió un error al crear el directorio:', error);
            } else {
                console.log('Directorio creado con éxito.');
            }
        });
    }`);
}


const Instalation = () => {
    const [installationStatus, setInstallationStatus] = useState('Not Installed');

    useEffect(() => {
        if (window.ipcRenderer) {
            window.ipcRenderer.on('create-dir-response', (event, data) => {
                if (data.success) {
                    setInstallationStatus('Installed');
                } else {
                    setInstallationStatus('Failed: ' + data.error);
                }
            });
    
        }
        
        return () => {
            // Cleanup to avoid memory leaks
            window.ipcRenderer.removeAllListeners('create-dir-response');
        };
    }, []);


    return (
        <div>
            <button onClick={selectDirectory}>Start Installation</button>
            <div>{installationStatus}</div>
        </div>
    )
}

export default Instalation