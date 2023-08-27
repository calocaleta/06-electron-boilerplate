export const makeFile = async (newFile, content, currentPath) => {
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
        const result = await window.ipcRenderer.invoke('read-file', { file: file, currentPath: currentPath });
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

};