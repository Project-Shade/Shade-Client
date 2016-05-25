import { UPDATE_LIST } from '../actions/torrentStore';

const torrentStore = (state = [], action) => {
  switch (action.type) {
    case UPDATE_LIST:
      return action.newList;
    default:
      return state;
  }
};

export default torrentStore;
