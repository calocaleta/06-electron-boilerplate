const fs = require('fs');
import React from 'react'

const makeDir = (name) => {
    fs.mkdir(name, { recursive: true }, (error) => {
        if (error) {
            console.error('Ocurrió un error al crear el directorio:', error);
        } else {
            console.log('Directorio creado con éxito.');
        }
    });
}

const makeFile = (name,content) => {
    fs.writeFile(name, content, (error) => {
        if (error) {
            console.error('Ocurrió un error al crear el archivo:', error);
        } else {
            console.log('Archivo creado con éxito.');
        }
    });
}
    

const Instalation = () => {

    makeDir('EJEMPLO01');

    makeDir('EJEMPLO01/ejemplo02');
    makeDir('EJEMPLO01/ejemplo03');
    makeFile('EJEMPLO01/ejemplo03/ejemplo04.txt','Hola mundo!')
    makeFile('EJEMPLO01/ejemplo02/archivo.js',`const fs = require('fs');
    import React from 'react'
    
    const makeDir = (name) => {
        fs.mkdir(name, { recursive: true }, (error) => {
            if (error) {
                console.error('Ocurrió un error al crear el directorio:', error);
            } else {
                console.log('Directorio creado con éxito.');
            }
        });
    }`)

    return (
        <div>Instalado!</div>
    )
}

export default Instalation