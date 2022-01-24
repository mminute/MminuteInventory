/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import applicationInfo from '../consts/applicationInfo';
import actions from '../consts/actions';
import localStoreKeys from '../consts/localStoreKeys';
import {
  areColumnsValid,
  generateInventoryColumns,
} from '../helpers/csvHelpers';
import InventoryManager from '../Inventory/InventoryManager';

// TODO: Maybe track most recent filePaths for quick access
const localStore = new Store();
const inventory = new InventoryManager();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on(actions.CREATE_NEW_INVENTORY, () => {
  if (mainWindow) {
    dialog
      .showSaveDialog(mainWindow, {
        properties: ['createDirectory', 'showOverwriteConfirmation'],
        buttonLabel: 'Create new inventory',
        filters: [{ name: 'CSV', extensions: ['csv'] }],
      })
      .then(({ filePath }) => {
        if (filePath) {
          const headerRow = generateInventoryColumns();
          fs.writeFile(filePath, headerRow, () => {});
          localStore.set(localStoreKeys.ACTIVE_INVENTORY, filePath);
        }
      })
      .catch(() => {});
  }
});

ipcMain.on(actions.OPEN_EXISTING_INVENTORY, () => {
  if (mainWindow) {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'CSV', extensions: ['csv'] }],
      })
      .then(({ filePaths }) => {
        const filePath = filePaths[0];

        if (filePath) {
          fs.readFile(filePath, (_err, data) => {
            const rows = data.toString().split('\n');
            if (areColumnsValid(rows[0])) {
              inventory.seed(rows.slice(1));
              mainWindow?.webContents.send(
                actions.INVENTORY_INITIALIZED,
                inventory.items,
                inventory.categories,
                inventory.locations
              );
              localStore.set(localStoreKeys.ACTIVE_INVENTORY, filePath);
            }
          });
        }
      })
      .catch(() => {});
  }
});

ipcMain.on(actions.UPDATE_ITEM, (_event, itemUpdates) => {
  inventory.updateItem(itemUpdates);

  mainWindow?.webContents.send(
    actions.INVENTORY_UPDATED,
    inventory.items,
    inventory.categories,
    inventory.locations
  );
});

ipcMain.on(actions.ADD_NEW_ITEM, () => {
  const newItem = inventory.createNewItem();
  mainWindow?.webContents.send(actions.ADD_NEW_ITEM, newItem);
});

ipcMain.on(actions.DELETE_ITEM, (_event, itemId) => {
  inventory.deleteItem(itemId);

  mainWindow?.webContents.send(
    actions.INVENTORY_UPDATED,
    inventory.items,
    inventory.categories,
    inventory.locations
  );
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // fullscreen: true
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

    mainWindow.webContents.send(
      actions.INVENTORY_INITIALIZED,
      inventory.items,
      inventory.categories,
      inventory.locations
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    app.setAboutPanelOptions({
      applicationName: applicationInfo.applicationName,
      applicationVersion: applicationInfo.applicationVersion,
      authors: applicationInfo.authors,
      version: applicationInfo.version,
      website: applicationInfo.website,
    });
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
