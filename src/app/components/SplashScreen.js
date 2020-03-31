import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    View,
    Text,
    StatusBar,
    Alert,
    Button,
    Image,
} from 'react-native';
import Logo from '../assets/images/bank_logo.svg';
import AsyncStorageFunc from '../utilities/asyncStorage';
import { ASYNCSTORAGE } from '../constants/AsyncStorage/asyncStorageConstants';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class SplashScreen extends Component {
    constructor(){
        super()
   
    }
    render() {
        const viewStyles = [styles.splashcontainer];
        return (
            <View style={viewStyles}>
                {/* <Image
            style={styles.stretch}
            source={require('./src/app/assets/images/bank_logo.png')}
          /> */}
                <Logo />
            </View>
        );
    }

    componentDidMount() {
        global.navigator = this.props.navigation;
        AsyncStorageFunc.getData(ASYNCSTORAGE.TOKEN).then(res => {
            //if ((res == null || res == '') && global.isOnline) {
            if (res == null || res == '') {
                this.props.navigation.replace('LoginScreen');
            } else {
                this.props.navigation.replace('HomeScreen');
            }
        })       
    }
}

const styles = StyleSheet.create({
    splashcontainer: {
        backgroundColor: '#9d1d28',
        flex: 1,
        height: height,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SplashScreen;