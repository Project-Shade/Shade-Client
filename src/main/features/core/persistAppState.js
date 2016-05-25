const mainWindows = WindowManager.getAll('main');
const mainWindow = mainWindows[0];

let resizeTimer;

const _save = () => {
  if (mainWindow.isMaximized()) {
    Settings.set('maximized', true);
  } else {
    Settings.set('maximized', false);
    Settings.set('position', mainWindow.getPosition());
    Settings.set('size', mainWindow.getSize());
  }
};

mainWindow.on('move', _save);
mainWindow.on('resize', _save);
mainWindow.on('maximize', _save);
mainWindow.on('unmaximize', _save);
