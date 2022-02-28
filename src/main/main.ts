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
import actions, { fileActions } from '../consts/actions';
import { defaultFileSettings, localStoreKeys } from '../consts/localStore';
import {
  areColumnsValid,
  generateInventoryColumns,
} from '../helpers/csvHelpers';
import InventoryManager from '../Inventory/InventoryManager';
import { makeGoodreadsRequest } from '../helpers/goodreadsRequest';

const defaults = {
  [localStoreKeys.RECENT_FILES]: [],
  [localStoreKeys.FILE_SETTINGS]: {},
  [localStoreKeys.SECRETS]: {},
};

let inventoryFilepath: string | null = null;
let hasChanges = false;
const localStore = new Store({ defaults });
const inventory = new InventoryManager();

function addToRecentFiles(newPath: string) {
  const recentPaths = Array.from(
    new Set([
      newPath,
      ...(localStore.get(localStoreKeys.RECENT_FILES, []) as Array<string>),
    ])
  );

  if (recentPaths.length > 3) {
    recentPaths.pop();
  }

  localStore.set(localStoreKeys.RECENT_FILES, recentPaths);
}

function setFileSettings(
  newSettings: {
    showArchived?: boolean;
    sortCol?: string;
    sortOrder?: string;
  } | null
) {
  const fileSettings = localStore.get(
    localStoreKeys.FILE_SETTINGS,
    defaultFileSettings
  );

  if (newSettings == null) {
    // We are creating a new file
    fileSettings[inventoryFilepath] = defaultFileSettings;
  } else {
    fileSettings[inventoryFilepath] = {
      ...fileSettings[inventoryFilepath],
      ...newSettings,
    };
  }

  localStore.set(localStoreKeys.FILE_SETTINGS, fileSettings);
}

function setApplicationSettings({
  clearAllApplicationData,
  clearAllFileSettings,
  clearRecentFiles,
  secrets,
}: {
  clearAllApplicationData: boolean;
  clearAllFileSettings: boolean;
  clearRecentFiles: boolean;
  secrets: { goodreadsApiKey: string };
}) {
  // Merge secrets in case we add multiple keys within localStore.secrets
  const existingSecrets = localStore.get(localStoreKeys.SECRETS);
  localStore.set(localStoreKeys.SECRETS, { ...existingSecrets, ...secrets });

  if (clearAllApplicationData) {
    localStore.clear();
    return;
  }

  if (clearAllFileSettings) {
    localStore.set(localStoreKeys.FILE_SETTINGS, {
      [inventoryFilepath]: defaultFileSettings,
    });
  }

  if (clearRecentFiles) {
    localStore.set(localStoreKeys.RECENT_FILES, []);
  }
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

function warnOnUnsavedChanges(
  fn: (mWindow: BrowserWindow) => void,
  mWindow: BrowserWindow,
  actionType: 'new-file' | 'existing-file'
) {
  if (hasChanges) {
    mainWindow?.webContents.send(
      actions.INVENTORY_CHANGE_WITHOUT_SAVE,
      actionType
    );
  } else {
    fn(mWindow);
  }
}

function createNewInventory(mWindow: BrowserWindow) {
  dialog
    .showSaveDialog(mWindow, {
      properties: ['createDirectory', 'showOverwriteConfirmation'],
      buttonLabel: 'Create new inventory',
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    .then(({ filePath }) => {
      if (filePath) {
        const headerRow = generateInventoryColumns();
        fs.writeFile(filePath, headerRow, () => {
          inventory.reset();
          inventoryFilepath = filePath;
          hasChanges = false;
          addToRecentFiles(filePath);
          setFileSettings(null);

          mainWindow?.webContents.send(
            actions.INVENTORY_INITIALIZED,
            inventory.items,
            inventory.categories,
            inventory.locations,
            localStore.get(localStoreKeys.RECENT_FILES),
            localStore.get(localStoreKeys.FILE_SETTINGS)[inventoryFilepath],
            localStore.get(localStoreKeys.SECRETS)
          );

          mainWindow?.webContents.send(actions.INVENTORY_SAVED, hasChanges);
        });
      }
    })
    .catch(() => {});
}

ipcMain.on(actions.CREATE_NEW_INVENTORY, () => {
  if (mainWindow) {
    warnOnUnsavedChanges(
      createNewInventory,
      mainWindow,
      fileActions.NEW_FILE as 'new-file'
    );
  }
});

function openInventoryFile(filePath: string) {
  fs.readFile(filePath, (_err, data) => {
    const rows = data.toString().split('\n');
    if (areColumnsValid(rows[0])) {
      inventory.reset();
      inventory.seed(rows.slice(1));

      inventoryFilepath = filePath;
      addToRecentFiles(filePath);

      mainWindow?.webContents.send(
        actions.INVENTORY_INITIALIZED,
        inventory.items,
        inventory.categories,
        inventory.locations,
        localStore.get(localStoreKeys.RECENT_FILES),
        localStore.get(localStoreKeys.FILE_SETTINGS)[inventoryFilepath] ||
          defaultFileSettings,
        localStore.get(localStoreKeys.SECRETS)
      );

      mainWindow?.webContents.send(actions.INVENTORY_OPENED, inventoryFilepath);
    }
  });
}

function openInventoryFromDialog(mWindow: BrowserWindow) {
  dialog
    .showOpenDialog(mWindow, {
      properties: ['openFile'],
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    .then(({ filePaths }) => {
      const filePath = filePaths[0];

      if (filePath) {
        openInventoryFile(filePath);
      }
    })
    .catch(() => {});
}

ipcMain.on(actions.OPEN_EXISTING_INVENTORY, () => {
  if (mainWindow) {
    warnOnUnsavedChanges(
      openInventoryFromDialog,
      mainWindow,
      fileActions.EXISTING_FILE as 'existing-file'
    );
  }
});

ipcMain.on(actions.OPEN_RECENT_INVENTORY, (_event, filepath) => {
  openInventoryFile(filepath);
});

ipcMain.on(actions.UNSAFE_CREATE_NEW_INVENTORY, () => {
  if (mainWindow) {
    createNewInventory(mainWindow);
  }
});

ipcMain.on(actions.SAVE_AND_CREATE_NEW_INVENTORY, () => {
  if (inventoryFilepath !== null && mainWindow) {
    const fileContents = inventory.stringify();

    fs.writeFileSync(inventoryFilepath, fileContents);

    createNewInventory(mainWindow);
  }
});

ipcMain.on(actions.UNSAFE_OPEN_EXISTING_INVENTORY, () => {
  if (mainWindow) {
    inventory.reset();
    openInventoryFromDialog(mainWindow);
  }
});

ipcMain.on(actions.SAVE_AND_OPEN_EXISTING_INVENTORY, () => {
  if (inventoryFilepath !== null && mainWindow) {
    const fileContents = inventory.stringify();

    fs.writeFileSync(inventoryFilepath, fileContents);

    inventory.reset();
    openInventoryFromDialog(mainWindow);
  }
});

ipcMain.on(actions.UPDATE_SETTINGS, (_event, newSettings) => {
  const {
    clearAllApplicationData,
    clearAllFileSettings,
    clearRecentFiles,
    showArchived,
    secrets,
  } = newSettings;

  setFileSettings({ showArchived });
  setApplicationSettings({
    clearAllApplicationData,
    clearAllFileSettings,
    clearRecentFiles,
    secrets,
  });

  mainWindow?.webContents.send(
    actions.SETTINGS_UPDATED,
    localStore.get(localStoreKeys.FILE_SETTINGS)[inventoryFilepath],
    localStore.get(localStoreKeys.RECENT_FILES),
    localStore.get(localStoreKeys.SECRETS)
  );
});

ipcMain.on(actions.UPDATE_FILE_SETTINGS, (_event, newFileSettings) => {
  setFileSettings(newFileSettings);
});

ipcMain.on(actions.SAVE_INVENTORY, () => {
  if (inventoryFilepath !== null) {
    const fileContents = inventory.stringify();

    fs.writeFileSync(inventoryFilepath, fileContents);

    hasChanges = false;
    mainWindow?.webContents.send(actions.INVENTORY_SAVED, hasChanges);
  }
});

function sendInventoryUpdated() {
  mainWindow?.webContents.send(
    actions.INVENTORY_UPDATED,
    inventory.items,
    inventory.categories,
    inventory.locations,
    hasChanges
  );
}

ipcMain.on(actions.UPDATE_ITEM, (_event, itemUpdates) => {
  const onBookUpdate = ({ id, isbn }: { id: string; isbn: string }) => {
    if (localStore.get(localStoreKeys.SECRETS).goodreadsApiKey?.length) {
      makeGoodreadsRequest(
        localStore.get(localStoreKeys.SECRETS).goodreadsApiKey
      )(isbn)
        .then(
          (goodreadsId) => {
            console.log('got it...', goodreadsId);
            inventory.updateItem({
              itemUpdates: {
                id,
                url: `https://www.goodreads.com/book/show/${goodreadsId}`,
              },
            });

            sendInventoryUpdated();
          },
          (e) => {
            console.log('rejected!');
            console.log(e);
          }
        )
        .catch(() => {
          console.log('caught');
        });
    }
  };

  inventory.updateItem({
    itemUpdates,
    onBookUpdate,
  });
  hasChanges = true;

  sendInventoryUpdated();
});

ipcMain.on(actions.ADD_NEW_ITEM, () => {
  const newItem = inventory.createNewItem();
  hasChanges = true;
  mainWindow?.webContents.send(actions.ADD_NEW_ITEM, newItem, hasChanges);
});

ipcMain.on(actions.DELETE_ITEM, (_event, itemId) => {
  inventory.deleteItem(itemId);
  hasChanges = true;
  sendInventoryUpdated();
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

    mainWindow.webContents.send(
      actions.INVENTORY_INITIALIZED,
      inventory.items,
      inventory.categories,
      inventory.locations,
      localStore.get(localStoreKeys.RECENT_FILES),
      localStore.get(localStoreKeys.FILE_SETTINGS)[inventoryFilepath] ||
        defaultFileSettings,
      localStore.get(localStoreKeys.SECRETS)
    );

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
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
