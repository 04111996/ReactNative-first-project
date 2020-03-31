import React, { Component } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    View,
    Text,
    Image,
    ImageBackground,
    TextInput, TouchableOpacity, ScrollView,
    Modal,
    TextField
} from 'react-native';
import AsyncStorageFunc from "../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../constants/AsyncStorage/asyncStorageConstants";
import { connect } from 'react-redux';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class SessionExpiredNotifier extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: true
        }
    }

    handleOnClose() {
        AsyncStorageFunc.deleteData(ASYNCSTORAGE.TOKEN);
        this.props.updateSessionExpired(false);
        this.setState({ isModalVisible: false }, () => {
        })
        global.navigator.push('LoginScreen');
    }

    render() {
        return (<View style={{ backgroundColor: 'rgba(0,0,0,0.5)', left: 0, right: 0, bottom: 0, top: 0, position: "absolute" }}>
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isModalVisible}
                onRequestClose={() => { console.log("Modal has been closed.") }}
            >
                <View style={styles.modal}>
                    <View >
                        <View style={{ marginBottom: 10, marginTop: 50, }}>
                            <Text style={styles.modalTitle}>Session Expired</Text>
                        </View>
                        <Text style={[styles.modalTitle2, { marginBottom: 30 }]}>Your session has expired Please login.</Text>
                    </View>
                    <TouchableOpacity style={{ alignItems: "center" }} onPress={() => {
                        this.handleOnClose()
                    }}>
                        <Text style={styles.btnSaveDetails}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateSessionExpired: (text) => dispatch({ type: 'IS_SESSION_EXPIRED', payload: text })
    }
}

export default connect(null, mapDispatchToProps)(SessionExpiredNotifier);

const styles = StyleSheet.create({
    submit: {
        backgroundColor: '#9d1d27',
        height: 50,
        width: 340,
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: 40
    },
    modal: {
        //flex: 1,
        // flexDirection: 'column',
        height: 263,
        width: 438,
        // justifyContent: 'center',
        // alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
        //backgroundColor: 'red',
        position: 'absolute',
        // bottom: 0,
        borderRadius: 5,
        top: height / 3
        // overflow: 'scroll',
    },
    modalHeader: {
        //flex: 1,
        //sflexDirection: 'row',
        // justifyContent: 'space-between',
        marginLeft: 50,
        marginTop: 50,
    },
    modalTitle: {
        color: '#58595b',
        fontFamily: "Helvetica",
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        // marginBottom: 20
        // letterSpacing:0.5
    },
    modalTitle2: {
        color: '#58595b',
        fontFamily: "Helvetica",
        fontSize: 18,
        alignSelf: 'center'
    },
    btnSaveDetails: {
        width: 150,
        height: 40,
        backgroundColor: '#9d1d28',
        color: '#fff',
        fontFamily: "Helvetica",
        fontSize: 14,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        borderRadius: 20,
        marginRight: 20
    }

});