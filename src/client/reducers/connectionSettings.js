import { UPDATE_CONNECTION_SETTINGS } from '../actions/connectionSettings';

const defaultSettings = {
  host: '',
  port: '80',
  path: '/plugins/httprpc/action.php',
  username: '',
  password: '',
};

const connectionSettings = (state = defaultSettings, action) => {
  switch (action.type) {
    case UPDATE_CONNECTION_SETTINGS:
      return Object.assign({}, action.newSettings);
    default:
      return state;
  }
};

export default connectionSettings;
