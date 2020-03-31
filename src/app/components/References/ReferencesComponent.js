import React, {Component} from 'react';
import {
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  UIManager,
  Platform,
  Modal,Keyboard
} from 'react-native';
import {connect} from 'react-redux';
import NetworkStatusToast from '../NetworkStatusToast';
import styles from './ReferencesComponentStlye';
import ReferencesItemComponent from './ReferencesItemComponent';
import IconAdd from '../../assets/images/icon_add.svg';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import ReferencesServices from '../../Database/Services/References/ReferencesServices';
import NameInput from '../customcomponents/NameInput';
import PhoneNumberInput from '../customcomponents/PhoneNumberInput';
import {CHAR_LIMIT_FOR_NAME_FIELD} from '../../constants/AddCase/AddCaseConstants';
import {Radio, Form} from 'native-base';
import Colors from '../../styles/Colors';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ReferencesComponent extends Component {
  constructor() {
    super();
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      listDataSource: [],
      showAddReferenceModal: false,
      ViewHeight: height - 100,
      entityName: '',
      contactPerson: '',
      contactNumber: '',
      designation: '',
      city: '',
      remarks: '',
      contacted: 'No',
      updateComp:false
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
   this.getAllReferencesFromDB();
  }

  getAllReferencesFromDB(){
    var rs = new ReferencesServices();

    rs.getAllReferences().then(res =>
      this.setState({listDataSource: res}, () => {
        // this.props.onbankReferenceDataUpdate(res);
      }),
    );
  }
  updateLayout(index) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );

    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  }
  onClickAddNewReferences = () => {
    let data = {
      caseId: 1,
      entityName: this.state.entityName,
      contactPerson: this.state.contactPerson,
      contactNumber: this.state.contactNumber == ""?0:parseInt(this.state.contactNumber),
      designation: this.state.designation,
      city: this.state.city,
      remarks: this.state.remarks,
      // percentageOfCreditTransaction:'Nil',
      // source:'RM',
      // referenceType:'Other Market Reference'
    };
    var rs = new ReferencesServices();

    rs.addReferenceDetails(data, 1).then(res =>
      rs.getAllReferences().then(res => this.setState({listDataSource: res,showAddReferenceModal:false, entityName:"",
        contactPerson: "",
        contactNumber: "",
        designation:"",
        city: "",
        remarks:""})),
    );
  };

  _keyboardDidShow = () => {
    this.setState({ ViewHeight: 350 });
  };

  _keyboardDidHide = () => {
    this.setState({ ViewHeight: height - 100 });
  };
  render() {
    return (
      <View style={styles.Container}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              marginLeft: 40,
              justifyContent: 'space-between',
            }}>
            <View style={styles.refFormContainer}>
              <View style={{width: '90%', marginTop: 10, marginHorizontal: 29}}>
                <Text style={styles.title}>References</Text>
              </View>
              {this.state.listDataSource.map((item, key) => (
                <ReferencesItemComponent
                  key={item.id}
                  onClickFunction={() => this.updateLayout(key)}
                  item={item}
                  updateParent={()=>this.getAllReferencesFromDB()}
                />
              ))}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                  width: '92%',
                  alignSelf: 'center',
                }}>
               {this.state.listDataSource.length !=0 ?<View style={{height: 70, justifyContent: 'center'}}>
                  <TouchableOpacity onPress={() => {}}>
                    <View>
                      <Text style={styles.btnSaveDetails}>Sumbit</Text>
                    </View>
                  </TouchableOpacity>
                </View>: null}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                  }}>
                  <View style={{height: 70, justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({showAddReferenceModal: true,
                        updateComp:!this.state.updateComp})
                      }>
                      <View style={{flexDirection: 'row'}}>
                        <IconAdd />
                        <Text style={styles.addGurantorText}>
                          {' '}
                          Add New Reference
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.documentStatusContainer}></View>
          </View>
          <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.showAddReferenceModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.modalOverlayBtn}
            onPress={() => {
              this.setState({showAddReferenceModal: false});
            }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>

          <View
            style={{
              height: this.state.ViewHeight,
              width: width,
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              //  overflow:'scroll',
            }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Reference</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showAddReferenceModal: false});
                }}>
                <Text style={styles.text}>
                  <IconArrowDown style={styles.icModalClose} />
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{width: '100%',height:500}}>
                <View
                  style={{
                    marginLeft: 60,
                    marginRight:60,
                    height:360
                    //  marginTop: -30,
                    // marginBottom: 35,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '31%'}}>
                      <NameInput
                        label="Entity Name"
                        value={this.state.entityName}
                        onValueChanged={text =>
                          this.setState({entityName: text})
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                    <View style={{width: '31%'}}>
                      <NameInput
                        label="Contact Person"
                        value={this.state.contactPerson}
                        onValueChanged={text =>
                          this.setState({contactPerson: text})
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                    <View style={{width: '31%'}}>
                      <PhoneNumberInput
                        label="Contact Number"
                        value={this.state.contactNumber.toString()}
                        onValueChanged={text =>
                          this.setState({contactNumber: text})
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop:20
                    }}>
                    <View style={{width: '31%'}}>
                      <NameInput
                        label="Designation"
                        value={this.state.designation}
                        onValueChanged={text =>
                          this.setState({designation: text})
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                    <View style={{width: '31%'}}>
                      <NameInput
                        label="City"
                        value={this.state.city}
                        onValueChanged={text =>
                          this.setState({
                            city: text,
                          })
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                    <View style={{width: '31%'}}>
                      <NameInput
                        label="Remarks"
                        value={this.state.remarks}
                        onValueChanged={text =>
                          this.setState({
                            remarks: text,
                          })
                        }
                        returnKeyType={'next'}
                        autoFocus={false}
                        // onSubmitEditing={event => {
                        //   this._inputRef._root.focus();
                        // }}
                        maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      />
                    </View>
                  </View>
                  <View
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 20,
                    marginTop:50
                  }}>
                  <Text
                    style={{
                      color: Colors.darkenGray,
                      fontSize: 11,
                      fontFamily: 'Helvetica',
                      marginLeft: 0,
                      marginBottom: 5,
                      marginTop: 0,
                    }}>
                    Contacted
                  </Text>
                  <View style={styles.radioContainer}>
                    <View style={styles.radioWidget}>
                      {this.state.contacted == 'Yes' ? (
                        <Radio
                          style={styles.radioButton}
                          color={'#58595b'}
                          selected={true}
                          selectedColor={'#9d1d28'}
                          onPress={() => this.setState({contacted: 'Yes'})}
                        />
                      ) : (
                        <Radio
                          style={styles.radioButton}
                          color={'#58595b'}
                          selected={false}
                          onPress={() => this.setState({contacted: 'Yes'})}
                          selectedColor={'#9d1d28'}
                        />
                      )}

                      <Text style={styles.radioLabel}>Yes</Text>
                    </View>
                    <View style={styles.radioWidget}>
                      {this.state.contacted == 'No' ? (
                        <Radio
                          style={styles.radioButton}
                          color={'#58595b'}
                          selected={true}
                          selectedColor={'#9d1d28'}
                          onPress={() => this.setState({contacted: 'No'})}
                        />
                      ) : (
                        <Radio
                          style={styles.radioButton}
                          color={'#58595b'}
                          selected={false}
                          onPress={() => this.setState({contacted: 'No'})}
                          selectedColor={'#9d1d28'}
                        />
                      )}

                      <Text style={styles.radioLabel}>No</Text>
                    </View>
                  </View>
                  <View
                  style={{
                    flexDirection: 'row',
                    marginTop:60,paddingBottom:50
                  }}>
                  {this.state.entityName?<TouchableOpacity onPress={this.onClickAddNewReferences}>
                    <View>
                      <Text style={styles.btnSaveDetails}>Add</Text>
                    </View>
                  </TouchableOpacity>: <View>
                      <Text style={styles.btnSaveDetailsDisable}>Add</Text>
                    </View>}
                  <TouchableOpacity
                    onPress={() => this.setState({showAddReferenceModal:false})}>
                    <Text style={[styles.btnWithBorder, {marginLeft: 20}]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}></View>
                </View>
              
                </View>

                
              </View>
            </ScrollView>
          </View>
        </Modal>
      
        </ScrollView>
        
        
      </View>
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
}
const mapStateToProps = state => {
  return {
    referenceData: state.referenceReducer.referenceData,
    isUpdated: state.referenceReducer.isUpdated,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onbankReferenceDataUpdate: text =>
      dispatch({type: 'REFERENCE_DATA', payload: text}),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReferencesComponent);
//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT = [
  {
    isExpanded: false,
    category_name: 'Item 1',
    subcategory: [
      {id: 1, val: 'Sub Cat 1'},
      {id: 3, val: 'Sub Cat 3'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 2',
    subcategory: [
      {id: 4, val: 'Sub Cat 4'},
      {id: 5, val: 'Sub Cat 5'},
    ],
  },
];
