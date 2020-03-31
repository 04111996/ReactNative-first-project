export default class Token {
    constructor() {
    }

    //Token Getter and setter functions
    static get getToken() {
        return this._token;
    }

    static set setToken(token) {
        return this._token = token;
    }

    //ClientId Getter and setter functions
    static get getClientId() {
        return this._clientId;
    }

    static set setClientId(id) {
        return this._clientId = id;
    }

    //ClientId Getter and setter functions
    static get getClientSecret() {
        return this._clientSecret;
    }

    static set setClientSecret(secret) {
        return this._clientSecret = secret;
    }
}
