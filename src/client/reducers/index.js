import { combineReducers } from 'redux';

import appState from './appState';
import connectionSettings from './connectionSettings';
import torrentStore from './torrentStore';

const rootReducer = combineReducers({
  appState,
  connectionSettings,
  torrentStore,
});

export default rootReducer;
