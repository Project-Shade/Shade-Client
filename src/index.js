import { app, BrowserWindow, screen } from 'electron';
import { argv } from 'yargs';

import configureApp from './main/configureApp';
import generateBrowserConfig from './main/configureBrowser';

import EmitterClass from './main/utils/Emitter';
import SettingsClass from './main/utils/Settings';
import WindowManagerClass from './main/utils/WindowManager';

import handleStartupEvent from './squirrel';

(() => {
  if (handleStartupEvent()) {
    return;
  }

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow = null;

  setTimeout(() => {
    Emitter.sendToWindowsOfName('main', 'single_instance', {
      argv: process.argv,
    });
  }, 2000);

  // DEV: Make the app single instance
  const shouldQuit = app.makeSingleInstance((argv2) => {
    Emitter.sendToWindowsOfName('main', 'single_instance', {
      argv: argv2,
    });
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
      mainWindow.setSkipTaskbar(false);
      if (app.dock && app.dock.show) app.dock.show();
    }
  });

  if (shouldQuit) {
    app.quit();
    return;
  }

  global.Settings = new SettingsClass();

  global.DEV_MODE = argv.development || argv.dev || true;
  if (Settings.get('START_IN_DEV_MODE', false)) {
    global.DEV_MODE = true;
    Settings.set('START_IN_DEV_MODE', false);
  }

  configureApp(app);

  global.Emitter = new EmitterClass();
  global.WindowManager = new WindowManagerClass();

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {
    mainWindow = new BrowserWindow(generateBrowserConfig());
    global.mainWindowID = WindowManager.add(mainWindow, 'main');

    const position = Settings.get('position');
    let inBounds = false;
    if (position) {
      screen.getAllDisplays().forEach((display) => {
        if (position[0] >= display.workArea.x &&
            position[0] <= display.workArea.x + display.workArea.width &&
            position[1] >= display.workArea.y &&
            position[1] <= display.workArea.y + display.workArea.height) {
          inBounds = true;
        }
      });
    }

    let size = Settings.get('size');
    size = size || [1200, 800];

    mainWindow.setSize(...size);
    if (position && inBounds) {
      mainWindow.setPosition(...position);
    } else {
      mainWindow.center();
    }

    if (Settings.get('maximized', false)) {
      mainWindow.maximize();
    }

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/public_html/index.html`);
    require('./main/features');

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });

  app.on('before-quit', () => {
    global.quiting = true;
  });
})();
