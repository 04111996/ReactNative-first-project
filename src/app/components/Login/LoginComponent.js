import React, { Component } from 'react';
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
    TextField,
    KeyboardAvoidingView
} from 'react-native';
import { Form, Button } from "native-base"
import NameInput from "../../components/customcomponents/NameInput";
import GroupImage from "../../assets/images/group.svg";
import BankLogo from "../../assets/images/bank_logo.svg";
import VisibilityImage from "../../assets/images/visibility.svg";
import MakeInvisibleImage from "../../assets/images/invisible.svg";
import ApiManager from "../../api/apiManager";
import AsyncStorageFunc from "../../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../../constants/AsyncStorage/asyncStorageConstants"
import FloatingLabelNameInput from "../customcomponents/FloatingLabelNameInput";
import FloatingPasswordInput from "../customcomponents/FloatingPasswordInput";
import CloseIcon from "../../assets/images/forgotPasswordClose.svg";
import { connect } from 'react-redux';
import {CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';
import {syncCases, getAllCases} from '../../OperationsQueue/SyncController'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class LoginComponent extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            isModalVisible: false,
            isErrorMessageVisible: false,
            isInternetAvailable: this.props.isInternetAvailable,
            passwordHide: true
        }
        this.focusTheField = this.focusTheField.bind(this);
        this.inputs = {};
    }
    // function to focus the field
    focusTheField = (id) => {
        this.inputs[id].focus();
    }

    handleSubmit() {
        this.setState({ isErrorMessageVisible: false });
        var reqObj = {
            "userName": this.state.userName,
            "password": this.state.password
        }
        // alert('happening');
        ApiManager.login(reqObj).then(res => {
            //  alert(JSON.stringify(res));
            if (res.data.token) {
                global.token = res.data.token;
                AsyncStorageFunc.storeData(ASYNCSTORAGE.TOKEN, res.data.token).then(res => {
                    syncCases()
                    //  this.props.navigation.push('HomeScreen');
                    this.props.navigation.replace('HomeScreen');
                }).catch(err => {
                    console.log(err, "error while saving token");
                })
                global.employeeId = res.data.EmpId;
                global.userName=res.data.User;
                AsyncStorageFunc.storeData(ASYNCSTORAGE.EMPLOYEE_ID, res.data.EmpId).then(res => {
                    //  this.props.navigation.push('HomeScreen');
                }).catch(err => {
                    console.log(err, "error while saving employee Id");
                })
            }
        }).catch(err => {
            console.log(err);
            if (err == "Error: Request failed with status code 401") {
                this.setState({ isErrorMessageVisible: true });
            }
            // alert(err.response.data.message);
        })
    }

    handleOnClose() {
        this.setState({ isModalVisible: false })
    }

    handleForgotPassword() {
        this.setState({ isModalVisible: true })
    }

    makeVisible() {
        this.setState({passwordHide: false})
    }

    makeInvisible() {
        this.setState({passwordHide: true})
    }

    areFieldsEmpty() {
        if (this.state.userName == "" || this.state.password == "") {
            return true;
        } else {
            return false;
        }
    }

    static getDerivedStateFromProps(props, state) {
        // check your condition when it should run?
        if (props.isInternetAvailable != state.isInternetAvailable) {
            return {
                isInternetAvailable: props.isInternetAvailable
            }
        }
        // otherwise, don't do anything
        else {
            return null
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.Container} behavior="padding" enabled>
                <View style={styles.Group}>
                    <GroupImage />
                </View>
                <View style={styles.BankLogo}>
                    <BankLogo />
                </View>
                {this.state.isInternetAvailable ?
                    <View style={styles.Login}>
                        <View>
                            <Text style={[styles.LoginText, { marginTop: 50, fontWeight: 'bold' }]}>Hello,</Text>
                            <Text style={[styles.LoginText, { marginBottom: 20 }]}>Sign in to continue</Text>
                            <Form>
                                <FloatingLabelNameInput
                                    label="User ID"
                                    value={this.state.userName}
                                    onValueChanged={text => this.setState({ userName: text })}
                                    returnKeyType={"next"}
                                    // autoFocus={true}
                                    onSubmitEditing={() => { this.focusTheField('password'); }}
                                    maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                                />
                               
                                <FloatingPasswordInput
                                    label="Password"
                                    value={this.state.password}
                                    onValueChanged={text => this.setState({ password: text })}
                                    // returnKeyType={"next"}
                                    // autoFocus={true}
                                    style={{ marginBottom: 20 }}
                                    // secureTextEntry={this.state.passwordHide}
                                    onRef={(ref) => {
                                        this.inputs['password'] = ref;
                                    }}
                                    maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                                />
                                   
                                {this.state.isErrorMessageVisible ?
                                    <View style={{ fontFamily: 14, fontFamily: 'Helvetica', }}>
                                        <Text style={{ color: '#d0021b' }}>Invalid User ID or Password</Text>
                                    </View> : null}

                                {this.areFieldsEmpty() ?
                                    <View
                                        style={styles.submitDisable}
                                    >
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 14, fontFamily: 'Helvetica', fontWeight: 'bold' }}
                                        >Login</Text>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        style={styles.submit}
                                        onPress={() => this.handleSubmit()}
                                    >
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 14, fontFamily: 'Helvetica', fontWeight: 'bold' }}
                                        >Login</Text>
                                    </TouchableOpacity>}

                                <TouchableOpacity onPress={() => this.handleForgotPassword()}
                                >
                                    <Text style={{ alignSelf: 'center', color: '#9d1d27', fontSize: 14, fontFamily: 'Helvetica', marginTop: 30, }}>Forgot Your Password?</Text>
                                </TouchableOpacity>
                            </Form>
                        </View>
                    </View>
                    : <View>
                        <Modal
                            animationType={"fade"}
                            transparent={true}
                            visible={true}
                            onRequestClose={() => { console.log("Modal has been closed.") }}
                        >
                            <View style={styles.modal}>
                                <View >
                                    <View style={{ marginBottom: 10, marginTop: 50, }}>
                                        <Text style={styles.modalTitle}>No Internet Connection !</Text>
                                    </View>
                                    <Text style={[styles.modalTitle2,]}>Please make sure you have good network</Text>
                                    <Text style={[styles.modalTitle2, { marginBottom: 30 }]}>and try again</Text>
                                </View>
                                <TouchableOpacity style={{ alignItems: "center" }} onPress={() => {
                                    this.handleOnClose()
                                }}>
                                    <Text style={styles.btnSaveDetails}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>}

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.isModalVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}
                >
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', left: 0, right: 0, bottom: 0, top: 0, position: "absolute" }}>
                        <View style={styles.modal}>
                            <View >
                                <View style={{ marginBottom: 10, marginTop: 50, }}>
                                    <Text style={styles.modalTitle}>Forgot Password</Text>
                                </View>
                                <Text style={styles.modalTitle2}>Please contact system administrator</Text>
                                <Text style={[styles.modalTitle2, { marginBottom: 30 }]}>at admin@idfc.com</Text>
                            </View>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => {
                                this.handleOnClose()
                            }}>
                                <Text style={styles.btnSaveDetails}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isInternetAvailable: state.networkStatus.isInternetReachable
    }
}

export default connect(mapStateToProps)(LoginComponent)

const styles = StyleSheet.create({
    Container: {
        backgroundColor: '#9d1d27',
        // width: '100%',
        // height: '100%'
        flex: 1,
        justifyContent: 'center'
    },
    Group: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    Login: {
        position: 'absolute',
        height: 450,
        // height: '55%',
        top: '22%',
        width: 400,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center'
    },
    LoginText: {
        //marginTop: 50,
        fontFamily: 'Helvetica',
        //fontWeight: 'bold',
        fontSize: 24,
        color: '#58595b',
        alignSelf: 'center'
    },
    BankLogo: {
        position: 'absolute',
        height: 50,
        width: 140,
        top: '8%',
        // bottom: 60,
        alignSelf: 'center',
        //marginTop: 60
        //marginBottom: 60
    },
    submit: {
        backgroundColor: '#9d1d27',
        height: 50,
        width: 340,
        justifyContent: 'center',
        borderRadius: 4,
        // marginTop: 40
        marginTop: 20
    },
    submitDisable: {
        backgroundColor: '#ba636a',
        height: 50,
        width: 340,
        justifyContent: 'center',
        borderRadius: 4,
        // marginTop: 40
        marginTop: 20
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
        top: height / 3.2
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
        alignSelf: 'center'
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