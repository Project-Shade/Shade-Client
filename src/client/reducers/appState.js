import { CHANGE_LOADING, CHANGE_PAGE, CHANGE_FILTER_STATUS, CHANGE_FILTER_TEXT } from '../actions/appState';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  loading: true,
  page: 1,
  filter: {
    text: null,
    status: 'all',
  },
};

const appState = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_FILTER_TEXT:
      return Object.assign({}, state, { page: 1, filter: Object.assign({}, state.filter, { text: action.text }) });
    case CHANGE_FILTER_STATUS:
      return Object.assign({}, state, { page: 1, filter: Object.assign({}, state.filter, { status: action.status }) });
    case CHANGE_LOADING:
      return Object.assign({}, state, { loading: action.loading });
    case CHANGE_PAGE:
      return Object.assign({}, state, { page: action.page });
    case REHYDRATE:
      return Object.assign({}, state, action.payload.appState, { loading: true });
    default:
      return state;
  }
};

export default appState;
