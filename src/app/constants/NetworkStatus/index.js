import {
  UPDATE_NETWORK_STATUS,
  UPDATE_VISIBILITY,
} from '../NetworkStatus/NetworkStatusConstants';

export const updateNetworkStatus = isInternetReachable => {
  return {
    type: UPDATE_NETWORK_STATUS,
    isInternetReachable,
  };
};

export const updateVisibility = isVisible => {
  return {
    type: UPDATE_VISIBILITY,
    isVisible,
  };
};
