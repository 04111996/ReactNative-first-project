import axios from 'axios';
import { getEnvConfig } from '../utilities/utilities';


// returns config specific to deployed env
const envConfig = getEnvConfig();

// get Token config from envConfig
const TokenConfigs = {
  defaultThresholdCheckAT: 100000,
  CLIENT_ID: envConfig.clientId,
  CLIENT_SECRET: envConfig.clientSecret,
};

export default class TokenBake {
  constructor() {
    this.configStore = this.getConfigStore();
    this.thresholdCheck = TokenConfigs.defaultThresholdCheckAT;
  }

    getConfigStore = () => {
      const configStore = JSON.parse(window.localStorage.getItem('ConfigStore')) || '';
      return configStore;
    }

    setConfigStore = (_newConfigStore) => {
      let serverPickTime = new Date().getTime();
      let expires_in = Number(_newConfigStore.expires_in) * 1000;//Converting to milliseconds
      let expiryTime = serverPickTime + expires_in;
      _newConfigStore.expiryTime = expiryTime;
      window.localStorage.setItem('ConfigStore', JSON.stringify(_newConfigStore));
    }

    removeConfigStore = () => {
      window.localStorage.removeItem('ConfigStore');
    }


    getRefreshToken = () => this.getConfigStore().refresh_token || this.configStore.refresh_token;

    getAccessToken = () => {
      const store = this.getConfigStore();
      if(this.isTokenExpired() && JSON.parse(window.localStorage.getItem('ConfigStore') != null)){
        this.updateAccessToken();
      }
      return store.access_token;
    }

    getTokenExpireTime = () => {
      let configStore = this.getConfigStore();
      if(!configStore)
        return new Date().getTime();
      return configStore.expiryTime;
    }

    getServerPickTime = () => {
      const serverPickTime = new Date(this.configStore.serverPickTime);
      return serverPickTime.getTime();
    }


    //
    isTokenExpired = () => {
      const currentTimeStamp = new Date().getTime();
      const tokenExpireTime = this.getTokenExpireTime();
      return (tokenExpireTime - currentTimeStamp) < this.thresholdCheck;
    }

    updateTokenInfo = (payload) => {
      this.configStore.access_token = payload.data.access_token;
      this.configStore.refresh_token = payload.data.refresh_token;
      this.configStore.serverPickTime = new Date().toISOString();

      const newConfigStore = [this.configStore];
      // update store
      this.setConfigStore(newConfigStore);
    }

    requireAuth = (to, from, next) => {
      if (this.isTokenExpired()) {
        if(to.path == '/login')
          next();
        next({
          path: '/login',
        });
      } else {
        if(to.path == '/login'){
          next({
            path: '/customer-details'
          });
        } else {
          next();
        }
      }
    }


    updateAccessToken = () => {
      const payload = {
        client_id: TokenConfigs.CLIENT_ID,
        client_secret: TokenConfigs.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: this.getRefreshToken(),
      };

      return new Promise((resolve, reject) => {
        const url = envConfig.baseUrl3 + '/some_url'; //TODO, need to Change this
        axios.post(url, payload)
          .then((response) => {
            // Update configStore localStorage
            this.setConfigStore(response.data);
            // resolve promise
            resolve(response.data.access_token);
          })
          .catch((e) => {
            console.log(
              'Oops...',
              'Something went wrong! Try again.',
              'error',
            );
          });
      });
    }


}

