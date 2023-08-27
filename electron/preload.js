const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'ipcRenderer', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel, callback) => {
            ipcRenderer.on(channel, callback);
        },
        invoke: (channel, data) => {
          return ipcRenderer.invoke(channel, data);
        },
        exec: async (command, path) => {
            return ipcRenderer.invoke('run-command', command, path);
        }
    }
);
