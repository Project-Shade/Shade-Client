import { app, Menu, Tray } from 'electron';
import path from 'path';

let appIcon = null;
const mainWindow = WindowManager.getAll('main')[0];

if (process.platform === 'darwin') {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/macTemplate.png`));
} else {
  appIcon = new Tray(path.resolve(`${__dirname}/../../../assets/img/main_tray.png`));
}

const setContextMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show',
      click: () => {
        mainWindow.setSkipTaskbar(false);
        mainWindow.show();
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { global.quiting = true; app.quit(); } },
  ]);
  appIcon.setContextMenu(contextMenu);
};
setContextMenu();


global.wasMaximized = Settings.get('maximized', false);

// Tray icon toggle action (windows, linux)
function toggleMainWindow() {
  // the mainWindow variable will be GC'd
  // we must find the window ourselves
  const win = WindowManager.getAll('main')[0];

  if (win.isMinimized()) {
    win.setSkipTaskbar(false);
    win.show();
    if (global.wasMaximized) {
      win.maximize();
    }
  } else {
    // Hide to tray
    global.wasMaximized = Settings.get('maximized', false);
    win.minimize();
    win.setSkipTaskbar(true);
  }
}

appIcon.setToolTip('Shade');

switch (process.platform) {
  case 'darwin': // <- actually means OS-X
    // No toggle action, use the context menu.
    break;
  case 'linux':
  case 'freebsd': // <- for the hipsters
  case 'sunos':   // <- in case someone runs this in a museum
    appIcon.on('click', toggleMainWindow);
    break;
  case 'win32': // <- it's win32 also on 64-bit Windows
    appIcon.on('double-click', toggleMainWindow);
    break;
  default:
    // impossible case to satisfy Linters
}


// DEV: Keep the icon in the global scope or it gets garbage collected........
global.appIcon = appIcon;

app.on('before-quit', () => {
  appIcon.destroy();
  delete global.appIcon;
  appIcon = null;
});
