import React ,{Component} from 'react';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import AddressTextInput from './AddressTextInput';
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
import MapView , {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import IconCurrentLocation from '../../assets/images/icon_current_location.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class Addressodel extends Component {

 constructor(props) {
    super(props);
    this.state = {
      showAddressPopup: false,
      address: {
        latitude: 0,
        longitude: 0,
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        stateName: '',
        pinCode: '',
      },
      addressViewHeight:height-50
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
     // this.setState({address:this.props.value})
    //  console.log('address',this.props.value)
  }  

  onUpdateAddressDetails(address){
      this.setState({address})
  }
  onClickSaveAddressDetails = () => {
    let {address} = this.state;
    if (
      address.houseNumber !== '' ||
      address.houseDetails !== '' ||
      address.streetName !== '' ||
      address.stateName !== '' ||
      address.pinCode != ''
    ) {
      this.onClickAddressForCommunication();
      this.props.onClickSaveAddress(address); 
    
    } else {
      //this.onClickAddressForCommunication();
    }
    
  };

  hasValidAddress(){

       let {address} = this.state;
      // console.log('address12',address)
    if (
      (address.houseNumber !== '' && address.houseNumber != null) ||
      (address.houseDetails !== '' && address.houseDetails != null) ||
      (address.streetName !== '' && address.streetName != null) ||
      (address.stateName !== '' && address.stateName != null) ||
      (address.pinCode != '' && address.pinCode != null)
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
        let addressBygeoaddress = res.results[0];
          let apiAddress = this.formattedAddress(addressBygeoaddress)
        this.setState({

          address: {
            latitude: latitude,
            longitude: longitude,
            houseNumber: apiAddress.houseNumber,
            houseDetails: apiAddress.houseDetails,
            streetName: apiAddress.streetName,
            stateName: apiAddress.stateName,
            pinCode: apiAddress.pinCode,
          },
        });
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

  formattedAddress = (place) =>{
    let address = {
       houseNumber:'',
       houseDetails:'',
       streetName: '',
       stateName: '',
       pinCode: '',
    }
         for (var i = 0; i < place.address_components.length; i++) {
      for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == "sublocality_level_2") {
          address = {...address,houseNumber:place.address_components[i].long_name}
        }
          if (place.address_components[i].types[j] == "sublocality_level_1") {
          address = {...address,houseDetails:place.address_components[i].long_name}
        }
          if (place.address_components[i].types[j] == "administrative_area_level_2") {
          address = {...address,streetName:place.address_components[i].long_name}
        }
          if (place.address_components[i].types[j] == "administrative_area_level_1") {
          address = {...address,stateName:place.address_components[i].long_name}
        }
          if (place.address_components[i].types[j] == "postal_code") {
          address = {...address,pinCode:place.address_components[i].long_name}
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
              console.log('res : ', res.results[0]);
              let addressBygeoaddress = res.results[0];
               let apiAddress = this.formattedAddress(addressBygeoaddress)
          
              this.setState({

                address: {
                 // latitude: addressBygeocoords.latitude,
                 // longitude: addressBygeocoords.longitude,
                 latitude: info.coords.latitude,
                 longitude: info.coords.longitude,
                  houseNumber: apiAddress.houseNumber,
                  houseDetails: apiAddress.houseDetails,
                  streetName: apiAddress.streetName,
                  stateName: apiAddress.stateName,
                  pinCode: apiAddress.pinCode,
                },
              });
            });
        },
        error => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (err) {
      console.log(err);
    }
  };
  getStreet = value1 => {
    let {address} = this.state;
    let {value} = this.props
    value = {...value, houseNumber: value1}
    let updateaddress = {...address, houseNumber: value1, latitude: 0,
        longitude: 0};
    this.setState({address: updateaddress});
  };
  getArea = value => {
    let {address} = this.state;
    let updateaddress = {...address, houseDetails: value, latitude: 0,
        longitude: 0};
    this.setState({address: updateaddress});
  };
  getLocality = value => {
    let {address} = this.state;
    let updateaddress = {...address, streetName: value, latitude: 0,
        longitude: 0};
    this.setState({address: updateaddress});
  };
  getCity = value => {
    let {address} = this.state;
    let updateaddress = {...address, stateName: value, latitude: 0,
        longitude: 0};
    this.setState({address: updateaddress});
  };
  getPostalCode = value => {
    let {address} = this.state;
    let updateaddress = {...address, pinCode: value, latitude: 0,
        longitude: 0};
    this.setState({address: updateaddress});
  };

  onClickAddressForCommunication(visible) {
    this.setState({showAddressPopup: visible});
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
 this.setState({addressViewHeight:450})
}

_keyboardDidHide = () => {
  this.setState({addressViewHeight:height-100})
}


    render(){
             let {address} = this.state
             console.log(address)
        return (
               <Form>
               <View style={{backgroundColor: '#000'}}>
             
            </View>
             </Form>
            
        );
    }
}

const styles = StyleSheet.create({
  modalWidget:{
    backgroundColor:'red',
    height:height,
    flex:0.5,
    margin: 15,
  },
  modalHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:50,
    marginVertical:50,
    alignItems:'center',
  },
  modalOverlayBtn:{
    width:'100%',
    height:'100%'
  },
  modalOverlay:{
    backgroundColor:'rgba(0,0,0,0.5)',
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    top:0
  },
  modalTitle:{
    color:Colors.text,
    fontFamily: "Helvetica",
    fontSize:18,
    fontWeight:'bold'
  },
  mapContent:{
    flexDirection:'row',
    marginHorizontal:50,
    marginBottom:60
  },
  mapView:{
    flex:3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map:{
    position:'absolute',
    left:0,
    top:0,
    bottom:0,
    right:0
  },
  locationDetailsWidget:{
    flex:5,
    marginHorizontal:20
  },
  icModalClose:{
    width:18,
    height:11,
  },
  icLocation:{
    width:22,
    height:22,
  },
  currentLocation:{
    flexDirection:'row',
    marginBottom:40
  },
  currentLocationText:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    marginLeft:10
  },
  locationItem:{
    marginBottom:20
  },
  locationInput:{
    borderWidth:0,
    borderBottomColor:Colors.primary,
    borderBottomWidth:0.5,
    // marginTop:-10
  },
  btnSaveDetails:{
    width:150,
    height:40,
    marginTop:20,
    backgroundColor:'#9d1d28',
    color:'#fff',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'700',
    padding:10,
    textAlign:'center',
    borderRadius:20
  },
  btnSaveDetailsDisable:{
    width:150,
    height:40,
    marginTop:20,
    backgroundColor: '#ba636a',
    color:'#fff',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'700',
    padding:10,
    textAlign:'center',
    borderRadius:20
  },
 
    icMarker:{
      width:35,
      height:35,
      alignSelf:'center',
      marginTop:-35
    }
  });
