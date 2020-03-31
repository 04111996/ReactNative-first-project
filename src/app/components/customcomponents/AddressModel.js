import React, { Component } from 'react';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import AddressTextInput from './AddressTextInput';
import AddressPinCodeInput from "./AddressPinCodeInput";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
  Platform,
  AppState,
  Keyboard,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import IconCurrentLocation from '../../assets/images/icon_current_location.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Addressodel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddressPopup: false,
      address: {},
      oldAddress:{},
      addressViewHeight: height - 50
    };
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    // this.setState({ address: this.props.address }, () => {
    //   console.log("getStreet:::updated" + JSON.stringify(this.state.address))
    // })
  }
  static getDerivedStateFromProps(props, state) {
    console.log("props.address::"+JSON.stringify(props.address))
    console.log("state.oldAddress::"+JSON.stringify(state.oldAddress))

    if (props.address !== state.oldAddress) {
      return {
        oldAddress: props.address,
        address:props.address
      };
    }
    return null;
  }
  // onUpdateAddressDetails(address) {
  //   this.setState({ address: address })
  //   console.log('address for reference', this.state.address)
  // }
  onClickSaveAddressDetails = () => {
    let { address } = this.state;
    console.log("addressmodel city [onClickSaveAddressDetails]:" + address.cityName)
    if (
      address.houseNumber !== '' ||
      address.houseDetails !== '' ||
      address.streetName !== '' ||
      address.stateName !== '' ||
      address.cityName !== '' ||
      address.pinCode !== ''
    ) {
      this.onClickAddressForCommunication();
      this.props.onClickSaveAddress(address);

    } else {
      //this.onClickAddressForCommunication();
    }

  };

  hasValidAddress() {

    let { address } = this.state;
    // console.log('address12',JSON.stringify(address))
    if (
      (address.houseNumber != null && typeof (address.houseNumber) !== "undefined" && address.houseNumber.trim() != '') ||
      (address.houseDetails != null && typeof (address.houseDetails) !== "undefined" && address.houseDetails.trim() != '') ||
      (address.streetName != null && typeof (address.streetName) !== "undefined" && address.streetName.trim() != '') ||
      (address.cityName != null && typeof (address.cityName) !== "undefined" && address.cityName.trim() != '') ||
      (address.stateName != null && typeof (address.stateName) !== "undefined" && address.stateName.trim() != '') ||
      (address.pinCode != null && typeof (address.stateName) !== "undefined" && (address.pinCode + "").trim() != '')
    ) {
      return true
    } else {
      return false
    }
  }

  getAddress(latitude, longitude) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUSiX9L0x-pZN8MHYW7SfxHFIRb_cJkfE`,
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        if(res.results.length >0){
          let addressBygeoaddress = res.results[0];
          let apiAddress = this.formattedAddress(addressBygeoaddress)
          this.setState({
            address: {
              latitude: latitude,
              longitude: longitude,
              houseNumber: apiAddress.houseNumber + "",
              houseDetails: apiAddress.houseDetails + "",
              streetName: apiAddress.streetName + "",
              stateName: apiAddress.stateName + "",
              cityName: apiAddress.cityName + "",
              pinCode: apiAddress.pinCode + "",
            },
          });
        }
      });
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  formattedAddress = (place) => {
    let address = {
      houseNumber: '',
      houseDetails: '',
      streetName: '',
      stateName: '',
      cityName: '',
      pinCode: ''
    }
    if(place && place.address_components && place.address_components.length>0){
      for (var i = 0; i < place.address_components.length; i++) {
        for (var j = 0; j < place.address_components[i].types.length; j++) {
          if (place.address_components[i].types[j] == "sublocality_level_2") {
            address = { ...address, houseNumber: place.address_components[i].long_name }
          }
          if (place.address_components[i].types[j] == "sublocality_level_1") {
            address = { ...address, houseDetails: place.address_components[i].long_name }
          }
          // if (place.address_components[i].types[j] == "administrative_area_level_2") {
          //   address = { ...address, streetName: place.address_components[i].long_name }
          // }
          if (place.address_components[i].types[j] == "administrative_area_level_1") {
            address = { ...address, stateName: place.address_components[i].long_name }
          }
          if (place.address_components[i].types[j] == "administrative_area_level_2") {
            address = { ...address, cityName: place.address_components[i].long_name }
          }
          if (place.address_components[i].types[j] == "postal_code") {
            address = { ...address, pinCode: place.address_components[i].long_name }
          }
        }
      }
    }
    
    // alert(JSON.stringify(address))
    return address
  }

  getMyLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;
    try {
      await Geolocation.getCurrentPosition(
        async info => {
          let addressBygeocoords = info.coords;

          // alert(JSON.stringify(addressBygeocoords))
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${info.coords.latitude},${info.coords.longitude}&key=AIzaSyCUSiX9L0x-pZN8MHYW7SfxHFIRb_cJkfE`,
          )
            .then(res => {
              return res.json();
            })
            .then(res => {
             // alert('asdddddddddddd')
              console.log('getMyLocation res : ', JSON.stringify(res.results));
              let addressBygeoaddress = res.results[0];
              let apiAddress = this.formattedAddress(addressBygeoaddress)

              this.setState({

                address: {
                  // latitude: addressBygeocoords.latitude,
                  // longitude: addressBygeocoords.longitude,
                  latitude: info.coords.latitude,
                  longitude: info.coords.longitude,
                  houseNumber: apiAddress.houseNumber + "",
                  houseDetails: apiAddress.houseDetails + "",
                  streetName: apiAddress.streetName + "",
                  stateName: apiAddress.stateName + "",
                  cityName: apiAddress.cityName + "",
                  pinCode: apiAddress.pinCode + "",
                },
              });
            });
        },
        error => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    } catch (err) {
      console.log(err);
    }
  };
  getStreet = value1 => {
    var { address } = this.state;
    //let { value } = this.props
    //value = { ...value, houseNumber: value1 }
    var updateaddress = {
      ...address, houseNumber: value1, latitude: 0,
      longitude: 0
    };
    console.log("getStreet:::" + JSON.stringify(updateaddress))
    this.setState({ address: updateaddress }, () => {
      console.log("getStreet:::updated" + JSON.stringify(this.state.address))
    });
  };
  getArea = value => {
    let { address } = this.state;
    let updateaddress = {
      ...address, houseDetails: value, latitude: 0,
      longitude: 0
    };
    this.setState({ address: updateaddress });
  };
  getLocality = value => {
    let { address } = this.state;
    let updateaddress = {
      ...address, streetName: value, latitude: 0,
      longitude: 0
    };
    this.setState({ address: updateaddress });
  };

  getCity = value => {
    let { address } = this.state;
    let updateaddress = {
      ...address, stateName: value, latitude: 0,
      longitude: 0
    };
    this.setState({ address: updateaddress });
  };

  getRealCity = value => {
    let { address } = this.state;
    let updateaddress = {
      ...address, cityName: value, latitude: 0,
      longitude: 0
    };
    this.setState({ address: updateaddress });
  };
  getPostalCode = value => {
    let { address } = this.state;
    let updateaddress = {
      ...address, pinCode: value, latitude: 0,
      longitude: 0
    };
    this.setState({ address: updateaddress });
  };

  onClickAddressForCommunication(visible) {
    this.setState({ showAddressPopup: visible });
    this.props.onClickAddressClose();
  }


  getCurrentLocation = visible => {
    this.setState({
      showAddressPopup: visible,
    });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

  }

  _keyboardDidShow = () => {
    this.setState({ addressViewHeight: 450 })
  }

  _keyboardDidHide = () => {
    this.setState({ addressViewHeight: height - 100 })
  }


  render() {
    let { address } = this.state
    console.log("my pincode:" + JSON.stringify(address))
    console.log("city :" + address.houseNumber)
    return (
      <Form>
        <View style={{ backgroundColor: '#000' }}>
          <Modal
            style={styles.modalWidget}
            animationType={'slide'}
            transparent={true}
            visible={this.state.showAddressPopup || this.props.visible}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => {
              this.onClickAddressForCommunication();
            }}>
              <View style={styles.modalOverlay}></View>
            </TouchableOpacity>

            <View style={{
              height: this.state.addressViewHeight,    // height:height-100,
              width: width,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: 'scroll',
              //height:450,
              // flex:1,
              overflow: 'scroll'
            }}>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}> Add Address</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.onClickAddressForCommunication();
                  }}>
                  <Text style={styles.text}>
                    <IconArrowDown style={styles.icModalClose} />
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{}} >
                <View style={styles.mapContent}>
                  <View style={styles.mapView}>
                    <MapView
                      style={styles.map}
                      provider={PROVIDER_GOOGLE}
                      initialRegion={{
                        latitude: address.latitude ? address.latitude : 0,
                        longitude: address.longitude ? address.longitude : 0,
                        //latitude: 0,
                        //longitude: 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      region={{
                        latitude: address.latitude ? address.latitude : 0,
                        longitude: address.longitude ? address.longitude : 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      // onRegionChange={e =>
                      //   this.getAddress(e.latitude, e.longitude)RMApp-release_without_Login.apk
                      // }
                      onRegionChangeComplete={e =>
                        this.getAddress(e.latitude, e.longitude)
                      }
                    ></MapView>
                    <View
                      style={{
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                      }}>
                      <Image
                        style={styles.icMarker}
                        source={require('../../assets/images/icon_marker.png')}
                      />
                    </View>
                  </View>
                  <View style={styles.locationDetailsWidget}>
                    <View style={styles.currentLocation}>
                      <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => {
                          this.getMyLocation();
                        }}>
                        <IconCurrentLocation style={styles.icLocation} />
                        <Text style={styles.currentLocationText}>
                          Use Current Location
                          </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{}}>
                      <Form style={{ marginLeft: 0 }}>
                        <View style={styles.locationItem}>
                          <AddressTextInput
                            // placeholder="Street Number"
                            label="Street Number"
                            style={styles.locationInput}
                            onValueChanged={text => {
                              this.getStreet(text);
                            }}
                            value={address.houseNumber || ""}
                            returnKeyType={"next"}
                            // autoFocus={true}
                            onSubmitEditing={() => {
                              this.textInput.focus();
                            }}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.text}
                            autoCapitalize="words"
                          />
                        </View>
                        <View style={styles.locationItem}>
                          <AddressTextInput
                            label="Address Line 1"
                            onValueChanged={text => {
                              this.getArea(text);
                            }}
                            value={address.houseDetails || ""}
                            style={styles.locationInput}
                            returnKeyType={"next"}
                            refs={(input) => { this.textInput = input; }}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.text}
                          />
                        </View>
                        <View style={styles.locationItem}>
                          <AddressTextInput
                            label="Address Line 2"
                            onValueChanged={text => {
                              this.getLocality(text);
                            }}
                            value={address.streetName || ""}
                            style={styles.locationInput}
                            returnKeyType={"next"}
                            refs={(input) => { this.secondTextInput = input; }}
                            onSubmitEditing={() => { this.secondTextInput1.focus(); }}
                            blurOnSubmit={false}
                            placeholderTextColor={Colors.text}
                          />
                        </View>
                        <View style={styles.splitFields}>
                          <View style={styles.halfWidth}>
                            <AddressTextInput
                              label="State"
                              onValueChanged={text => {
                                this.getCity(text);
                              }}
                              value={address.stateName || ""}
                              style={styles.locationInput}
                              returnKeyType={"next"}
                              refs={(input) => { this.secondTextInput1 = input; }}
                              onSubmitEditing={() => { this.secondTextInput2.focus(); }}
                              blurOnSubmit={false}
                              placeholderTextColor={Colors.text}
                            />
                          </View>
                          <View style={styles.middleSpace}></View>
                          <View style={styles.halfWidth}>
                            <AddressTextInput
                              label="City"
                              onValueChanged={text => {
                                this.getRealCity(text);
                              }}
                              value={address.cityName || ""}
                              style={styles.locationInput}
                              returnKeyType={"next"}
                              refs={(input) => { this.secondTextInput2 = input; }}
                              onSubmitEditing={() => { this.secondTextInput3.focus(); }}
                              blurOnSubmit={false}
                              placeholderTextColor={Colors.text}
                            />
                          </View>

                        </View>
                        <View style={styles.locationItem}>
                          <AddressPinCodeInput
                            label="Pincode"
                            onValueChanged={text => {
                              this.getPostalCode(text);
                            }}
                            value={address.pinCode || ""}
                            style={styles.locationInput}
                            refs={(input) => { this.secondTextInput3 = input; }}
                            placeholderTextColor={Colors.text}
                            maxLength={6}
                            keyboardType="numeric"
                            blurOnSubmit={false}
                          />
                        </View>
                      </Form>
                      {this.hasValidAddress() ? <TouchableOpacity
                        onPress={this.onClickSaveAddressDetails}>
                        <Text style={styles.btnSaveDetails}>
                          {' '}
                          Save Details
                          </Text>
                      </TouchableOpacity> :
                        <Text style={styles.btnSaveDetailsDisable}>
                          {' '}
                          Save Details
                          </Text>
                      }

                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

          </Modal>
        </View>
      </Form>

    );
  }
}

const styles = StyleSheet.create({
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
  },
  splitFields: {
    flexDirection: 'row',
    marginBottom: 20
  },
  halfWidth: {
    width: '48%'
  },
  middleSpace: {
    width: '4%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    alignItems: 'center',
  },
  modalOverlayBtn: {
    width: '100%',
    height: '100%'
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 'bold'
  },
  mapContent: {
    flexDirection: 'row',
    marginHorizontal: 50,
    marginBottom: 60
  },
  mapView: {
    flex: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  locationDetailsWidget: {
    flex: 5,
    marginHorizontal: 20
  },
  icModalClose: {
    width: 18,
    height: 11,
  },
  icLocation: {
    width: 22,
    height: 22,
  },
  currentLocation: {
    flexDirection: 'row',
    marginBottom: 20
  },
  currentLocationText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10
  },
  locationItem: {
    marginBottom: 20
  },
  locationInput: {
    borderWidth: 0,
    // borderBottomColor: Colors.primary,
    // borderBottomWidth: 0.5,
    // marginTop:-10
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    marginTop: 20,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },
  btnSaveDetailsDisable: {
    width: 150,
    height: 40,
    marginTop: 20,
    backgroundColor: '#ba636a',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },

  icMarker: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginTop: -35
  }
});
