
import axios from 'axios';
// import TokenBake from './tokenBake';
import { getEnvConfig } from '../utilities/utilities';
import { BASEURL } from '../constants/apiConstants';
import { from } from 'rxjs';
// import MockAdapter from 'axios-mock-adapter';
import AsyncStorageFunc from "../utilities/asyncStorage";
// const tokenBake = new TokenBake();
// const bearerToken = tokenBake.getAccessToken();
const BASE_PATH = getEnvConfig().baseUrl;
import { ASYNCSTORAGE } from "../constants/AsyncStorage/asyncStorageConstants";
import store from "../../../index";

class ApiService {
    //     constructor() {
    //         let service = axios.create({
    //             headers: {
    //                 // Authorization: `Bearer ${bearerToken}`
    //             }
    //         })
    //         service.interceptors.request.use(async (config) => {
    //             // Do something before request is sent
    //             // if (!!tokenBake.isTokenExpired()) {
    //             //     //const newBearerToken = await tokenBake.updateAccessToken();
    //             //     config.headers.Authorization = `Bearer ${newBearerToken}`;

    get(path) {
        return new Promise((resolve, reject) => {
            console.log(path);
            axios.get(path)
                .then(function (response) {
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
        });
    }
    //             // }
    //             return config;
    //         }, (error) => {
    //             // Do something with request error
    //             return Promise.reject(error);
    //         });
    //         this.service = service;
    //     }

    //     get(path, resObj, config) {
    //         let data = {
    //             headers:
    //             {
    //                 Authorization : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InNlbXBlcl9maSIsImVtcElkIjoiMjEwNzg5Iiwicm9sZSI6IlJPTEVfUk0iLCJwZXJtaXNzaW9ucyI6WyJJU19BTExPV0VEX1RPX0FERF9DQVNFIiwiSVNfQUxMT1dFRF9UT19WSUVXX0NBU0UiLCJJU19BTExPV0VEX1RPX1VQREFURV9DQVNFIl0sImlhdCI6MTU3NTQ0MjkwNSwiZXhwIjoxNTc1NDc4OTA1fQ.Tqfn2zmoTEWiQp59wrFm6O7RlqpjT5nwLcJVGNiluwc'
    //             }
    //         }
    //         // var mock = new MockAdapter(axios);

    //         // Mock any GET request to /users
    //         // arguments for reply are (status, data, headers)
    //         // mock.onGet(path).reply(200, resObj);

    //         return new Promise((resolve, reject) => {
    //             axios.get(path,data )
    //                 .then(function (response) {
    //                     console.log('TEST RESPONSE',response.data);
    //                     resolve(response);
    //                 });
    //         });

    //     }

    patch(path, payload, callback) {
        return this.service.request({
            method: 'PATCH',
            url: BASE_PATH + '/' + path,
            responseType: 'json',
            data: payload
        }).then((response) => callback(response.status, response.data));
    }
    getWithParams(path, params, headers) {
        // var mock = new MockAdapter(axios);

        // Mock any GET request to /users
        // arguments for reply are (status, data, headers)
        // mock.onGet(path).reply(200, resObj);
        console.log('base url', BASEURL + '/' + path + '?id=1324');
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: BASEURL + '/' + path,
                params: params,
                headers: headers
            })
                .then(function (response) {
                    // alert('manager'+JSON.stringify(response))
                    console.log('get with params request', response.data);
                    resolve(response);
                })
                .catch((err) => {
                    console.log(err, 'error me 123');
                    if (err.response.status === 401) {
                        store.dispatch({ type: 'IS_SESSION_EXPIRED', payload: true })
                    }
                    //alert('error'+JSON.stringify(err))
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
            // });
        });

    }

    //     deleteAPI(path, payload, callback) {
    //         return this.service.request({
    //             method: 'DELETE',
    //             url: BASE_PATH + '/' + path,
    //             responseType: 'json',
    //             data: payload
    //         }).then((response) => resolve(response));
    //     }

    //     post(path, payload, resObj) {

    post(path, payload, headers) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: path,
                data: payload,
                headers: headers
            }).then(function (response) {
                resolve(response);
            }).catch((err) => {
                // console.log(err.response.data);
                if (err.response.status === 401 && err.response.data == "Unauthorized") {
                    store.dispatch({ type: 'IS_SESSION_EXPIRED', payload: true })
                }
                reject(err);
            })
        });
    }
    async postwithtoken(path, payload) {
      //  console.log('postwithtoken')
        let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN)
        //console.log('token',token)
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                //headers: { 'Authorization': "bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InNlbXBlcl9maSIsImVtcElkIjoiMjEwNzg5Iiwicm9sZSI6IlJPTEVfUk0iLCJwZXJtaXNzaW9ucyI6WyJJU19BTExPV0VEX1RPX0FERF9DQVNFIiwiSVNfQUxMT1dFRF9UT19WSUVXX0NBU0UiLCJJU19BTExPV0VEX1RPX1VQREFURV9DQVNFIl0sImlhdCI6MTU3NjY5MDQ5OSwiZXhwIjoxNTc2NzI2NDk5fQ.8shHU1Cd8tSdfM5NbCi-9C91EVsQ030zLjJK6M_bq6E" },
                headers: { 'Authorization': "bearer " + token },
                url: path,
                data: payload
            }).then(function (response) {
                console.log(response.data);
                resolve(response.data);
            }).catch(function (err) {
                console.log('postwithtoken err', err)
                reject(err)
                if (err.response.status === 401 && err.response.data == "Unauthorized") {
                    store.dispatch({ type: 'IS_SESSION_EXPIRED', payload: true })
                }
            })
        });
    }
    async getWithToken(path, params) {
        let token = await AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN)
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: path,
                params: params,
                headers: { 'Authorization': "bearer " + token },
            })
                .then(function (response) {
                    resolve(response.data);
                })
                .catch((err) => {
                    if (err.response.status === 401 && err.response.data == "Unauthorized") {
                        store.dispatch({ type: 'IS_SESSION_EXPIRED', payload: true })
                    }
                    reject(err)
                    try {
                        if (err.response && err.response.data.error) {
                            // reject({ status: err.response.data.error.type, message: err.response.data.error.message, errorData: err.response.data.data })
                        } else {
                            // reject({ status: 'error', message: err.message })
                        }
                    } catch (e) {
                        // reject({ status: 'error', message: 'something went wrong' })
                    }
                });
            // });
        });
    }
    // post(path, payload) {
    //var mock = new MockAdapter(axios);
    // Mock any GET request to /users
    // arguments for reply are (status, data, headers)
    // mock.onPost(path).reply(200, resObj);
    // console.log(path, "path");
    // console.log(payload, "payload");
    // return new Promise((resolve, reject) => {
    //     axios({
    //         method: 'post',
    //         url: path,
    //         data: payload
    //     })
    //         .then(function (response) {
    //             console.log(response);
    //             resolve(response);
    //         }).catch((err) => {
    //             console.log(err);
    //             reject(err);
    //         })
    // });
    // console.log("api request");
    // const res = await axios.post(path, payload);
    // console.log("res api request");
    // return res;

    // }
    // var mock = new MockAdapter(axios);

    // Mock any GET request to /users
    // arguments for reply are (status, data, headers)
    // mock.onGet(path).reply(200, resObj);


    // get = (path, resObj, config) => {
    //     let data = {
    //         headers:
    //         {
    //             Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InNlbXBlcl9maSIsImVtcElkIjoiMjEwNzg5Iiwicm9sZSI6IlJPTEVfUk0iLCJwZXJtaXNzaW9ucyI6WyJJU19BTExPV0VEX1RPX0FERF9DQVNFIiwiSVNfQUxMT1dFRF9UT19WSUVXX0NBU0UiLCJJU19BTExPV0VEX1RPX1VQREFURV9DQVNFIl0sImlhdCI6MTU3NTQ0MjkwNSwiZXhwIjoxNTc1NDc4OTA1fQ.Tqfn2zmoTEWiQp59wrFm6O7RlqpjT5nwLcJVGNiluwc'
    //         }
    //     }

    //     return axios.get(path, data)
    //         .then(function (response) {
    //             console.log('TEST RESPONSE', response.data);
    //             resolve(response);
    //         }).catch((error) => console.log(error));

    // }
    // async postwithtoken(path, payload) {
    //     let token = await AsyncStorageFunc.getData('token')
    //     return new Promise((resolve, reject) => {
    //         axios({
    //             method: 'post',
    //             // headers: {'Authorization': "bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InNlbXBlcl9maSIsImVtcElkIjoiMjEwNzg5Iiwicm9sZSI6IlJPTEVfUk0iLCJwZXJtaXNzaW9ucyI6WyJJU19BTExPV0VEX1RPX0FERF9DQVNFIiwiSVNfQUxMT1dFRF9UT19WSUVXX0NBU0UiLCJJU19BTExPV0VEX1RPX1VQREFURV9DQVNFIl0sImlhdCI6MTU3NjY5MDQ5OSwiZXhwIjoxNTc2NzI2NDk5fQ.8shHU1Cd8tSdfM5NbCi-9C91EVsQ030zLjJK6M_bq6E"},
    //             headers: { 'Authorization': "bearer " + token },
    //             url: path,
    //             data: payload
    //         }).then(function (response) {
    //             console.log(response.data);
    //             resolve(response.data);
    //         });
    //     });
    // }

}

export default new ApiService();

