import {
  FETCH_USER_DATA_BY_ID
} from '../actions'

let dataState = {
  userId: '',
  userData: '',
}

export default (state = dataState, actions) => {
  switch (actions.type) {
    case FETCH_USER_DATA_BY_ID:
      state = Object.assign({}, state, { userData: actions.payload });
      return state;
    default:
      return state;
  }
}