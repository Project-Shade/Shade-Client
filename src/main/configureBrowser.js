import { screen } from 'electron';
import path from 'path';

export default () => {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const defaultHeight = screenSize.height * 3 / 4;
  const defaultWidth = screenSize.width * 3 / 4;


  const baseConfig = {
    width: Settings.get('width', defaultWidth),
    height: Settings.get('height', defaultHeight),
    x: Settings.get('X'),
    y: Settings.get('Y'),
    show: true,
    autoHideMenuBar: true,
    frame: false,
    icon: path.resolve(`${__dirname}/../assets/img/main.${(process.platform === 'win32' ? 'ico' : 'png')}`), // eslint-disable-line
    title: 'Shade',
    webPreferences: {
      nodeIntegration: true,
    },
  };

  return baseConfig;
};
