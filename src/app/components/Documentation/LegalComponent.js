import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  Picker,
  Modal,
  TouchableOpacity,
  SectionList,
  ScrollView,
  Keyboard
} from 'react-native';
import {Form, Item, Input, Label, Icon, Card, CheckBox} from 'native-base';
import { Avatar } from 'react-native-elements';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import PopupMenu from '../customcomponents/PopupMenu';
import EntityService from '../../Database/Services/CaseDetails/EntityService';
import FloatingLabelNameInput from "../customcomponents/FloatingLabelNameInput";
import NameInput from "../customcomponents/NameInput";
import PhoneNumberInput from "../customcomponents/PhoneNumberInput";
import { CHAR_LIMIT_FOR_NAME_FIELD } from '../../constants/AddCase/AddCaseConstants';
import IconAddress from '../../assets/images/icon_address.svg';
import IconAdd from '../../assets/images/icon_add.svg';
import AddressModel from '../customcomponents/AddressModel';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import IconArrowDownSvg from '../../assets/images/icon_arrow_down.svg';
import IconCheck from '../../assets/images/icon_check.svg'
import {connect} from 'react-redux';
import AsyncStorageFunc from '../../utilities/asyncStorage';
import { ASYNCSTORAGE } from '../../constants/AsyncStorage/asyncStorageConstants';
import CollateralService from '../../Database/Services/CaseDetails/CollateralService';
import AddressService from '../../Database/Services/CaseDetails/AddressService';
import IconIncrement from '../../assets/images/icon_plus.svg';
import IconDecrement from '../../assets/images/icon_minus.svg';
import CurrencyInput from '../customcomponents/CurrencyInput';
import { Platform } from 'react-native';
import Share from 'react-native-share';
import CaseService from "../../Database/Services/CaseDetails/CaseService";
import CaseSyncService from "../../Database/Services/onlineOffline/caseSyncService";
import ApiManager from "../../api/apiManager";
import {CASE_CONSTANTS,CASE_CONSTANTS_STATUS} from "../../constants/CaseConstants/caseConstants";

const collateralServiceObj = new CollateralService();
const caseService = new CaseService();
const caseSyncService = new CaseSyncService();
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const popupMenuItem = []

class LegalComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProgram: {},
      layoutShow: true,
      collateralCollection :[],
      freshCollateralls: [],
      selectedCollaterals : [],
      entityName: '',
      showAddressPopup: false,
      showAddressPopupForNew: false,
      showAddColModel: false,
      showChecklistModel: false,
      address: {
        latitude: 0,
        longitude: 0,
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        stateName: '',
        cityName: '',
        pinCode: '',
      },
      collateralIndex: null,
      index: null,
      newIndex: null,
      isModified: false,
      checkList: [],
      collateralViewHeight: height - 100
    }

    this.addressElement = React.createRef();
    this.focusTheField = this.focusTheField.bind(this);
  }

  focusTheField = (id) => {
    this.inputs[id].focus();
  }

  render() {
    let selectedCollaterals = this.state.selectedCollaterals;
    let{collateralCollection} = this.state;
    let checklist = this.state.checkList; 
    // [{id: 1, title: 'Property Related Documents for Valuation', 
    // data: [{id: 1, name: 'Latest Title / Sales Deed for Property offered as Security'},
    //   {id: 2, name: 'Share Certificate (if applicable)'},
    //   {id: 3, name: 'Approved Sanction Plan (if applicable)'},
    //   {id: 4, name: 'Latest Tax Paid Receipt (if available)'},
    //   {id: 5, name: 'Latest Electricity Bill Paid copy (if available)'},
    //   {id: 6, name: 'OC (if applicable)'},
    //   {id: 7, name: 'Latest Land Revenue Records (as per applicable state)'},
    // ]},
    //   {id: 2, title: 'Property Related Documents for legal', data: [{id: 1, name: 'Latest Title / Sales Deed for Property'},
    //   {id: 2, name: 'Chain Deed of the property (if applicable)'},
    //   {id: 3, name: 'OC (if applicable)'},
    //   {id: 4, name: 'Share Certificate (if applicable)'},
    //   {id: 5, name: 'Latest Land Revenue Records (as per applicable state)'},
    //   {id: 6, name: 'Latest Tax Paid Receipt (if available)'},
    //   {id: 7, name: 'Mutation Certificate (if applicable)'},
    // ]}]
    return (

      <View style={styles.MainContainer}>
        <View style={[styles.Viewtop]}>
          <View style={[styles.userImageWidget]}>
            <View style={styles.userImage}>
            <Avatar overlayContainerStyle={{backgroundColor: Colors.text}} titleStyle={{fontSize:10,fontWeight:'bold'}} containerStyle={{height:25,width:25}} rounded title= {this.state.entityName.length>2?this.state.entityName.substring(0,2):''}/>
            </View>

            <Text style={styles.icName}>
              {this.state.entityName}{' '}
              <Text style={styles.icProgram}> 
                | {this.state.selectedProgram.name} Program
              </Text>
            </Text>
          </View>
          <View style={{flex:1,alignItems:"flex-end",marginRight:25}}>
            </View>
          <View>
            {/* <IconMore /> */}
            <PopupMenu 
            actions={popupMenuItem} 
            onPress={this.onPopupEvent} 
            />
          </View>
        </View>
        <View></View>
        <ScrollView style={{width: '90%'}}>
          {selectedCollaterals.map((data, index) => (

            data.collateralSubTypeId != '01' && data.collateralSubTypeId != '02' &&

            <View style={index != 0 && {marginTop: 20}}>
            <Card style={styles.Cardtop}>
              <View style={styles.progressBarWidget}>
                <View style={styles.progressBarContent}>
                  <View style={{flex:4}}>
                    <Text style={styles.progressBarTitle}>
                      Collateral #{index+1} / {data.collateralName}
                    </Text>
                  </View>
                  <View style={{flex:1, flexDirection: 'row'}}>
                      <View 
                      style={styles.checkBoxStyle} 
                      // style={{ position: 'absolute', right: -200, flexDirection: 'row' }}
                      >
                        <CheckBox
                          style={styles.checkboxInputAddLater}
                          checked={data.isLegalCheckComplete}
                          onPress={() => this.onCheckedLegalComplete(index)}
                          color={Colors.text}
                        />
                        <Text>Legal</Text>
                      </View>
                      <View 
                      style={styles.checkBoxStyle} 
                      // style={{ position: 'absolute', right: -200, flexDirection: 'row' }}
                      >
                        <CheckBox
                          style={styles.checkboxInputAddLater}
                          checked={data.isValuationCheckComplete}
                          onPress={() => this.onCheckedValuationComplete(index)}
                          color={Colors.text}
                        />
                        <Text>Valuation</Text>
                      </View>
                    </View>
                </View>
              </View>
            </Card>

            <View style={styles.CardMain}>
              <Form>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, paddingTop: 18, marginTop: -5}}>
                      <Picker      
                          style={{
                            fontFamily: "Helvetica",
                            height: 40,
                            borderBottomColor: 'black',
                            borderBottomWidthWidth: 1,
                            borderRadius: 1,
                            marginTop: 24, 
                            ...Fonts.style.normal,
                            fontFamily: 'Helvetica',
                            fontWeight: 'bold',
                            color: Colors.text,
                            marginLeft: -8
                          }}
                          selectedValue={data.propertyStatus == ""?"Property Type":data.propertyStatus}
                          onValueChange={(itemValue) => this.onChangePropertyStatus1(index,itemValue)}
                          // enabled={collateralsAddLater ? false : true}
                        >
                        <Picker.Item label="Property Type" value="Property Type" />
                        <Picker.Item label="Self Occupied" value="Self Occupied" />
                        <Picker.Item label="Let Out" value="Let Out" />
                        </Picker>
                        <View
                          style={{
                            backgroundColor: '#ffffff',
                            // opacity: 2,
                            position: "absolute",
                            bottom: 12,
                            right: 0,
                            height:20,
                            width:40,
                            alignItems:'flex-end',
                            justifyContent:'center',
                            fontSize: 20
                          }}
                          >
                          <IconArrowDownSvg/>
                        </View>
                        <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5}}/>
                  </View>
                  <View style={{flex: 1, padding: 10}}>
                    <NameInput
                      label="Name of Contact Person"
                      value={data.contactPerson}
                      onValueChanged={text => this.onChangeContactPerson1(index,text)}
                      autoFocus = {false}
                      // disabled={collateralsAddLater ? true : false}
                    />
                  </View>
                  <View style={{flex: 1, padding: 10}}>
                      {/* <FloatingLabelNameInput
                          label="Contact Number"
                          // value={this.state.entityName}
                          // onValueChanged={text => this.onChangeEnityName(text)}
                          returnKeyType={'next'}
                          // autoFocus={true}
                          // onSubmitEditing={() => { this.focusTheField('promoter_name'); }}
                          // maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                      /> */}
                      <NameInput
                        label="Contact Number"
                        value={data.contactNumber+''}
                        onValueChanged={text => this.onChangeContactNumber1(index,text)}
                        autoFocus = {false}
                        // disabled={collateralsAddLater ? true : false}
                      />
                  </View>
                </View>

                <View style={[styles.addressWidget,{marginLeft:0}]}>
                  <View style={styles.icAddressWidget}>
                    <TouchableOpacity
                      style={{flex: 1}}
                      onPress={() => {
                          this.getCurrentLocation(true, index);
                      }}>
                        <View style={styles.addressField}>
                            {this.isAddressValid(data.address) ? (
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        flexWrap: 'wrap',
                                        marginRight: 40,
                                    }}>
                                    <Text style={[styles.addressLabel, { marginTop: -10 }]}>
                                        Address for communication
                                        </Text>
                                    <Text style={styles.addressText}>
                                        {this.formattedAddressString(data.address)}
                                    </Text>
                                </View>
                            ) : (
                                  <View>
                                    <Text style={styles.addressLabel}>
                                        Address for communication
                                    </Text>
                                  </View>
                                )}
                            <View style={styles.icAddress}>
                              <IconAddress />
                            </View>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* <View style={{ padding: 10}}>
                  <Label style={ styles.labelFocus }>Common Collateral </Label>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 2,flexDirection: 'row'}}>
                      <View 
                      style={styles.checkBoxStyle} 
                      // style={{ position: 'absolute', right: -200, flexDirection: 'row' }}
                      >
                        <CheckBox
                          style={styles.checkboxInputAddLater}
                          checked={this.state.collateralsAddLater}
                          onPress={this.onCheckedCollateralsAddLater}
                          color={Colors.text}
                        />
                        <Text>Hunar Enterprises PVT LTD.</Text>
                      </View>
                      <View 
                      style={styles.checkBoxStyle} 
                      // style={{ position: 'absolute', right: -200, flexDirection: 'row' }}
                      >
                        <CheckBox
                          style={styles.checkboxInputAddLater}
                          checked={this.state.collateralsAddLater}
                          onPress={this.onCheckedCollateralsAddLater}
                          color={Colors.text}
                        />
                        <Text>Hunnar son's Company</Text>
                      </View>
                    </View>
                    <View style={{flex: 1,flexDirection: 'row'}}>

                    </View>
                    
                  </View>
                </View> */}

                <View style={{flexDirection: 'row', padding: 10}}>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        // Linking.openURL('mailto:support@example.com')
                      this.onInitiateLegal(index)
                      }
                        
                      }
                    >
                      <View>
                        <Text style={styles.btnSubmitUI}>
                          {" "}
                          Initiate Legal
                      </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style = {{marginLeft: 40}}
                      onPress={() =>
                        this.onInitiateValuation(index)
                      }
                    >
                      <View>
                        <Text style={styles.btnSubmitUI}>
                          {" "}
                          Initiate Valuation
                      </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({showChecklistModel: true})
                      }
                    >
                      <Text style={{color: '#58595b', fontSize: 14, textDecorationLine: 'underline', fontWeight: 'bold'}}>
                        View Document Checklist
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </Form>
            </View>
          </View>

            

            
          )
          )}

          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20}}>
            <View>
              {/* <TouchableOpacity
                onPress={() => {
                  console.log('now i clicked add collateral')
                  this.setState({collateralCollection: this.state.freshCollateralls})
                  this.setState({showAddColModel: true})

                }
                }
              >
                <View style={{flexDirection: 'row'}}>
                  <IconAdd/>
                  <Text style={{color: '#58595b', fontSize: 14, marginLeft: 10}}>
                    Add collateral
                  </Text>
                </View>
                
              </TouchableOpacity>    */}
            </View>
            <View>
              
            </View>
          </View>
        
          <AddressModel
            visible={this.state.showAddressPopup}
            address={this.state.address}
            ref={component => this.addressElement1 = component}
            onClickAddressClose={() => {
              this.setState({ showAddressPopup: false })
              this.addressElement1.onUpdateAddressDetails(this.state.address)
            }}
            onClickSaveAddress={(address) => {
              this.onClickSaveAddressDetails(address)
            }}
          />

          <AddressModel
            visible={this.state.showAddressPopupForNew}
            address={this.state.address}
            ref={component => this.addressElement = component}
            onClickAddressClose={() => {
              this.setState({ showAddressPopupForNew: false })
              this.addressElement.onUpdateAddressDetails(this.state.address)
            }}
            onClickSaveAddress={(address) => {
              this.onClickSaveAddressDetailsForNew(address)
            }}
          />
        
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showAddColModel}
          transparent={true}
          onRequestClose={() => {
            this.setState({showAddColModel: false})
          }}
        >
          <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => {
            this.onClickCloseAddCollateral();
          }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>
          <View style={[styles.modal,{height: this.state.collateralViewHeight}]}>

            {/* <Text>Add Collateral</Text> */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}> Add Collateral</Text>
              <TouchableOpacity
                onPress={() => {
                  // this.onClickAddressForCommunication();
                  this.setState({showAddColModel: false})
                }}>
                <Text style={styles.text}>
                  <IconArrowDown style={styles.icModalClose} />
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={[styles.collateralContainer,]}>
                <View style={{}}>
                  <View style={{flexDirection: 'row', marginBottom: 20}}>
                    <Text style={styles.heading}>What type of collateral are you willing to Provide?</Text>
                    
                  </View>
                
                  {collateralCollection.map((collateral, collateralIndex)=>(
                    <View>
                    <View >
                    <View style={styles.checkboxWidget}>
                    <CheckBox
                      style={styles.checkboxInput}
                      checked={collateral.isChecked}
                      onPress={()=>this.onToggleCollateral(collateralIndex,collateral.name)}
                      color={Colors.text}
                    />
                    <Text style={styles.checkboxLabel}>{collateral.description}</Text>
                      {this.hasPropertyValue(collateralIndex)?<View style={styles.incrementWidget} >
                        <TouchableOpacity 
                          onPress={()=>this.onDecrementProperty(collateralIndex)}
                          >
                          <IconDecrement />
                        </TouchableOpacity>
                          <Text style={styles.counterText}> {collateral.collateralValues.length}</Text>
                          <TouchableOpacity 
                            onPress={()=>this.onIncrementProperty(collateralIndex)}
                            >
                            <IconIncrement />
                          </TouchableOpacity>
                      </View>:null}
                    </View>
                    {collateral.collateralValues ?<View style={styles.addPropertyWidget}>
                    {collateral.collateralValues.map((data, index) => (
                    <View >
                      <View style={{}}>
                        <View style={{flexDirection:'row',marginLeft:25,marginTop:-20,marginBottom:35, justifyContent:'space-between'}}>
                          <View style={{width:'48%',}}>
                            <CurrencyInput keyboardType='numeric'
                              label = {'Enter value of the property'}
                              value={data.totalValues+''}
                              formHandle={(text) => this.onChangePropertyValue(collateralIndex,index,text)}
                              autoFocus = {false}
                              // disabled={collateralsAddLater ? true : false}
                            />
                          </View>
                          <View style={{width:'48%',}}>
                            <Picker
                              // style={{ 
                              //   borderBottomColor: 'black',
                              //   borderBottomWidthWidth: 1,
                              //   borderRadius:1,
                              //   marginTop:12,
                              //   transform: [{ scaleX: 1 }, { scaleY: 1 },]}} 
                              //   itemStyle={{color:'red'
                              // }}
                              // iosIcon={<Icon name="arrow-down" />}
                              style={{
                                fontFamily: "Helvetica",
                                height: 40,
                                borderBottomColor: 'black',
                                borderBottomWidthWidth: 1,
                                borderRadius: 1,
                                marginTop: 24, 
                                ...Fonts.style.normal,
                                fontFamily: 'Helvetica',
                                fontWeight: 'bold',
                                color: Colors.text,
                                marginLeft: -8
                              }}
                              selectedValue={data.propertyStatus == ""?"Property Type":data.propertyStatus}
                              onValueChange={(itemValue) => this.onChangePropertyStatus(collateralIndex,index,itemValue)}
                              // enabled={collateralsAddLater ? false : true}
                            >
                            <Picker.Item label="Property Type" value="Property Type" />
                            <Picker.Item label="Self Occupied" value="Self Occupied" />
                            <Picker.Item label="Let Out" value="Let Out" />
                            </Picker>
                            <View
                              style={{
                                backgroundColor: '#ffffff',
                                // opacity: 2,
                                position: "absolute",
                                bottom: 12,
                                right: 0,
                                height:20,
                                width:40,
                                alignItems:'flex-end',
                                justifyContent:'center',
                                fontSize: 20
                              }}
                              ><IconArrowDownSvg/>
                              </View>
                              <View style={{ borderBottomColor: Colors.darkGray, borderBottomWidth: 0.5}}/>
                            </View>    
                          </View>

                          <View style={{flexDirection:'row',marginLeft:25,marginTop:-20,marginBottom:35, justifyContent:'space-between'}}>
                            <View style={{width:'48%',}}>
                              <NameInput
                                label="Name of Contact Person"
                                value={data.contactPerson}
                                onValueChanged={text => this.onChangeContactPerson(collateralIndex,index,text)}
                                autoFocus = {false}
                                // disabled={collateralsAddLater ? true : false}
                              />
                            </View>
                            <View style={{width:'48%',}}>
                              <NameInput 
                                label="Contact Number"

                                value={data.contactNumber}
                                onValueChanged={text => this.onChangeContactNumber(collateralIndex,index, text)}
                                autoFocus = {false}
                              />
                            </View>
                          </View>
                        </View>

                        <View style={[styles.addressWidget2]}>
                          <View style={styles.icAddressWidget2}>
                            <TouchableOpacity
                            style={{flex: 1}}
                            onPress={() => {
                                this.getCurrentLocationNew(true,collateralIndex,index);
                            }}>
                              <View style={styles.addressField2}>
                                <View>
                                {data.address && this.isAddressValid(data.address) ? 
                                  (
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            flexWrap: 'wrap',
                                            marginRight: 40,
                                        }}>
                                        <Text style={[styles.addressLabel2, { marginTop: -10 }]}>
                                            Address for communication
                                            </Text>
                                        <Text style={styles.addressText2}>
                                            {this.formattedAddressString(data.address)}
                                        </Text>
                                    </View>
                                  ) 
                                : 
                                  (
                                    <Text style={styles.addressLabel2}>
                                        Address for communication
                                    </Text>
                                  )
                                }
                                </View>
                                <View style={styles.icAddress2}>
                                  <IconAddress />
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>                      
                        </View>
                      </View >
                    ))}

                  </View>
                    :null}

                  </View>
                </View>
                ))}

                </View>
                <View style={{alignItems: 'flex-start', marginBottom: 20}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.onClickSaveCollaterals()
                    }
                  >
                    <View>
                      <Text style={styles.btnSubmitUI}>
                        {" "}
                        Submit
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showChecklistModel}
          transparent={true}
          onRequestClose={() => {
            this.setState({showAddColModel: false})
          }}
        >

          <TouchableOpacity style={styles.modalOverlayBtn} onPress={() => {
            this.onClickCloseChecklist();
          }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>
       
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Check-list</Text>
              <TouchableOpacity
                onPress={() => {
                  // this.onClickAddressForCommunication();
                  this.setState({showChecklistModel: false})
                }}>
                <Text style={styles.text}>
                  <IconArrowDown style={styles.icModalClose} />
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{paddingLeft: 50}}>
              {checklist.map((data, index) => (
                <View>
                  <View style={styles.checklistHeader}>
                    <Text style={styles.sectionTitle}>{data.docType}</Text>
                  </View>
                  {data.documents.map((item, index) => (
                    <View style={styles.sectionItem}>
                      <View style={{paddingRight: 10}}>
                        <IconCheck />
                      </View>
                      <Text syle={styles.sectionItemText}>{item.documentName}</Text>
                    </View>
                  )) 

                  }
                </View>
              ))
              }
              <View style={{alignItems: 'flex-start', marginBottom: 40, marginTop: 40}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({showChecklistModel: false})
                  }
                >
                  <View>
                    <Text style={styles.btnResetDetails}>
                      {" "}
                      Close
                  </Text>
                  </View>
                </TouchableOpacity>
              </View>
                
              </ View>
            </ScrollView>
          </View>
        </Modal>  
        </ScrollView>
      </View>
    );
  }

  onClickCloseAddCollateral() {
    this.setState({ showAddColModel: false });
  }

  onClickCloseChecklist() {
    this.setState({showChecklistModel: false})
  }

  onPopupEvent = (eventName, index) => {
    if (eventName !== 'itemSelected') return
    if (index === 0) {
      this.props.navigation.replace('SelectProgram', { comingFrom: 'DocumentComponent', selectedProgram: this.state.selectedProgram })
    }
  }

  onInitiateLegal(index) {
 
    let selectedCollateral = this.state.selectedCollaterals[index]


    let title = ''
    let subject = 'Legal Initiation request - '+this.state.entityName+'_Collateral'+(index+1)
    let message = '\nWe request you to initiate Legal process for the below mentioned collateral,\n\n'+
                  selectedCollateral.propertyStatus+'\n'+  //collateral type
                  this.formattedAddressString(selectedCollateral.address)+'\n'+  //collateral address
                  selectedCollateral.contactPerson+'\n'+  //collateral contact person
                  selectedCollateral.contactNumber;       //collateral contact number

    this.shareMail(title, subject, message)
    
  }

  onInitiateValuation(index) {

    let selectedCollateral = this.state.selectedCollaterals[index]
    let title = ''
    let subject = 'Valuation Initiation request - '+this.state.entityName+'_Collateral'+(index+1)
    let message = '\nWe request you to initiate Valuation process for the below mentioned collateral,\n\n'+
                  selectedCollateral.collateralName+'\n'+  //collateral name
                  this.formattedAddressString(selectedCollateral.address)+'\n'+  //collateral address
                  selectedCollateral.contactPerson+'\n'+  //collateral contact person
                  selectedCollateral.contactNumber;       //collateral contact number

    this.shareMail(title, subject, message)
  }

  shareMail(title, subject, message) {

    this.onSaveCollateral()
   
    const options = {
      title: title,
      subject: subject,
      message: message,
      url: ''
    };

    Share.open(options)
    .then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
  }

  onSaveCollateral = async () => {
    const collateralData = this.state.selectedCollaterals;
    
    let collateral = { collateralCollection: collateralData, isModified: this.state.isModified, caseId: global.currentCaseIdentifiers.caseId}
   
    collateralServiceObj.updateCollateralsFromLegal(collateral).then(res => {

        if (global.isOnline) {

            // console.log('my current stage is:'+ global.currentCaseIdentifiers.stage)
            let collateralObj = {
                "sfdcId": global.currentCaseIdentifiers.sfdcId,
                "caseUniqueId": global.currentCaseIdentifiers.caseUniqueId,
                "stage": CASE_CONSTANTS_STATUS[global.currentCaseIdentifiers.stage],
                "collateral": this.getCollateralFinalList(collateralData)
            }
            console.log('hehe check me i am here'+ JSON.stringify(collateralObj) )

            ApiManager.submitCase(collateralObj).then(res => {
               
              let index = Object.keys(CASE_CONSTANTS_STATUS).find(key => CASE_CONSTANTS_STATUS[key] === res.stage)
                
              let caseObj = {
                    "id": global.currentCaseIdentifiers.caseId,
                    "sfdcId": res.sfdcId,
                    "token": res.syncToken,//update token with value from api,
                    "stage": index
                }
                console.log('data sent to server'+ JSON.stringify(res))

                caseSyncService.updateNewCaseToken(caseObj);
                this.setState({isModified: false})

            })
                .catch(err => console.log(err));
        }


    });
    
    // this.updateTemporaryCollection()
    // this.setState({ isEditable: false })
  }
  
  getCollateralFinalList(collateralData){
    let finalColData = [];
    // for(let i=0; i<collateralData.length; i++){
      if(collateralData.length >0){
        collateralData.forEach(element => {
          let colObj = {
            collateralSubTypeId:element.collateralTypeId+"~"+element.collateralSubTypeId,
            collateralValue:element.totalValues,
            propertyStatus:element.propertyStatus,
            collateralAddress: {
              houseNumber: element.address.houseNumber,
              houseDetails: element.address.houseDetails,
              streetName: element.address.streetName,
              city: element.address.cityName,
              state: element.address.stateName,
              latitude: element.address.latitude,
              longitude: element.address.longitude,
              pincode: element.address.pincode
            }
          }
          finalColData.push(colObj);
        });
      }
    // }
    return finalColData;
  }

  onCheckedLegalComplete(index) {

    let selectedCollaterals = this.state.selectedCollaterals;
    
    if(selectedCollaterals[index].isLegalCheckComplete)
      selectedCollaterals[index].isLegalCheckComplete = false
    else
      selectedCollaterals[index].isLegalCheckComplete = true

    // const collateralServiceObj = new CollateralService();
    
    collateralServiceObj.updateCollateralByCollateralId(selectedCollaterals[index]).then(()=>{
      console.log('updated data')
    })
    
    // console.log('my my collateral id'+ selectedCollaterals[index].id)

    this.setState({selectedCollaterals})
  }

  onCheckedValuationComplete(index) {

    let selectedCollaterals = this.state.selectedCollaterals;
    
    if(selectedCollaterals[index].isValuationCheckComplete)
      selectedCollaterals[index].isValuationCheckComplete = false
    else
      selectedCollaterals[index].isValuationCheckComplete = true

    // const collateralServiceObj = new CollateralService();
    
    collateralServiceObj.updateCollateralByCollateralId(selectedCollaterals[index]).then(()=>{
      console.log('updated data')
    })
    
    // console.log('my my collateral id'+ selectedCollaterals[index].id)

    this.setState({selectedCollaterals})
  }


  onChangeContactPerson1(index, data)
  {
    let selectedCollaterals = this.state.selectedCollaterals;
    selectedCollaterals[index].contactPerson = data;

    this.setState({selectedCollaterals})
    this.setState({isModified: true})

    // const collateralServiceObj = new CollateralService();
    
    // collateralServiceObj.updateCollateralByCollateralId(selectedCollaterals[index]).then(()=>{
    //   console.log('updated data')
    // })

  }
  onChangeContactNumber1(index, data)
  {
    let selectedCollaterals = this.state.selectedCollaterals;
    selectedCollaterals[index].contactNumber = data;

    this.setState({selectedCollaterals})
    this.setState({isModified: true})

    // const collateralServiceObj = new CollateralService();
    
    // collateralServiceObj.updateCollateralByCollateralId(selectedCollaterals[index]).then(()=>{
    //   console.log('updated data')
    // })
  }

  onChangePropertyStatus1(index, data) {
    let selectedCollaterals = this.state.selectedCollaterals;
    selectedCollaterals[index].propertyStatus = data;
    this.setState({selectedCollaterals})
    this.setState({isModified: true})
    // const collateralServiceObj = new CollateralService();
    // collateralServiceObj.updateCollateralByCollateralId(selectedCollaterals[index]).then(()=>{
    //   console.log('updated data')
    // })
  }


  onChangePropertyStatus(collateralIndex,index,data){
    // this.props.onUpdateCaseDetailsProgressValue()
    let {collateralCollection} = this.state
    let {collateralData} = this.props
    collateralCollection[collateralIndex].collateralValues[index].propertyStatus = data == "Property Type"?"":data
  //  collateralData = {...collateralData,collateralCollection:collateralCollection,isModified:true}
  //  console.log('fdd',collateralData)
    
     this.setState({ collateralCollection })
  }

  onClickSaveCollaterals = () => {

    // const collateralServiceObj = new CollateralService();
    let addressServiceObject = new AddressService();
    let {collateralCollection} = this.state
    if(collateralCollection.length > 0)
    {
      for(let collateral of collateralCollection)
      {
        if(collateral.collateralValues && collateral.collateralValues.length > 0)
        {
          for(let newCollateralField of collateral.collateralValues)
          {

            collateralServiceObj.addCollateral(newCollateralField).then((collateralId)=>{
              newCollateralField.address.collateralId = collateralId;
              // console.log('addres before saving:'+ newCollateralField.address.pinCode)
              addressServiceObject.addAddressByCollateral(newCollateralField.address).then((adderssId)=> {
                console.log('collateral and address added successfully')
              })
              newCollateralField.id = collateralId;
              let selectedCollaterals = this.state.selectedCollaterals;
              selectedCollaterals.push(newCollateralField)
              this.setState({selectedCollaterals})
      
            })
          }
          
        }
      }
    }
    this.setState({showAddColModel: false, isModified: true})

  }

  onIncrementProperty = (index) => {
    let {collateralCollection} = this.state
    let {collateralData} = this.props
    // let collateralServiceObj = new CollateralService()
    let addressServiceObject = new AddressService()
   // if(collateralCollection[index].collateralValues.length != 5){
    let newCollateralField = {
      id:0,
      caseId:global.currentCaseIdentifiers.caseId,
      collateralName:collateralCollection[index].description,
      collateralTypeId:collateralCollection[index].collateralTypeId,
      collateralSubTypeId:collateralCollection[index].collateralSubTypeId,
      totalValues:'',
      propertyStatus:''
    }

        collateralCollection[index].collateralValues.push(newCollateralField)
        collateralData ={...collateralData,collateralCollection:collateralCollection,isModified:true}
        this.setState({collateralCollection},()=>{

      });
  
 }

 onDecrementProperty = (index) => {
  // let collateralServiceObj = new CollateralService()
  let {collateralCollection} = this.state
  let {collateralData} = this.props
  if(collateralCollection[index].collateralValues.length>1){
    // collateralServiceObj.deleteCollateralById(collateralCollection[index].collateralValues[collateralCollection[index].collateralValues.length-1].id).then(()=>{

    // })
    collateralCollection[index].collateralValues.splice(collateralCollection[index].collateralValues.length-1,1);
    collateralData = {...collateralData,collateralCollection:collateralCollection,isModified:true}
    this.setState({ collateralCollection },()=>{
      // this.props.onCollateralDataUpdate(collateralData)
    })}
 }

  onToggleCollateral  = (index,name) =>{
    // let collateralServiceObj = new CollateralService()
    let addressServiceObject = new AddressService()
    let {collateralCollection} = this.state
    let {collateralData} = this.props
    if (collateralCollection[index].isChecked)
    {
      // collateralServiceObj.deleteCollateral(collateralCollection[index]).then(()=>{
        collateralCollection[index].isChecked = false
        collateralCollection[index].myId = 0
       collateralCollection[index].collateralValues = []
       collateralData ={...collateralData,collateralCollection:collateralCollection,isModified:true}
       this.setState({collateralCollection},()=>{
        //  this.props.onCollateralDataUpdate(collateralData)
        //  this.props.onUpdateCaseDetailsProgressValue()
       });
      // })
   
    }
    else
    {             
  
      var newCollateral = { collateralName: collateralCollection[index].description, totalValues:'',caseId:global.currentCaseIdentifiers.caseId,collateralTypeId:collateralCollection[index].collateralTypeId,collateralSubTypeId:collateralCollection[index].collateralSubTypeId,propertyStatus:collateralCollection[index].propertyStatus == undefined?"":collateralCollection[index].propertyStatus}
      if(collateralCollection[index].myId == 0){
     
          collateralCollection[index].isChecked = true
          collateralCollection[index].collateralValues.push({
            collateralName: collateralCollection[index].description, 
            totalValues:'',caseId:global.currentCaseIdentifiers.caseId,
            collateralTypeId:collateralCollection[index].collateralTypeId,
            collateralSubTypeId:collateralCollection[index].collateralSubTypeId,
            propertyStatus:collateralCollection[index].propertyStatus == undefined?"":collateralCollection[index].propertyStatus
          })
          collateralData ={...collateralData,collateralCollection:collateralCollection,isModified:true}
          this.setState({collateralCollection});
     
      }
      else{
        // Control would reach here when the data would be fetched from database
        collateralCollection[index].isChecked = true
        collateralCollection[index].collateralValues.push('')
        collateralData ={...collateralData,collateralCollection:collateralCollection,isModified:true}
        this.setState({collateralCollection});
      }

    }

  }

  async componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => this.handleSubscriptionChange(),
    );
    let collateralCollectionData =  await this.getCollateralData();

    // let collateralServiceObj = new CollateralService();

    this.setState({freshCollateralls: collateralCollectionData})
    this.setState({ collateralCollection: collateralCollectionData });

    collateralServiceObj.getCollateralByCaseId(global.currentCaseIdentifiers.caseId).then((collateralDataObj) => {
      console.log('collateralDataObj', collateralDataObj)
      this.setState({selectedCollaterals: collateralDataObj})
    })


  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

  }

  _keyboardDidShow = () => {
    this.setState({ collateralViewHeight: 300 })
  }

  _keyboardDidHide = () => {
    this.setState({ collateralViewHeight: height - 100 })
  }

  hasPropertyValue(index)
  {
      let {collateralCollection} = this.state
    console.log(collateralCollection[index].collateralValues)
    if(collateralCollection[index].collateralValues!=null&&collateralCollection[index].collateralValues!=[]){
      if(collateralCollection[index].collateralValues.length>0) {return true }
      else{ return false }
    }else{ return false }
  }

  async getCollateralData(){
    console.log('inside get function')
    let storedData = await AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG);
    // console.log('this is my config master data'+ JSON.stringify(storedData.configuration.legalAndTechnicalDocCheckList))
    this.setState({checkList: storedData.configuration.legalAndTechnicalDocCheckList});  
    let collateralCollectionDataNew = storedData.configuration.collateral.splice(0,6);
    let collateralCollectionData = [];
    for(let i = 0; i<collateralCollectionDataNew.length; i++){
      let obj = {
      "collateralTypeId": collateralCollectionDataNew[i].collateralTypeId,
      "collateralType": collateralCollectionDataNew[i].collateralType,
      "collateralSubTypeId": collateralCollectionDataNew[i].collateralSubTypeId,
      "collateralSubType": collateralCollectionDataNew[i].collateralSubType,
      "description": collateralCollectionDataNew[i].description,
      myId:0,
      isChecked:false,
      collateralValues:[]
      }
      collateralCollectionData.push(obj);
    }
    return collateralCollectionData;
  }

  onClickSaveAddressDetails = (address) => {
     
    // this.setState({ address });
    let selectedCollaterals = this.state.selectedCollaterals;
    console.log('my address collateral Id'+ selectedCollaterals[this.state.newIndex])
    selectedCollaterals[this.state.newIndex].address = address;
    this.setState({selectedCollaterals: selectedCollaterals, isModified: true})
    // let addressServiceObject = new AddressService();
    // addressServiceObject.updateAddressByCollateralId(address).then((adderssId)=> {
    //     console.log('collateral address updated successfully')
    // })  





  };

  onClickSaveAddressDetailsForNew = (address) => {
     
    // this.setState({ address });
    let {collateralCollection} = this.state
    collateralCollection[this.state.collateralIndex].collateralValues[this.state.index].address = address
    this.setState({ collateralCollection })

  };

  onChangePropertyValue(collateralIndex,index,data){
    // this.props.onUpdateCaseDetailsProgressValue()
    let {collateralCollection} = this.state
    // let {collateralData} = this.props
    collateralCollection[collateralIndex].collateralValues[index].totalValues = data
  //  collateralData = {...collateralData,collateralCollection:collateralCollection,isModified:true}
  //  console.log('fdd',collateralData)
     this.setState({ collateralCollection })
  }

  onChangeContactPerson(collateralIndex,index,data) 
  {
    let {collateralCollection} = this.state
    collateralCollection[collateralIndex].collateralValues[index].contactPerson = data
    this.setState({ collateralCollection })


  }

  onChangeContactNumber(collateralIndex,index,data) 
  {
    let {collateralCollection} = this.state
    collateralCollection[collateralIndex].collateralValues[index].contactNumber = data
    this.setState({ collateralCollection })
  }

  getCurrentLocation = (visible, index) => {

    let { selectedCollaterals } = this.state
    this.setState({newIndex: index})

    
    let address = selectedCollaterals[index].address
    address.collateralId = selectedCollaterals[index].id
    if(!address){
     
      console.log('no address')
      address = {
        latitude: 0,
        longitude: 0,
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        stateName: '',
        cityName: '',
        pinCode: '',
      }

      
    }
    this.setState({address},()=> {
      this.addressElement1.onUpdateAddressDetails(this.state.address)
    })

    // this.addressElement1.onUpdateAddressDetails(this.state.address)
    this.setState({
        showAddressPopup: visible,
    });
  };

  getCurrentLocationNew = (visible,collateralIndex, index) => {

    this.setState({collateralIndex, index});
    let {collateralCollection} = this.state
    let address = collateralCollection[collateralIndex].collateralValues[index].address
    if(!address){
     
      console.log('no address')
      address = {
        latitude: 0,
        longitude: 0,
        houseNumber: '',
        houseDetails: '',
        streetName: '',
        stateName: '',
        cityName: '',
        pinCode: '',
      }

      
    }
    this.setState({address},()=> {
      this.addressElement.onUpdateAddressDetails(this.state.address)
    })
    
    this.setState({
      showAddressPopupForNew: visible,
    });
  }
isAddressValid(address) {

    if (
        this.isValidString(address.houseNumber) ||
        this.isValidString(address.houseDetails) ||
        this.isValidString(address.streetName) ||
        this.isValidString(address.stateName) ||
        this.isValidString(address.cityName) ||
        this.isValidString(address.pinCode+"")
    ) {
        return true;
    } else {
        return false;
    }
}
isValidString(text) {
  if (text != null && text != '') {
      const isValid = text.length > 0 && text != 'null' ? true : false;
      return isValid;
  } else {
      return false;
  }
}

formattedAddressString(address) {

  let formatedAddress = '';

  if (this.isValidString(address.houseNumber)) {
      formatedAddress += address.houseNumber + ' ,';
  }
  if (this.isValidString(address.houseDetails)) {
      formatedAddress += address.houseDetails + ' ,';
  }
  if (this.isValidString(address.streetName)) {
      formatedAddress += address.streetName + ' ,';
  }
  if (this.isValidString(address.stateName)) {
      formatedAddress += address.stateName + ' ,';
  }
  if (this.isValidString(address.cityName)) {
      formatedAddress += address.cityName + ' ,';
  }
  if (this.isValidString(address.pinCode+"")) {
      formatedAddress += address.pinCode + ' ,';
  }
  if (this.isValidString(formatedAddress)) {
      if (formatedAddress.slice(-1) == ',') {
          formatedAddress = formatedAddress.substring(0, formatedAddress.length - 1);
      }
  }
  return formatedAddress;
}

  handleSubscriptionChange = () => {
    const entityServiceObj = new EntityService();
    entityServiceObj
      .getEntityByCaseId(global.currentCaseIdentifiers.caseId)
      .then(entityDetails => {
        console.log(
          'entityDataObj11',
          entityDetails,
          global.currentCaseIdentifiers.caseId,
        );
        this.setState({ entityName: entityDetails.entityName });
      });
  };
}

const mapStateToProps = (state) => {
  return{
    // collateralData: state.addCase.collateralData
  }

}

export default connect( mapStateToProps ) (LegalComponent);

const styles = StyleSheet.create({
  MainContainer: {
    // justifyContent: 'center',
    backgroundColor: '#ebedef',
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    width: '100%',
    // height: '100%',
    // backgroundColor:'red',
  },
  btnSubmitUI:{
    backgroundColor: '#9d1d28',
    width: 150,
    height: 40,
    paddingVertical: 10,
    borderRadius: 20,
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  listRow: {
    flex: 1,
    justifyContent: "space-around"
  },
  checkboxInputAddLater: {
    marginLeft: -10,
    marginRight: 20,
    borderColor: Colors.text,
    borderWidth: 0,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  Carditem: {
    flexDirection: 'column',
    // marginRight: 10,
    // marginBottom: 10,
    height: 110,
    // width: 275,
    flex: 1,
    // margin: 20,
    padding: 20,
    elevation:5,
    backgroundColor:'rgba(255,255,255,1)'
  },
  labelFocus:{
    color:Colors.darkenGray,
    fontSize:11,
    fontFamily: "Helvetica",
    marginLeft:0,
    marginBottom:5,
    marginTop:0,
  },
  CardItemName: {
    color: Colors.text,
    fontWeight: 'bold',
    ...Fonts.style.normal,
    fontFamily: 'Helvetica',
  },
  bottomView: {
    flex: 1,
    width: 260,
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  iconView: {
    height: 24,
    width: 24,
    alignSelf: 'center',
  },
  statusView: {
    width: 196,
  },
  statusText: {
    color: Colors.darkenGray,
    ...Fonts.style.small,
  },
  icStatus: {
    color: Colors.text,
    ...Fonts.style.normal,
  },
  nextReleaseView: {
    position: 'absolute',
    bottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  Cardtop: {
    height: 80,
    // width: '90%',
    
    // alignSelf:'center'
    justifyContent: 'center'
    // marginLeft: -9,
  },
  CardMain: {
    // height: 80,
    marginTop: 10,
    // width: '90%',
    backgroundColor: 'white',
    // minHeight: '20%',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 10,
    paddingBottom: 20
    // justifyContent: 'center',
    // alignSelf:'center'
    // marginLeft: -9,
  },
  Viewtop: {
    height: 60,
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: -9,
  },
  userImageWidget: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userImage: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    backgroundColor: Colors.text,
    marginRight: 10,
  },
  icName: {
    color: Colors.text,
    fontWeight: 'bold',
    ...Fonts.style.h1,
    fontFamily: 'Helvetica',
    textTransform:'capitalize'
  },
  icProgram: {
    color: Colors.text,
    fontWeight: 'normal',
    ...Fonts.style.h1,
    fontFamily: 'Helvetica',
  },
  progressBarWidget: {
    width: width / 1.5,
    // marginTop: 10,
    marginHorizontal: 10,
    // backgroundColor:'red'
  },
  progressBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    // backgroundColor: 'red'
  },
  progressBarTitle: {
    flex: 8,
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.normal,
  },
  progressBarCount: {
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.normal,
  },
  checkBoxStyle: {
    flex: 1,
    flexDirection: 'row',
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.normal,
  },
  progressBarCountValue: {
    color: Colors.darken,
    fontFamily: 'Helvetica',
    ...Fonts.style.h1,
    fontWeight: 'bold',
  },
  progress: {
    margin: 10,
    height: 8,
    width: '99%',
  },
  btnSaveDetails: {
    width: 215,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    // marginRight:20
  },
  btnSaveDetailsDisable: {
    width: 215,
    height: 40,
    backgroundColor: '#d8ada1',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },
  addressWidget: {
    flexDirection: 'row',
    marginVertical: 40,
    justifyContent: 'space-between',
    // paddingBottom: 10,
    marginLeft: 15,
    padding: 10
},
addressField: {
    // alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%'
},
icAddressWidget: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c8ca',
    // width: '100%'

},
addressLabel: {
    fontFamily: "Helvetica",
    color: Colors.text,
    ...Fonts.style.normal,
},
icAddress: {
//     width: 22,
//     height: 22,
//     position: 'absolute',
//     right: 15,
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
},
addressText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
},
bottomLine: {
  borderBottomColor: Colors.darkGray,
  borderBottomWidth: 1
},
pickerStatementTypeItem:{
  //  position: 'relative',
  //  top: 10,
  //  left:0,
    color:'#58595b',
    fontSize:14,
    fontWeight:'bold',
    fontFamily: "Helvetica",
 },
 modal:{
  height:height-100,
   width:width,
   backgroundColor:'#fff',
   position:'absolute',
   bottom:0,
   borderTopLeftRadius:32,
   borderTopRightRadius:32,
   overflow:'scroll',
  //  height:300
 },
 modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 50,
  marginVertical: 30,
  alignItems: 'center',
},

checklistHeader: {
  // flexDirection: 'row',
  // justifyContent: 'space-between',
  // marginHorizontal: 50,
  // marginVertical: 50,
  // alignItems: 'center',
},
collateralContainer:{
  // backgroundColor:'red',
  flexDirection:'column',
  // justifyContent:'center',
  flex:1,
  width:width/2,
  marginHorizontal:25,
  marginTop:10,
  // paddingTop: 20,
  // height:height-280,
  minHeight:height-280,
  paddingRight:15,
  paddingLeft: 15,
  // overflow:'scroll'
},
checkboxWidget:{
  flexDirection:'row',
  marginBottom:15,
  // width:'100%'
},

checkboxInput:{
  marginLeft:-10,
  borderColor:Colors.text,
  width:20,
  height:20,
  borderRadius:2,
},
checkboxLabel:{
  ...Fonts.style.normal,
  fontFamily: "Helvetica",
  marginLeft:25,
  width: '80%'
},
incrementWidget:{
  flexDirection:'row',
  alignSelf:'flex-end',
  justifyContent:'flex-end',
  alignItems: 'flex-end',
  position:'absolute',
  right:0,
  marginRight: -32
},
counterText:{
  ...Fonts.style.normal,
  color:Colors.text,
  fontWeight:'700',
  marginHorizontal:12
},
addPropertyWidget:{
  width:width/2
},
modalTitle: {
  color: Colors.text,
  fontFamily: "Helvetica",
  fontSize: 18,
  fontWeight: 'bold'
},
sectionTitle: {
  color: Colors.text,
  fontFamily: "Helvetica",
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 15
},
sectionItemText:
{
  fontFamily: "Helvetica",
  fontSize: 14, 
  color: Colors.text,
},
sectionItem:
{
  flexDirection: 'row',
  marginBottom: 10,
  padding: 5
},


addressWidget2: {
  flexDirection: 'row',
  // marginVertical: 40,
  // justifyContent: 'space-between',
  marginLeft:25,
  marginBottom: 20,
  marginTop: 20,
  // marginTop:-10,
  // backgroundColor: 'red',
  paddingLeft: 15
  // paddingBottom: 10,
  // marginLeft: 15,
  // padding: 10
},
addressField2: {
    // alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%'
},
icAddressWidget2: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c7c8ca',
    // width: '100%'

},
addressLabel2: {
    fontFamily: "Helvetica",
    color: Colors.text,
    ...Fonts.style.normal,
},
icAddress2: {
//     width: 22,
//     height: 22,
//     position: 'absolute',
//     right: 15,
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
},
addressText2: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
},
btnResetDetails: {
  width: 150,
  height: 40,
  backgroundColor: '#fff',
  color: '#9d1d28',
  fontFamily: "Helvetica",
  fontSize: 14,
  fontWeight: 'bold',
  padding: 10,
  textAlign: 'center',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#9d1d28',
  marginLeft: 30
},
modalOverlayBtn: {
  height: '100%',
  width: '100%',
},
modalOverlay: {
  backgroundColor: 'rgba(0,0,0,0.5)',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0
},

});
