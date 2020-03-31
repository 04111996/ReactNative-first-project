import UUIDGenerator from "react-native-uuid-generator";

const sourcePlatform = 'RMApp';

export async function getUUIDWithTimestampAndAppName() {
    let uuid = "";
    uuid = await UUIDGenerator.getRandomUUID();
    return uuid + "-" + timestamp() + "-" + sourcePlatform;
}

// Get Current TimeStamp
function timestamp() {
    let d = new Date().getTime().toString();
    return d;
}

// Get IMEI for Android Devices
async function imei() {
    let imei = await IMEI.getImei();
    return imei;
}
