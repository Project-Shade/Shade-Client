import { remote } from 'electron';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage from 'localforage';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Main from '../client/components/Main';
import rootReducer from '../client/reducers';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

window.addEventListener('load', () => {
  remote.getCurrentWindow().show();
});

const logger = (store) => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(
  rootReducer,
  applyMiddleware(logger),
  autoRehydrate()
);

persistStore(store, { store: localForage }, () => {
  console.log('rehydration complete');
});

class ShadeApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Main />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<ShadeApp />, document.querySelector('#app'));
