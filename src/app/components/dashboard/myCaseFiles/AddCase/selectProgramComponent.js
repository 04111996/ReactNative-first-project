import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  ScrollView,
  AppState,
  Modal,
  TextInput,
  ImageBackground
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Colors from '../../../../styles/Colors';
import Fonts from '../../../../styles/Fonts';
import AsyncStorageFunc from '../../../../utilities/asyncStorage';
import { ASYNCSTORAGE } from "../../../../constants/AsyncStorage/asyncStorageConstants";
import IconTime from '../../../../assets/images/icon_time.svg';
import IconDoc from '../../../../assets/images/icon_doc.svg';
import IconClose from '../../../../assets/images/icon_close_big.svg';
import IconTick from '../../../../assets/images/icon_check.svg';
import ProgramService from '../../../../Database/Services/Programs/ProgramService';
import ApiManager from "../../../../api/apiManager";
import IconArrowDown from '../../../../assets/images/icon_arrow_down.svg';
import IconArrowUp from '../../../../assets/images/icon_arrow_up.svg'
import { TextField } from 'react-native-material-textfield';
import DeclineCaseService from '../../../../Database/Services/CaseDetails/DeclineService';
import stylesModal from '../../../../components/bankstatements/bankStatementsComponentStyle';

import DeclineCaseModal from './DeclineCaseModal';
const declineCaseService = new DeclineCaseService();


const width = Dimensions.get('window').width;
let screenHeight = Dimensions.get('screen').height;
let height = Dimensions.get('window').height;
let bottomNavBarHeight = screenHeight - height;
var heightAdjustment = 0;
var topAdjustment = -15;
if (bottomNavBarHeight > 0) {
  heightAdjustment = 50
  topAdjustment = 10
}
height = height + heightAdjustment;
const programWidth = 307;
const programHeight = 323;

var screenData = "";
const programService = new ProgramService();
export default class SelectProgramComponent extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      loanProgramList: [],
      selectedProgramObject: {},
      selectedProgramId: undefined,
      showDeclineModal: false,
      declineReason: {},
      closeModal:false,
      // selectedReasonIDs :[],
      reasonsModalVisible:false
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    let selectedProgramId = this.props.navigation.getParam('selectedProgramId') || undefined;
   
  //  alert(JSON.stringify(dataFromDocumentComponent));
    screenData =this.props.navigation.state.params.comingFrom;
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
      this.setState({
        loanProgramList: res.configuration.loanPrograms,
        documentCheckList:res.configuration.docChecklist,
        declineReason: res.configuration.declineReason.find((obj) => {
          return obj.destination == "decline_program"
        }),
        selectedProgramId: selectedProgramId,
        selectedProgramObject: res.configuration.loanPrograms.find((obj) => {
          return obj.programId == selectedProgramId
        })
      },()=>{
        setTimeout(()=>{
          this.programList.scrollToIndex({index: this.selectedIndex || 0});
        },100)
      })
      if(screenData == 'DocumentComponent'){
        let dataFromDocumentComponent = this.props.navigation.getParam('selectedProgram');
        this.setState({
          selectedProgramId: dataFromDocumentComponent.programId,
          selectedProgramObject:dataFromDocumentComponent
        })
       }
    }).catch(err => {
      console.log(err);
    })
    
    //alert(selectedProgramId)
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  toggleModal(visible) {
    this.setState({reasonsModalVisible: visible});
  }
  _handleAppStateChange = appState => {
    const programService = new ProgramService();
    var program = {
      selectedProgramId: this.state.selectedProgramId,
      isDataSubmittedToServer: false,
      isModified: true,
      caseId: global.currentCaseIdentifiers.caseId
    }
    programService.autoSaveMyProgramByCaseId(program).then(() => {
      console.log("Program selection Auto Saved")
    })
  }
  handleProgramSelection = (programId, programObject) => {
    if (this.state.selectedProgramId != programId) {
      this.setState({
        selectedProgramId: programId,
        selectedProgramObject: programObject
      })
    }
    else {
      this.setState({
        selectedProgramId: undefined,
        selectedProgramObject: {}
      })
    }

  }
  getProgramSelectionCSS = (programId,index) => {
  //  alert(index)
    if (this.state.selectedProgramId) {
      if (this.isProgramSelected(programId))
      {
        this.selectedIndex =index;
        return styles.selectedProgram;
      }
      else
        return styles.nonSelectedProgram;
    }
    else {
      return {}
    }
  }
  isProgramSelected = (programId) => {
    if (this.state.selectedProgramId == programId) {
      return true;
    }
    else
      return false;
  }
  onPressSaveChanges = ()=>{
    this.setState({
      closeModal:true
    })
  }
  proceedProgramSelection = () => {

    let seletedProgram = {
      selectedProgramId: this.state.selectedProgramId,
      // isDeclined: false,
      isModified: true,
      isUpdateRequired: false,
      isDataSubmittedToServer: true,
      isServerResponseReceivedSuccessfully: false,
      caseId: global.currentCaseIdentifiers.caseId
    }
    programService.updateMyProgramByCaseId(seletedProgram).then((a) => {
      console.log("Program updated" + a)
      console.log("SFDC ID" + global.sfdcId);
      if (global.isOnline && global.sfdcId != "") {
        let payload = {
          empId: global.employeeId,
          sfdcId: global.sfdcId,
          selectedProgramId: this.state.selectedProgramId
        }
        console.log("Payload :" + JSON.stringify(payload))
        ApiManager.submitProgramSelection(payload).then(res => {
          const updateToken = {
            token: res.syncToken,
            id: global.currentCaseIdentifiers.myProgramId
          }
          programService.updateAcceptProgramToken(updateToken);
          if (res.statusCode == 204) {
            global.currentCaseIdentifiers.selectedProgramId = this.state.selectedProgramId;
            this.props.navigation.replace('DocumentationStack')
          }
          else{
            alert("")
          }
        })
      }
      else {
        global.currentCaseIdentifiers.selectedProgramId = this.state.selectedProgramId;
        this.props.navigation.replace('DocumentationStack')
      }
    });
  
    }

    proceedProgramSelectionFromModal = () => {
     
      let seletedProgram = {
        selectedProgramId: this.state.selectedProgramId,
        // isDeclined: false,
        isModified: false,
        isUpdateRequired: false,
        isDataSubmittedToServer: true,
        isServerResponseReceivedSuccessfully: false,
        caseId: global.currentCaseIdentifiers.caseId
      }
      programService.updateMyProgramByCaseId(seletedProgram).then((a) => {
        console.log("Program updated" + a)
        console.log("SFDC ID" + global.sfdcId);
        if (global.isOnline && global.sfdcId != "") {
          let payload = {
            empId: global.employeeId,
            sfdcId: global.sfdcId,
            selectedProgramId: this.state.selectedProgramId
          }
          console.log("Payload :" + JSON.stringify(payload))
          ApiManager.submitProgramSelection(payload).then(res => {
            const updateToken = {
              token: res.syncToken,
              id: global.currentCaseIdentifiers.myProgramId
            }
            programService.updateAcceptProgramToken(updateToken);
            if (res.statusCode == 204) {
              global.currentCaseIdentifiers.selectedProgramId = this.state.selectedProgramId;
              this.props.navigation.replace('DocumentationStack')
            }
            else{
              alert("")
            }
          })
        }
        else {
          global.currentCaseIdentifiers.selectedProgramId = this.state.selectedProgramId;
          this.props.navigation.replace('DocumentationStack')
        }
      });
      this.setState({
        closeModal:false
      })
      }
    handleScroll =()=>{
     // alert('ad')
    }
    manageModalVisibility =()=>{
      this.setState({
        showDeclineModal : !this.state.showDeclineModal
      })
    }
    onCloseChangeProgramConfirmModal(){
      this.setState({
        closeModal :!this.state.closeModal
      })
    }

    getDocumentCount=(item)=>{
        var docObj=this.state.documentCheckList.filter(doc=>{
          return doc.programId==item.programId;
        })
           return docObj.length;   
    }
  
    render(){
      console.log("declineReason"+JSON.stringify(this.state.declineReason));
     
      return (
        <ImageBackground 
        source={require('../../../../assets/images/background_program.png')} 
        style={{resizeMode:'cover',width: '100%', height: '100%'}}
        // style={{width: '100%', height: '100%'}}
        >
        <View style={styles.container}>
          <View style={styles.programHeader}>
            <TouchableOpacity
              onPress={()=>{
                screenData == 'DocumentComponent' ? this.props.navigation.replace('DocumentationStack'):this.props.navigation.replace('HomeScreen')
               // this.props.navigation.navigate('HomeScreen');
              }}
            >
              <IconClose style={{width: 40,height: 40,}}/>
            </TouchableOpacity>
            <Text style={[styles.headerText,{fontWeight:'bold',paddingTop:30}]}>Choose a program under which you would like to on-board your customer.</Text>
            <Text style={[styles.headerText,{fontStyle: 'italic'}]}>You can change it later as you go ahead with the case file</Text>
          </View>
          <View style={[styles.programContainer,this.state.selectedProgramId ? {height:450,top:140} :{}]}>
              <FlatList
              horizontal
              data = {this.state.loanProgramList}
              ref={(ref) => { this.programList = ref; }}
              keyExtractor={item => item.id}
              onScroll={this.handleScroll} 
              showsHorizontalScrollIndicator={false}
              onScrollToIndexFailed={()=>{}}
              renderItem ={({item,index})=>(
                <TouchableOpacity
                  onPress={()=>{
                      this.handleProgramSelection(item.programId,item);
                  }}
                >
                <View style={[styles.program,this.getProgramSelectionCSS(item.programId,index)]} onLayout = {(event)=>{
                  //this.find_dimesions(event.nativeEvent.layout)
                }}>
                  <View style={{position:'absolute',top:-10,left:-5,backgroundColor:'#ffcb05',width:141,height:30,borderRadius:6,alignItems:'center',justifyContent:'center',zIndex:9}}>
                    <View style={{width:5,backgroundColor:'#e6b600',height:7,position:'absolute',left:0,bottom:-4,zIndex:-1}}></View>
                    <View style={{}}>
                      <Text style={{color:'#744900',fontWeight:'bold'}}> Recommended</Text>
                    </View>
                  </View>
                  <View style={{position:'absolute',top:-10,left:-5,backgroundColor:'#d0021b',width:141,height:30,borderRadius:6,alignItems:'center',justifyContent:'center',zIndex:9}}>
                    <View style={{width:5,backgroundColor:'#9d0013',height:7,position:'absolute',left:0,bottom:-4,zIndex:-1,}}></View>
                    <View style={{}}>
                      <Text style={{color:'#ffffff',fontWeight:'bold'}}> Not Recommended</Text>
                    </View>
                  </View>
                  <View style={styles.programTitle}>
                    <View>
                      <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18, color: "#58595b" }}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={[styles.outterCircle, this.isProgramSelected(item.programId) ? styles.selectedProgramColor : {}]}>
                      {this.isProgramSelected(item.programId) ?
                        <View style={styles.innerCircle}></View>
                        : null}
                    </View>
                  </View>

                  <Text style={{ fontFamily: 'Helvetica', fontSize: 14, paddingTop: 30, color: "#58595b" }}>
                    {`For sanction amount upto`}
                  </Text>
                  <Text style={{ fontFamily: 'Helvetica', fontSize: 36, color: "#58595b", fontWeight: 'bold' }}>
                    {`₹ ${(Number(item.loanUpperLimit) / 10000000).toFixed(2)} L`}
                  </Text>
                  <View>
                    <TouchableOpacity onPress={() => {this.toggleModal(true); }}>
                      <Text style={styles.reasonText}> Reasons</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', paddingTop: 42 }}>
                    <IconTime style={styles.svgImage} />
                    <Text style={styles.highlightProgramValue}>
                      {`${item.sanctionTime} `}
                    </Text>
                    <Text style={styles.highlightProgramText}>
                      {`Sanction Time`}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>
                    <IconDoc style={styles.svgImage} />
                    <Text style={styles.highlightProgramValue}>
                      {`${this.getDocumentCount(item)} `}
                    </Text>
                    <Text style={styles.highlightProgramText}>
                      {`Documents Required`}
                    </Text>
                  </View>

                </View>
              </TouchableOpacity>
            )}
          >
          </FlatList>
            <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.reasonsModalVisible}
            transparent={true}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}>
            <TouchableOpacity
              style={styles.modalOverlayBtn}
              onPress={() => {
                this.toggleModal(!this.state.reasonsModalVisible);
              }}>
              <View style={styles.modalOverlay}></View>
            </TouchableOpacity>

            <View style={styles.modal}>
              <View style={[styles.modalHeader,{marginBottom:10}]}>
                <Text style={styles.modalTitle}>
                  {' '}
                  Reasons
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleModal(!this.state.reasonsModalVisible);
                  }}>
                  <Text style={styles.text}>
                    <IconArrowDown />
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'column',marginHorizontal: 50,}}>
                <View style={styles.reasonsList}>
                  <Text style={styles.reasonsListText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                  <Text style={styles.reasonsListText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                  <Text style={styles.reasonsListText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                  <Text style={styles.reasonsListText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                </View>
                
                <View style={{justifyContent:'flex-start',marginLeft:10}}>
                  <TouchableOpacity onPress={() => {
                    this.toggleModal(!this.state.reasonsModalVisible);
                  }}>
                    <Text
                      style={[styles.btnWithBorder]}>
                      {' '}
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {
          this.state.selectedProgramId ?
            <ScrollView style={styles.documentContainer} >
              <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>{this.state.selectedProgramObject.requirementHeader}</Text>
              </View>
              {
                this.state.documentCheckList && this.state.documentCheckList.map((doc) => {
                  if(doc.programId==this.state.selectedProgramId){
                    return (
                      <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 20 }}>
                        <IconTick style={{ height: 11, width: 13, paddingTop: 20 }} />
                        <Text style={{ paddingLeft: 10, }}>{doc.docName}</Text>
                      </View>
                    )
                  }
                })
              }
            </ScrollView>
            : null
        }
        {screenData != 'DocumentComponent'?<View style={styles.footer}>
          <View style={{ paddingRight: 30 }}>
            <TouchableOpacity
              style={[styles.button, this.state.selectedProgramId ? { backgroundColor: '#9d1d28' } : { backgroundColor: '#d8ada1' }]}
              onPress={() => {
                if (this.state.selectedProgramId)
                  this.proceedProgramSelection();
              }}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={[styles.button, { borderColor: '#9d1d28' }]}
              onPress={() => {
                // declineCase.addDefaultDeclineCase(global.currentCaseIdentifiers.caseId).then(()=>{
                this.manageModalVisibility()
                // })
              }
              }
            >
              <Text style={[styles.buttonText, { color: "#9d1d28" }]}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>:<View style={styles.footer}>
          <View style={{ paddingRight: 30 }}>
            <TouchableOpacity
              style={[styles.button, this.state.selectedProgramId ? { backgroundColor: '#9d1d28' } : { backgroundColor: '#d8ada1' }]}
              onPress={() => {
                if (this.state.selectedProgramId)
                  this.onPressSaveChanges();
              }}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
          </View>}
        <View style={{ backgroundColor: '#000' }} onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
        }}>
          <DeclineCaseModal visible={this.state.showDeclineModal} declineReason={this.state.declineReason} manageModal={this.manageModalVisibility} navigation={this.props.navigation} />
        </View>
        <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.closeModal}
                        transparent={true}
                        onRequestClose={() => {
                          console.log("Modal has been closed.");
                        }}
                      >
                        <TouchableOpacity
                          style={stylesModal.modalOverlayBtn}
                          onPress={() => {
                            let dataFromDocumentComponent = this.props.navigation.getParam('selectedProgram');
                            this.setState({
                              selectedProgramId: dataFromDocumentComponent.programId,
                              selectedProgramObject:dataFromDocumentComponent,
                              closeModal:false
                            })
                            this.onCloseChangeProgramConfirmModal(
                              !this.state.closeModal
                            );
                            console.log("cool")
                          }}
                        >
                          <View style={stylesModal.modalOverlay}></View>
                        </TouchableOpacity>
                        <View style={stylesModal.modalUploadBankStatement}>
                          <View style={[stylesModal.modalHeader]}>
                            <Text style={stylesModal.modalTitle}>
                              {" "}
                              Changing program will re-trigger score cards and document requirements. Are you sure you want to change ?{" "}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                let dataFromDocumentComponent = this.props.navigation.getParam('selectedProgram');
                                this.setState({
                                  selectedProgramId: dataFromDocumentComponent.programId,
                                  selectedProgramObject:dataFromDocumentComponent,
                                  closeModal:false
                                })
                              }}
                            >
                              <Text style={stylesModal.text}>
                                <IconArrowUp />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 40,
                              justifyContent: "flex-start"
                            }}
                          >
                            <View style={stylesModal.uploadWidget}>
                              {/* <IconPdf style={styles.iconSpace} /> */}
                              <TouchableOpacity
                                onPress={() => this.proceedProgramSelectionFromModal()}
                              >
                                <Text style={stylesModal.btnSaveDetails}>
                                  {" "}
                                  Yes, Change
                                </Text>
                              </TouchableOpacity>
                              {/* <View style={styles.uploadWidgetSeparator}></View> */}
                            </View>
                            <View style={[stylesModal.uploadWidget,{marginLeft:30}]}>
                              {/* <IconCamera style={styles.iconSpace} /> */}
                              <TouchableOpacity
                                onPress={() => {
                                  let dataFromDocumentComponent = this.props.navigation.getParam('selectedProgram');
                                  this.setState({
                                    selectedProgramId: dataFromDocumentComponent.programId,
                                    selectedProgramObject:dataFromDocumentComponent,
                                    closeModal:false
                                  })
                                  this.props.navigation.replace('DocumentationStack')
                                }
                              }
                              >
                                <Text style={{ width:150,
                                              height:40,
    //marginTop:20,
                                              backgroundColor:'#fff',
                                              color:'#9d1d28',
                                              fontFamily: "Helvetica",
                                              fontSize:14,
                                              fontWeight:'700',
                                              padding:10,
                                              textAlign:'center',
                                              borderColor:'#9d1d28',
                                              borderWidth:1,
                                              borderRadius:20}}>
                                  {" "}
                                  No, Don't Change
                                </Text>
                              </TouchableOpacity>
                            </View>
                            
                          </View>
                        </View>
                      </Modal>
                    
      </View>
      </ImageBackground>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
   // backgroundColor: '#ebedef',
  },
  programHeader:
  {
    position: 'absolute',
    marginLeft: 50,
    paddingTop: 30,
    paddingBottom:10
  },
  headerText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
  },
  programContainer: {
    position: 'absolute',
    top: (height / 2 - programHeight / 2),
    paddingLeft: 40,
  },
  program: {
    width: width/3.45,
    height: programHeight,
    backgroundColor: 'white',
    margin: 10,
    padding: 20
  },
  programTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15
  },
  outterCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderColor: 'black',
    borderRadius: 15,
    borderWidth: 1
  },
  innerCircle: {
    height: 20,
    width: 20,
    backgroundColor: '#9d1d28',
    borderRadius: 10
  },
  selectedProgram: {
    // position:'absolute',
    //  top:-50,
    //  overflow:'visible'
  },
  nonSelectedProgram: {
    marginTop: 50
  },
  selectedProgramColor: {
    borderColor: '#9d1d28'
  },
  highlightProgramValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    color: "#58595b",
    paddingLeft: 10,
    fontWeight: 'bold'
  },
  highlightProgramText: {
    fontFamily: 'Helvetica',
    fontSize: 18,
    color: "#58595b"
  },
  svgImage: {
    width: 22,
    height: 22,
    paddingTop: 28
  },
  documentContainer: {
    position: 'absolute',
    marginLeft: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    top: height / 2 + topAdjustment,
    height: height / 2 - 100 - heightAdjustment,
    width: "100%",
    backgroundColor: "white"
  },
  footer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    marginLeft: 50,
    height: 45,
    // backgroundColor:'red'
  },
  button: {
    height: 40,
    width: 150,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent'
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modal: {
    height: height - 100,
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    height: height/2.3
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
    alignItems: undefined,
    justifyContent: undefined,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: "Helvetica",
    ...Fonts.style.h1,
    fontWeight: 'bold'
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
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
  icModalClose: {
    width: 18,
    height: 11,
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
  btnWithBorder:{
    width:150,
    height:40,
    backgroundColor:Colors.white,
    color:Colors.primary,
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    padding:10,
    textAlign:'center',
    borderRadius:20,
    borderColor:Colors.primary,
    borderWidth:1
  },
  reasonText:{
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    color:Colors.primary,
    textDecorationLine:'underline',
    paddingTop:20
  },
  reasonsList:{
    marginLeft:10,
    marginBottom:20
  },
  reasonsListText:{
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    color:Colors.text,
    paddingVertical:10
  }
});