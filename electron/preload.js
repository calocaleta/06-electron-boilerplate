const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel, callback) => {
            ipcRenderer.on(channel, callback);
        },
        exec: async (command) => {
            return ipcRenderer.invoke('run-command', command);
        }
    }
);