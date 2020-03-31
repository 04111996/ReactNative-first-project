//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class asyncStorageFunc {

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.log("saving error");
            // saving error
        }
    }


    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value !== null) {
                //console.log(JSON.parse(value), '------------> abcabc');
                return JSON.parse(value);
            }
        } catch (e) {
            console.log("fetching error");
        }
    }

    getAsyncData = (key) =>{
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (err, result) => {
                resolve(JSON.parse(result))
                console.log(result);
              });
        })
    }

    deleteData = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log("deleted", "=--------------------------=");
            return true;
        }
        catch (exception) {
            return false;
        }
    }
}
export default new asyncStorageFunc;
