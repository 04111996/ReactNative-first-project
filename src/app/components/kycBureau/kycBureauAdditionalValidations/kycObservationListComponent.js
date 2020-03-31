import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Form,Item, Accordion,Card, Input, Label, Radio, DatePicker} from 'native-base';
import Colors from '../../../styles/Colors';
import IconUpload from '../../../assets/images/icon_upload.svg';
import IconProcessComplete from '../../../assets/images/icon_process_complete.svg';
import styles from './kycBureauAdditionalValidateStyles';
import NameInput from '../../customcomponents/NameInput';
import FloatingLabelNameInput from '../../customcomponents/FloatingLabelNameInput';
import EditApplicantDetails from './editApplicantDetailsComponent';
import FileViewer from 'react-native-file-viewer';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {connect} from 'react-redux';
import IconPdf from '../../../assets/images/icon_pdf.svg';
import IconCamera from '../../../assets/images/icon_camera.svg';
import IconGallery from '../../../assets/images/icon_gallery.svg';
import IconMail from '../../../assets/images/icon_mail.svg';
import IconClose from '../../../assets/images/icon_close.svg';
import IconArrowDown from '../../../assets/images/icon_arrow_down.svg';
import IconArrowUp from '../../../assets/images/icon_arrow_up.svg';
import IconPdfThumbnail from '../../../assets/images/icon_legal.svg';
import KycAndBureauObservationsService from '../../../Database/Services/KycAndBureauCheck/KycAndBureauObservationsService';
import asyncStorageFunc from '../../../utilities/asyncStorage';
import {ASYNCSTORAGE} from '../../../constants/AsyncStorage/asyncStorageConstants';
import API_MANAGER from '../../../api/apiManager';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const KycAndBureauObservationsServiceObj = new KycAndBureauObservationsService();

class KycObservationListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLayout: 'applicant',
      explanation: [],
      applicantTab: true,
      modalVisible: false,
      redoUploadModalVisible:false,
      documentsFilePath: [],
      fileSizeError: [],
      isUploadedDocs: [],
      data: [],
      loading:false,
    };
  }
  componentDidMount() {
    console.log(this.state.explanation[this.props.index], 'explanation 11');
    var additionalBankStatementData = this.props.additionalBankStatementData;
    console.log('Testing componentDidmount', additionalBankStatementData);
    this.setState(
      {
        // explanation: additionalBankStatementData.explanation,
       //  documentsFilePath: JSON.parse(this.props.data.documentsFilePath),
      },
      () => {
        this.state.documentsFilePath.forEach(() => {
          this.state.fileSizeError.push('');
          //this.state.explanation.push('')
        });
        this.props.onAdditionalBankStatementDataUpdate(
          additionalBankStatementData,
        );
      },
    );
  }
  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      return {
        data: props.data,
        index:props.index,
        documentsFilePath: JSON.parse(props.data.documentsFilePath || '[]'),
        explanation :props.data.explanation
      };
    }
    return null;
  }

  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  toggleRedoUploadModal(visible) {
    this.setState({redoUploadModalVisible: visible});
  }

  onChangeAddExplanation = (text, index) => {
    // alert(index)
   // let indexno = parseInt(index);
    var additionalBankStatementData = this.props.additionalBankStatementData;
    let {explanation} = this.state;
    explanation= text;
    //additionalBankStatementData[indexno] = {...additionalBankStatementData[indexno], explanation:explanation};
    console.log('additionalBankStatementData', additionalBankStatementData);
    this.setState({explanation}, () => {
      this.props.onAdditionalBankStatementDataUpdate(
        additionalBankStatementData,
      );
    });
    console.log('additionalBankStatementData', additionalBankStatementData);
  };
  hasValidFileSize = (results) => {
    const max_file_size = 4718592;
    let fileSize = 0;
    let {documentsFilePath} = this.state;
    let allFiles;
    if (documentsFilePath) {
      allFiles = [...results, ...documentsFilePath];
    } else {
      allFiles = results;
    }
    console.log('allFiles', allFiles);
    return new Promise((resolve, reject) => {
      for (let res of allFiles) {
        fileSize = fileSize + res.size;
      }
      if (fileSize > max_file_size) {
        resolve(false);
      } else {
        resolve(true);
      }
      
    });
  };
  async handleChoosePdf(index) {
    // alert(index)
    this.state.modalVisible = false;
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });
      let {documentsFilePath} = this.state;
      console.log('documentsFilePath', documentsFilePath);
      this.hasValidFileSize(results).then(result => {
        // alert(result)
        if (result) {
          for (const res of results) {
            //Printing the log realted to the file
            console.log('res11 : ' + JSON.stringify(res));
            console.log('URI11 : ' + res.uri);
            try {
              var despath =
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/pdf/' +
                res.name;
              console.log('Dest Path', despath);
              RNFS.mkdir(
                RNFS.ExternalStorageDirectoryPath +
                  '/Android/com.victorbank.rmapp/pdf',
              )
                .then(result => {
                  console.log('result', res);
                })
                .catch(err => {
                  console.warn('err', err);
                });
              RNFS.copyFile(decodeURIComponent(res.uri), despath)
                .then(result => {
                  console.log('Result', res);
                })
                .then(result => {
                  console.log('Result', res);
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } catch (error) {}

            // if (documentsFilePath[index]) {
              documentsFilePath.push({
                uri: res.uri,
                name: res.name,
                size: res.size,
              });
            let {fileSizeError} = this.state;
            fileSizeError = '';
            this.setState({documentsFilePath, fileSizeError});
          }
        } 
        else {
          // alert('fileSizeError')
          let {fileSizeError} = this.state;
          fileSizeError = 'File size not supported. Please retry';
          this.setState({fileSizeError});
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //  alert('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }
  async handleChoosePhoto(index) {
    // alert(index)
    this.state.modalVisible = false;
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      let {documentsFilePath} = this.state;
      console.log('documentsFilePath', documentsFilePath);
      this.hasValidFileSize(results).then(result => {
        // alert(result)
        if (result) {
          for (const res of results) {
            //Printing the log realted to the file
            console.log('res11 : ' + JSON.stringify(res));
            console.log('URI11 : ' + res.uri);
            try {
              var despath =
                RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/images/' +
                res.name;
              console.log('Dest Path', despath);
              RNFS.mkdir(
                RNFS.ExternalStorageDirectoryPath +
                  '/Android/com.victorbank.rmapp/images',
              )
                .then(result => {
                  console.log('result', res);
                })
                .catch(err => {
                  console.warn('err', err);
                });
              RNFS.copyFile(decodeURIComponent(res.uri), despath)
                .then(result => {
                  console.log('Result', res);
                })
                .then(result => {
                  console.log('Result', res);
                })
                .catch(err => {
                  console.log('Error', err);
                });
            } catch (error) {}

            // if (documentsFilePath) {
              documentsFilePath.push({
                uri: res.uri,
                name: res.name,
                size: res.size,
              });
            // } 
            let {fileSizeError} = this.state;
            fileSizeError = '';
            this.setState({documentsFilePath, fileSizeError});
          }
        } else {
          // alert('fileSizeError')
          let {fileSizeError} = this.state;
          fileSizeError = 'File size not supported. Please retry';
          this.setState({fileSizeError});
        }
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //  alert('Canceled from single doc picker');
      } else {
        throw err;
      }
    }
  }
  handleChooseCamera = index => {
    const options = {
      noData: true,
    };
    // alert('1234')
    let {documentsFilePath} = this.state;
    this.state.modalVisible = false;
    ImagePicker.launchCamera(options, response => {
      let {documentsFilePath} = this.state;
      console.log('documentsFilePath', documentsFilePath);
      this.hasValidFileSize([{size: response.fileSize}]).then(result => {
        // alert(result)
        if (result) {
          try {
            var despath =
              RNFS.ExternalStorageDirectoryPath +
              '/Android/com.victorbank.rmapp/image/' +
              response.fileName;
            console.log('Dest Path', despath);
            RNFS.mkdir(
              RNFS.ExternalStorageDirectoryPath +
                '/Android/com.victorbank.rmapp/image',
            )
              .then(result => {
                console.log('result', response);
              })
              .catch(err => {
                console.warn('err', err);
              });
            RNFS.copyFile(decodeURIComponent(response.uri), despath)
              .then(result => {
                console.log('Result', response);
              })
              .then(result => {
                console.log('Result', response);
              })
              .catch(err => {
                console.log('Error', err);
              });
          } catch (error) {}

          // if (documentsFilePath[index]) {
            documentsFilePath.push({
              uri: response.uri,
              name: response.fileName,
              size: response.fileSize,
            });
            
         // } 
          
          let {fileSizeError} = this.state;
          fileSizeError = '';
          this.setState({documentsFilePath, fileSizeError});
        } else {
          // alert('fileSizeError')
          let {fileSizeError} = this.state;
          fileSizeError = 'File size not supported. Please retry';
          this.setState({fileSizeError});
        }
      });
    });
  };

  previewFile = (data, index) => {
    const uri = this.state.documentsFilePath;
    // alert(uri)
    console.log('uri 333', uri);
    console.log(this.state.documentsFilePath, index, this.props.index);
    FileViewer.open(data.uri)
      .then(() => {
        // success
      })
      .catch(_err => {
        // error
      });
  };
  closeImage = index => {
    let {documentsFilePath} = this.state;
    documentsFilePath = documentsFilePath.filter((_, i) => i !== index);
    //documentsFilePath[this.props.index].splice(1)
    console.log('documentsFilePath 999', documentsFilePath);
    this.setState({documentsFilePath});
    this.hasValidFileSize([]).then(result => {
      // alert(result)
      if (result) {
        let {fileSizeError} = this.state;
        fileSizeError = '';
        this.setState({fileSizeError});
      } else {
        // alert('fileSizeError')
        let {fileSizeError} = this.state;
        fileSizeError =
          'File size not supported. Please retry';
        this.setState({fileSizeError});
      }
    });
  };
  getApplicantDetails = () => {
    this.setState({selectedLayout: 'applicant'});
  };
  getGurantortDetails = () => {
    this.setState({selectedLayout: 'gurantor'});
  };
  getSisterConcernDetails = () => {
    this.setState({selectedLayout: 'sisterconcern'});
  };
   getFormattedKycObservationsAPI() {
    let documentList = [];
    this.state.documentsFilePath.map((item)=>{
      return RNFS.readFile(item.uri, 'base64')
      .then(res =>{
        console.log('res base 64',res)
        documentList.push({
          filename:item.name,
          data:res
        })
      })
    })
    let kycObservstionsObj = [{
      observationId: this.state.data.observationId,
      documents:documentList,
      explanation: this.state.explanation
    }]
    let foramttedKycObservationsObj = {
      sfdcId: global.sfdcId,
      empId: global.employeeId,
     // sfdcId:"12345",
      observations:kycObservstionsObj
    };
    return foramttedKycObservationsObj;
  }
  
  kycAndBureauObservationSubmit = () => {
    var data = this.state.data;
    this.props.startListLoader()
    var kycAndBureauObservationObj = {
      // explanation:this.props.additionalBankStatementData.explanation[this.props.index],
      explanation: this.state.explanation,
      documentsFilePath: JSON.stringify(
        this.state.documentsFilePath,
      ),
      observationId: data.observationId,
      observation: this.props.additionalBankStatementData.observation,
      // id: this.props.additionalBankStatementData.id,
      caseId: data.caseId,
    };
    console.log('kycAndBureauObservationObj', kycAndBureauObservationObj);
    KycAndBureauObservationsServiceObj.updateKycAndBureauObservationsById(
      kycAndBureauObservationObj,
    )
      .then(data => {
        console.log(
          'kycAndBureauObservationObj 111',
          kycAndBureauObservationObj,
        );
        console.log('test kycobserv', data);
      })
      .catch(err => {
        console.log(err, 'error 122');
        alert(err);
      });
      this.props.selectedTab();
    if (global.isOnline) {
      let reqObj = this.getFormattedKycObservationsAPI();
      console.log('getFormattedKycObservationsAPI',reqObj)
      API_MANAGER.postKycBureauObservations(reqObj).then(res => {
        console.log('getFormattedKycObservationsAPI',reqObj)
        console.log('postKycObservation', res.response);
        // alert(JSON.stringify(res))
        var updateToken = {
          token: res.response && res.response[0].token,
          observationId: data.observationId,
          caseId: data.caseId,
        };
        KycAndBureauObservationsServiceObj.updateKycAndBureauObservationsToken(updateToken)
          .then(res =>{
            console.log("KycObservation token updated")
            var data = this.state.data;
            data.token = updateToken.token;
            data.documentsFilePath = JSON.stringify(this.state.documentsFilePath)
            this.setState({
              data,
              redo : undefined
            })
          })
        this.props.stopListLoader()
      });
    }else{
      this.props.stopListLoader()
    }
  };
  
  hasValidKycObservationList() {
    if (
      // (this.state.explanation[this.props.index] == '' || this.state.explanation[this.props.index]== undefined) ||
      this.state.documentsFilePath.length === 0 ||
      this.state.documentsFilePath == null
    ) {
      console.log('Save Disable', this.state.documentsFilePath);
      return false;
    } else {
      return true;
    }
  }
  //Reupload Statements 
  redoUploadStatements () {
    this.state.redoUploadModalVisible = false;
    this.setState({ "redo":true})
  }
  _renderHeader1(item, expanded) {
    return (
      <Card style={{width:'93%',marginBottom:10}}>
      <View style={{
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor: "#fff" ,}}>
      <Text style={[styles.accordionTitle,{textTransform:'capitalize'}]}>
       {`${item.referenceType} #${(item.index+1)} ${item.name}` }
        </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginLeft: 10, marginRight: 20}}>
              <TouchableOpacity
                onPress={() => this.onClickEdit(item.id, expanded)}>
                {/* {item.id > 0 ? <IconEdit /> : null} */}
              </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'center'}}>
              {expanded ? <IconArrowUp /> : <IconArrowDown />}
            </View>
          </View>
      </View>
      </Card>
    );
  }

  render() {
    const {documentsFilePath, uri,explanation,data} = this.state;
    let {additionalBankStatementData} = this.props;
    console.log('render kyc observation', this.state.data);
    // alert(JSON.stringify(this.state.data))
    const dataArray = [
      { title: "", content: "" ,name:this.state.data.name,index:this.state.index,referenceType:this.state.data.referenceType}
    ];
    return (
      <View style={[styles.kycObservationListContainer]}>
        {/* {
         this.state.isUploadedDocs[this.props.id] ?  */}
         {
           this.state.data.token && this.state.redo ==undefined ? 
           <Accordion
           dataArray={dataArray}
           style={{ borderColor: "#fff" }}
           animation={true}
           expanded={true}
           renderHeader={this._renderHeader1}
           renderContent={()=>
           <View style={[styles.redoUploadContainer]}>
            {(this.props.stage==1)?<View style={{backgroundColor: '#FFFFFF99',height:"120%",width:"110%",position:"absolute",zIndex:9}}/>:null}

           <View style={{flexDirection:'row',marginBottom:30}}> 
             <IconProcessComplete />
             <Text style={styles.redoHeader}>Additional Statements Uploaded Succesfully</Text>
           </View>
           <View>
             <Text style={styles.redoLabel}>Bank Statements (PDF)</Text>
             <View style={{flexDirection:'row',flexWrap:'wrap'}}> 
               {
                 this.state.documentsFilePath.map(()=>{
                     return(
                       <Image
                   source={require('../../../assets/images/icon_pdf_thumbnail.png')}
                   style={{
                     width: 35,
                     height: 50,
                     marginBottom: 15,
                     marginRight:7
                   }}
                 />
                     )
                 })
               }
               
             </View>
             <View style={{width:'97%'}}>
               <Text style={styles.redoLabel}>Explanation</Text>
               <Text style={styles.redoValue}>{this.state.explanation}</Text>
             </View>
           </View>
              <TouchableOpacity
              style={{marginLeft: 0, marginVertical: 5}}
              onPress={() => {
                this.toggleRedoUploadModal(true);
              }}
                >
              <Text
                style={[styles.btnSaveDetails, {alignSelf: 'flex-start'}]}>
                Redo Upload
              </Text>
            </TouchableOpacity>
         </View>}
         />
        
        :
        <Accordion
                  dataArray={dataArray}
                  style={{ borderColor: "#fff" }}
                  animation={true}
                  expanded={false}
                  renderHeader={this._renderHeader1}
                  renderContent={()=>  <View style={styles.additionalBankStatementWrapper}>
                  {(this.props.stage==1)?<View style={{backgroundColor: '#FFFFFF99',height:"120%",width:"110%",position:"absolute",zIndex:9}}/>:null}
                  {/* <Text style={styles.headingText}>
                    Please collect additional bank statement for a CV loan for the
                    period Jan 2018 – Jan 2019, given the payment delays shown up.
                  </Text> */}
                  <Form style={{marginTop:10}}>
                    <View style={styles.uploadFormWidget}>
                      <View style={styles.icAddressWidget}>
                        {documentsFilePath ? (
                          <View
                            style={{
                              position: 'relative',
                              width: '100%',
                              paddingBottom: 5,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                this.toggleModal(true);
                              }}
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View style={{marginTop: 0}}>
                                <Text style={styles.signedInputLabel}>
                                  Upload Signed Consent Form (MaxFile size is 4.5MB)
                                </Text>
                                <View>
                                  <View
                                    style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    {this.state.documentsFilePath.length >0
                                      ? this.state.documentsFilePath.map((data, index) => (
                                          // console.log('item 111', item);
                                          // item.map((data,index) =>
                                          <View
                                            key={index}
                                            style={{
                                              flexDirection: 'row',
                                              marginRight: 10,
                                            }}>
                                            {data.name.indexOf('.pdf') > 0 ? (
                                              <View style={{}}>
                                                <TouchableOpacity
                                                  onPress={() => this.closeImage(index)}
                                                  style={{
                                                    zIndex: 99,
                                                    position: 'relative',
                                                    left: 10,
                                                    top: 8,
                                                    width: 25,
                                                    height: 25,
                                                    alignSelf: 'flex-end',
                                                    // backgroundColor:'red'
                                                  }}>
                                                  <IconClose
                                                    style={{
                                                      position: 'relative',
                                                      top: 10,
                                                      left:8
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                  onPress={() =>
                                                    this.previewFile(data, index)
                                                  }
                                                  style={{flexDirection: 'row'}}>
                                                  <Image
                                                    source={require('../../../assets/images/icon_pdf_thumbnail.png')}
                                                    style={{
                                                      width: 30,
                                                      height: 40,
                                                      marginBottom: 10,
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                              </View>
                                            ) : (
                                              <View>
                                                <TouchableOpacity
                                                  onPress={() => this.closeImage(index)}
                                                  style={{
                                                    zIndex: 99,
                                                    position: 'relative',
                                                    left: 10,
                                                    top: 10,
                                                    width: 25,
                                                    height: 25,
                                                    alignSelf: 'flex-end',
                                                    // backgroundColor:'red'
                                                  }}>
                                                  <IconClose
                                                    style={{
                                                      position: 'relative',
                                                      top: 8,
                                                      left:8
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                  onPress={() =>
                                                    this.previewFile(data, index)
                                                  }>
                                                  <Image
                                                    source={{uri: data.uri}}
                                                    style={{
                                                      width: 30,
                                                      height: 40,
                                                      marginBottom: 10,
                                                    }}
                                                  />
                                                </TouchableOpacity>
                                              </View>
                                            )}
                                          </View>
                                        ))
                                      : null}
                                    <View
                                      style={{
                                        position: 'absolute',
                                        left: 0,
                                        bottom: -5,
                                      }}>
                                      {this.state.fileSizeError !='' ? 
                                        <Text style={styles.fileSizeError}>
                                          {this.state.fileSizeError}
                                        </Text>
                                       : null}
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View style={{position: 'absolute', bottom: 5, right: 0}}>
                                <IconUpload style={{}} />
                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.toggleModal(true);
                            }}>
                            <View style={{textAlign: 'right'}}>
                              <Text style={styles.signedInputLabel}>
                               Upload Signed Consent Form{' '}
                              </Text>
                              <IconUpload
                                style={{position: 'absolute', top: 5, right: 50}}
                              />
                            </View>
                            {/* <Text style={styles.fileSizeError}>{this.state.fileSizeError}</Text> */}
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={[styles.addCommentsStyle,{marginTop:20,}]}>
                      
                      <FloatingLabelNameInput
                        label="Add Explanation"
                        //  value={explanation ? explanation.trim() : "" }
                        value={explanation }
                        onValueChanged={text =>
                          this.onChangeAddExplanation(text)
                        }
                      />
                    </View>
                    {this.hasValidKycObservationList() ? (
                      <TouchableOpacity
                        style={{marginLeft: 0, marginVertical: 5}}
                        onPress={
                          ()=>this.kycAndBureauObservationSubmit()
                        }
                          >
                        <Text
                          style={[styles.btnSaveDetails, {alignSelf: 'flex-start'}]}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{marginLeft: 0, marginVertical: 5}}>
                        <Text style={styles.btnSaveDetailsDisable}>Submit</Text>
                      </View>
                    )}
                   
                  </Form>
                </View>}
                />
       
        
            }

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.modalOverlayBtn}
            onPress={() => {
              this.toggleModal(!this.state.modalVisible);
            }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>
          <View style={styles.modal}>
            <View style={[styles.modalHeader]}>
              <Text style={styles.modalTitle}>
                {' '}
                Upload Signed Consent Form{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleModal(!this.state.modalVisible);
                }}>
                <Text style={styles.text}>
                  <IconArrowDown />
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 40,
                justifyContent: 'space-around',
              }}>
              <View style={styles.uploadWidget}>
                <IconPdf style={styles.iconSpace} />
                <TouchableOpacity
                  onPress={() => this.handleChoosePdf(this.props.index)}>
                  <Text style={styles.btnSaveDetails}> Upload PDF</Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconCamera style={styles.iconSpace} />
                <TouchableOpacity
                  onPress={() => this.handleChooseCamera(this.props.index)}>
                  <Text style={styles.btnSaveDetails}> Take Photo</Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconGallery style={styles.iconSpace} />
                <TouchableOpacity
                  onPress={() => this.handleChoosePhoto(this.props.index)}>
                  <Text style={styles.btnSaveDetails}> Open Gallery </Text>
                </TouchableOpacity>
                <View style={styles.uploadWidgetSeparator}></View>
              </View>
              <View style={styles.uploadWidget}>
                <IconMail style={styles.iconSpace} />
                <TouchableOpacity>
                  <Text style={[styles.btnSaveDetails,{backgroundColor:'#d8ada1',}]}> Open Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.redoUploadModalVisible}
          transparent={true}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <TouchableOpacity
            style={styles.modalOverlayBtn}
            onPress={() => {
              this.toggleRedoUploadModal(!this.state.redoUploadModalVisible);
            }}>
            <View style={styles.modalOverlay}></View>
          </TouchableOpacity>
          <View style={styles.redoUploadModal}>
            <View style={[styles.modalHeader]}>
              <Text style={styles.modalTitle}>
                {' '}
                Are you sure you want to Re-upload the documents?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleRedoUploadModal(!this.state.redoUploadModalVisible);
                }}>
                <Text style={styles.text}>
                  <IconArrowDown />
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 40,
              }}>
              <View style={[styles.uploadWidget,{marginLeft:10,marginRight:20}]}>
                <TouchableOpacity
                  onPress={() => this.redoUploadStatements()}>
                  <Text style={styles.btnSaveDetails}> Yes</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.uploadWidget]}>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleRedoUploadModal(!this.state.redoUploadModalVisible);
                  }}>
                  <Text style={styles.btnWithBorder}> No </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    additionalBankStatementData:state.kycBureauObservations.additionalBankStatementData,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAdditionalBankStatementDataUpdate: text =>
      dispatch({type: 'ADDITIONAL_BANK_STATEMENT_DATA_UPDATE', payload: text}),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KycObservationListComponent);
