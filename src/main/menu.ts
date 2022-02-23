import { app, Menu, BrowserWindow, MenuItemConstructorOptions, ipcMain, dialog } from 'electron';
import applicationInfo from '../consts/applicationInfo';
import actions from '../consts/actions';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: applicationInfo.applicationName,
      submenu: [
        {
          label: 'New Inventory',
          click: () => ipcMain.emit(actions.CREATE_NEW_INVENTORY),
        },
        {
          label: 'Open Existing Inventory',
          click: () => ipcMain.emit(actions.OPEN_EXISTING_INVENTORY),
        },
        { type: 'separator' },
        {
          label: 'About Minute Inventory',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Hide Minute Inventory',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };

    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };

    // https://github.com/electron/electron/issues/4068#issuecomment-251896721
    const subMenuEdit: MenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectAll' },
      ],
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuView, subMenuEdit, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
    ];

    return templateDefault;
  }
}
