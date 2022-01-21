const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    // TODO: Delete me
    myPong() {
      console.log('pong -- mason');
    },
    // TODO: Delete me
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    updateItem(itemUpdates) {
      ipcRenderer.send('update-item', itemUpdates);
    },
    on(channel, func) {
      /*
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
      */

      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners(channel, cb) {
      ipcRenderer.removeAllListeners(channel, cb);
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
