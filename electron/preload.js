const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel, callback) => {
            ipcRenderer.on(channel, callback);
        },
        exec: async (command, path) => {
            return ipcRenderer.invoke('run-command', command, path);  // Pasar path como segundo argumento
        }
    }
);
