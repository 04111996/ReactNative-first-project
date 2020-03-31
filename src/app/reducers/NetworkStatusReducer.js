import {
  UPDATE_NETWORK_STATUS,
  UPDATE_VISIBILITY,
} from '../constants/NetworkStatus/NetworkStatusConstants';
const intialState = {
  isInternetReachable: false,
  isVisible: false,
};

export default function NetworkStatusReducer(state = intialState, action) {
  switch (action.type) {
    case UPDATE_NETWORK_STATUS:
      return {
        ...state,
        isInternetReachable: action.isInternetReachable,
      };
    case UPDATE_VISIBILITY:
      return {
        ...state,
        isVisible: action.isVisible,
      };
    default:
      return state;
  }
}
