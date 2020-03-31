import React, {Component} from 'react';
import {
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
  Picker,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import {Form, Input, Label, Icon, Radio, CheckBox, Col} from 'native-base';
import NetworkStatusToast from '../NetworkStatusToast';
import DocumentStatus from '../kycBureau/documentStatusComponent';
import styles from '../kycBureau/kycBureauComponentStyle';
import IconDownload from '../../assets/images/icon_download.svg';
import IconAdd from '../../assets/images/icon_add.svg';
import IconPlus from '../../assets/images/icon_plus.svg';
import ArrowDown from '../../assets/images/icon_arrow_down.svg';
import IconUpload from '../../assets/images/icon_upload.svg';
import IconMinus from '../../assets/images/icon_minus.svg';
import IconClose from '../../assets/images/path_copy.svg';
import IconEdit from '../../assets/images/icon_edit.svg';
import Colors from '../../styles/Colors';
import FloatingLabelNameInput from '../customcomponents/FloatingLabelNameInput';
import FinancialFiguresService from "../../Database/Services/FinancialFigures/financialFiguresService"
import DocumentTransaction from "../../Database/Services/DocumentTransaction/DocumentTransaction"
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorageFunc from '../../utilities/asyncStorage'
import { ASYNCSTORAGE } from '../../constants/AsyncStorage/asyncStorageConstants';
import {FINANCIALS} from "../../constants/Financial/financialConstants";
import {connect} from 'react-redux';
import handlePermissions from "../../utilities/permissionHandler"

const width = Dimensions.get('window').width;
let screenHeight = Dimensions.get('screen').height;
let height = Dimensions.get('window').height; 
let bottomNavBarHeight = screenHeight - height;
const financialFiguresService=new FinancialFiguresService();
const documentTransaction=new DocumentTransaction();


function Item({
  sno,
  financialsStatementType,
  financialsYear,
  fileName,
  remarks,
  index,
  length
}) {
  return (
    <View
      style={
        index % 2 == 0
          ? [financialStyles.tableOddContent,index==length-1?{ borderBottomLeftRadius:2,borderBottomRightRadius:2}:{}]
          : [financialStyles.tableEvenContent,index==length-1?{ borderBottomLeftRadius:2,borderBottomRightRadius:2}:{}]
      }>
      <View style={[financialStyles.tableContentData, {width: '8%'}]}>
        <Text style={[financialStyles.font]}>{sno}</Text>
      </View>
      <View style={financialStyles.tableRightMargin} />

      <View style={[financialStyles.tableContentData, {width: '32%'}]}>
        <Text style={[financialStyles.font]}>{financialsStatementType}</Text>
      </View>
      <View style={financialStyles.tableRightMargin} />

      <View style={[financialStyles.tableContentData, {width: '18%'}]}>
        <Text style={[financialStyles.font]}>{financialsYear}</Text>
      </View>
      <View style={financialStyles.tableRightMargin} />

      <View style={[financialStyles.tableContentData, {width: '13%'}]}>
        <Text style={[financialStyles.font]}>{fileName}</Text>
      </View>
      <View style={financialStyles.tableRightMargin} />

      <View style={[financialStyles.tableContentData, {width: '29%'}]}>
        {remarks==''?
        <Text style={[financialStyles.font]}>-</Text>
        :
        <Text style={[financialStyles.font]}>{remarks}</Text>}
      </View>
    </View>
  );
}

class FinancialsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStatementModalVisible: false,
      financialStatement:{
        uploadedStatement:{name:'',uri:''},
        comments: '',
        statementType:'',
        financialYear:'',
        statementId:'',
        errorMessage:''
      },   
      isSpreadSheetModalVisible:false,
      financialSpreadSheet:{
        uploadedSpreadSheets:[{name:'',uri:''}],
        comments:'',
        errorMessage:''
      },    
      isAddKeyFiguresModalVisible:false,
      keyFinancialFigures:{
       id:'',
       year:'',
       sales:'',
       capital:'',
       unsecuredLoan:'',
       pat:'',
       loansAndAdvances:'',
       debtorMoreThan6Months:'',
       debtorLessThan6Months:'',
       nameAndAmountArray:[{nameOfParty:'',amount:''}]
      },
      financialStatementTypes:[{name:'',value:''}],
      financialYears:[],
      keyFinancialYears:[],
      tableData:[],
      isModified:false,
      isUpdated:false,
      financialViewHeight: height - 100
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
var date = new Date();
var currentYear = date.getFullYear();
let financialYears=[];
var financialYear={
  name:'Select Financials Year',
  value:'Select Financials Year'
}
financialYears.push(financialYear);
let newYear=currentYear-9;
let i;
for(i=newYear;i<=currentYear;i++){
  financialYear={
    name:i+'',
    value:i+''
  }
  financialYears.push(financialYear);
}
let j=i+1;
for(j=i;j<=currentYear+5;j++){
  financialYear={
    name:j+'', 
    value:j+''
  }
  financialYears.push(financialYear);
}
let tableData=[]

var keyFinancialYears=[{
  name:'Add Year',
  value:'Add Year'
}]
let keyFinancial;
for(let y=2000;y<=2020;y++){
  keyFinancial={
    name:y+'',
    value:y+''
  }
  keyFinancialYears.push(keyFinancial)
}
let financialStatementArray=[];
financialStatementArray[0]={name:'Financial Statement Type',value:'Financial Statement Type'};
let financialStatement;
AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res=>{
   res.configuration.financialStatementTypes.map(financial=>{
    financialStatement={
     name:financial.financialStatementType,
     value:financial.statementTypeId,
    }
    financialStatementArray.push(financialStatement);
   })
})
if(this.props.financialData.isUpdated==true){
  this.setState(JSON.parse(JSON.stringify(this.props.financialData)));
}else{
  this.getFinancialsFiguresFromDB().then(financialFigures=>{
    documentTransaction.getFinancialStatementsByCaseId(global.currentCaseIdentifiers.caseId,financialStatementArray).then(res2=>{
      tableData=res2;
      const financialData={
        ...this.state,
        financialYears:financialYears,
       tableData:tableData,
       keyFinancialYears:keyFinancialYears,
       keyFinancialFigures:financialFigures,
       financialStatementTypes:financialStatementArray,
       isUpdated:true
     }
      this.setState({financialYears:financialYears,tableData:tableData,keyFinancialYears:keyFinancialYears,keyFinancialFigures:financialFigures,financialStatementTypes:financialStatementArray,isUpdated:true},()=>{
        this.props.updateFinancials(financialData);
      }
 )
    })
 })
}
   }

   getFinancialsFiguresFromDB=()=>{
     return new Promise((resolve,reject)=>{
      let financialFigures;
      financialFiguresService.getFinancialFiguresByCaseId(global.currentCaseIdentifiers.caseId).then(financial=>{  
      if(financial==null){
        financialFigures = {
          id: '',
          caseId:'',
          year:'',
          sales:'',
          capital:'',
          unsecuredLoan:'',
          pat:'',
          loansAndAdvances:'',
          debtorLessThan6Months:'',
          debtorMoreThan6Months:'',
          nameAndAmountArray:[{nameOfParty:'',amount:''}]
        };
      }else{
        let nameAndAmountArray=[];
        let nameOfPartyArray=financial.nameOfParty.split(',');
        let amountArray=financial.amount.split(',');
        let nameAndAmount;
        for(let i=0;i<nameOfPartyArray.length;i++){
             nameAndAmount={
               nameOfParty:nameOfPartyArray[i],
               amount:amountArray[i]
             }
             nameAndAmountArray.push(nameAndAmount);
        }   
         financialFigures = {
          id: financial.id,
          caseId: financial.caseId,
          year: financial.year+'',
          sales: financial.sales,
          capital: financial.capital,
          unsecuredLoan: financial.unsecuredLoan,
          pat: financial.pat,
          loansAndAdvances: financial.loansAndAdvances,
          debtorLessThan6Months: financial.debtorLessThan6Months,
          debtorMoreThan6Months: financial.debtorMoreThan6Months,
          nameAndAmountArray:nameAndAmountArray
        };
      }
   }).then(result=>{
     resolve(financialFigures)
   }).catch(err => {
    console.log(err);
  });


     })
   }

   async handleChoosePdf() {
    if(await handlePermissions.hasStoragePermission()){
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log('res : ' + JSON.stringify(res));
      const max_file_size = 4718592;
      if (res.size > max_file_size) {
        const financialStatement={
          ...this.state.financialStatement,
          errorMessage:'Maximum file size should be 4.5MB'
        }
        const financialData={
          ...this.state,
          financialStatement:financialStatement
        }
        this.setState({financialStatement:financialStatement},()=>{
          this.props.updateFinancials(financialData)
        })
      } else {
        try {
          var despath = RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf/' + res.name;
          console.log('Dest Path', despath)
          RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf')
            .then((result) => {
              console.log('result', result)
            })
            .catch((err) => {
              console.warn('err', err)
            })
          await RNFS.copyFile(decodeURIComponent(res.uri), despath)
            .then((result) => {
              console.log('Result', result)
            })
            .then((result) => {
              console.log('Result', result)
            }).catch((err) => {
              console.log('Error', err)
            })

        } catch (error) {
        }        
        var uploadedStatement = { uri: despath, name: res.name }
        const financialStatement={
          ...this.state.financialStatement,
          uploadedStatement:uploadedStatement,
          errorMessage:''
        }
        const financialData={
          ...this.state,
          financialStatement:financialStatement,
          isModified:true
        }
        this.setState({financialStatement:financialStatement,isModified:true},()=>{
          this.props.updateFinancials(financialData);
        })
      }
     }
    catch (err) {
      if (DocumentPicker.isCancel(err)) {
       } else {
         throw err;
       }
     }
    }
   }

   async handleChooseExcelAndCsv() { 

    if(await handlePermissions.hasStoragePermission()){
     const {financialSpreadSheet}=this.state;
    try {    
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      });
      const max_file_size = 9437184;
      let splitName1=res[0].name.split('.');
          let extension1=splitName1[splitName1.length-1];
          let splitName2;
          let extension2;
          if(res.length>1){
          splitName2=res[1].name.split('.');
          extension2=splitName2[splitName2.length-1];
          }
          let uploadedSpreadSheets=[];
          console.log("extension1",extension1);
          console.log("extension1",extension2);
      if(res.length>2){
        const spreadSheet={
          ...financialSpreadSheet,
          errorMessage:'Please upload only two files(Excel+CSV)'
        }
        const financialData={
          ...this.state,
          financialSpreadSheet:spreadSheet,
        }
        this.setState({financialSpreadSheet:spreadSheet},()=>{
          this.props.updateFinancials(financialData)
        })
      }
      else if(res.length==1){
        const spreadSheet={
          ...financialSpreadSheet,
          errorMessage:'Please upload two files(Excel+CSV)'
        }
        const financialData={
          ...this.state,
          financialSpreadSheet:spreadSheet,
        }
        this.setState({financialSpreadSheet:spreadSheet},()=>{
          this.props.updateFinancials(financialData)
        })
      }
      else if((extension1=='xls'&&extension2!='csv')||(extension1=='csv'&&extension2!='xls')){
        
            const spreadSheet={
              ...financialSpreadSheet,
              errorMessage:'Please upload Excel+CSV'
            }
            const financialData={
              ...this.state,
              financialSpreadSheet:spreadSheet,
            }
            this.setState({financialSpreadSheet:spreadSheet},()=>{
              this.props.updateFinancials(financialData)
            })
      }
      else if(res[0].size+res[1].size > max_file_size) {
        const spreadSheet={
          ...financialSpreadSheet,
          errorMessage:'Maximum file size should be less than 9MB'
        }
        const financialData={
          ...this.state,
          financialSpreadSheet:spreadSheet,
        }
        this.setState({financialSpreadSheet:spreadSheet},()=>{
          this.props.updateFinancials(financialData)
        })
      } else {
        try {
          for (const result of res) {
            console.log(
              result.uri,
              result.type, // mime type
              result.name,
              result.size
            );
          
          var despath = RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf/' + result.name;
          console.log('Dest Path', despath)
          RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/Android/com.victorbank.rmapp/pdf')
            .then((res1) => {
              console.log('result', res1)
            })
            .catch((err) => {
              console.warn('err', err)
            })
          await RNFS.copyFile(decodeURIComponent(result.uri), despath)
            .then((res2) => {
              console.log('Result', res2)
            })
            .then((res3) => {
              console.log('Result', res3)
            }).catch((err) => {
              console.log('Error', err)
            })
              var uploadedSpreadSheet = { uri: despath, name: result.name }
               uploadedSpreadSheets.push(uploadedSpreadSheet);
          }

        } catch (error) {
        }   
        const financialSpreadSheet={
          ...this.state.financialSpreadSheet,
          errorMessage:'',
          uploadedSpreadSheets:uploadedSpreadSheets
        }
        const financialData={
          ...this.state,
          financialSpreadSheet:financialSpreadSheet,
          isModified:true
        }
        this.setState({financialSpreadSheet:financialSpreadSheet,isModified:true},()=>{
          this.props.updateFinancials(financialData);
        })     
      }
     }
    catch (err) {
      if (DocumentPicker.isCancel(err)) {
       } else {
         throw err;
       }
     }
    }
   }

   readPdf=(despath)=>{
      FileViewer.open(despath)
            .then((res1) => {
            //  console.log("file",res1)
            })
            .catch(_err => {
              // error
            });
   }

   toggleStatementUploadModal=()=>{
     let {isStatementModalVisible}=this.state;
     const financialData={
      ...this.state,
      isStatementModalVisible:!isStatementModalVisible
    }
     this.setState({isStatementModalVisible:!isStatementModalVisible},()=>{
       this.props.updateFinancials(financialData)
     })
   }
  onChangeStatementComments = text => {
    let financialStatement={
      ...this.state.financialStatement,
      comments:text
    }
    const financialData={
      ...this.state,
      financialStatement:financialStatement,
      isModified:true
    }
    this.setState({financialStatement,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  handleStatementUploadButtonPress=()=>{
    const {financialStatement,isModified,financialStatementTypes}=this.state;
    const statement={
      caseId:global.currentCaseIdentifiers.caseId,
      documentId:financialStatement.statementId,
      status:"uploaded",
      remarks:financialStatement.comments,
      fileName:financialStatement.uploadedStatement.name,
      filePath:financialStatement.uploadedStatement.uri,
      financialStatementType:financialStatement.statementType,
      financialYear:financialStatement.financialYear,
      isModified:isModified,
      isDataSubmittedToServer:true,
      isServerResponseReceivedSuccessfully:false,       
    }
    documentTransaction.addFinancialStatement(statement).then(res=>{

      if(global.isOnline){
        //call api and update token in response.

      }
        let statement={
          uploadedStatement:{name:'',uri:''},
          comments: '',
          financialYear:'',
          statementType:''
        }
     documentTransaction.getFinancialStatementsByCaseId(global.currentCaseIdentifiers.caseId,financialStatementTypes).then(res=>{
              const financialData={
                ...this.state,
                tableData:res,
                financialStatement:statement,
                isStatementModalVisible:false
              }
              this.setState({tableData:res,financialStatement:statement,isStatementModalVisible:false},()=>{
                this.props.updateFinancials(financialData)
              })
     })
    })
  }

  handleSpreadSheetUploadButtonPress=()=>{
   
    
      const {financialSpreadSheet}=this.state;
      const spreadSheet={
        caseId:global.currentCaseIdentifiers.caseId,
        documentId:FINANCIALS.EXCEL_CSV_DOCUMENT_ID,
        status:"uploaded",
        remarks:financialSpreadSheet.comments,
        fileName:financialSpreadSheet.uploadedSpreadSheets[0].name+","+financialSpreadSheet.uploadedSpreadSheets[1].name,
        filePath:financialSpreadSheet.uploadedSpreadSheets[0].uri+","+financialSpreadSheet.uploadedSpreadSheets[1].uri,
        isModified:this.state.isModified,
        isDataSubmittedToServer:true,
        isServerResponseReceivedSuccessfully:false,
      }
      documentTransaction.addFinancialSpreadSheet(spreadSheet).then(res=>{
        if(global.isOnline){
          //call api and update token in response.
  
        }
        let sheet={
          uploadedSpreadSheets:[{name:'',uri:''}],
          comments:'',
          errorMessage:''
        }
        const financialData={
          ...this.state,
          financialSpreadSheet:sheet,
          isSpreadSheetModalVisible:false
        }
        this.setState({financialSpreadSheet:sheet,isSpreadSheetModalVisible:false},()=>{
          this.props.updateFinancials(financialData)
        });

      })
       
  }

  handleStatementCancelPress = () => {
    const {isStatementModalVisible}=this.state;
    const financialStatement={
      ...this.state.financialStatement,
      uploadedStatement:{name:'',uri:''},
      comments:''
    }
    const financialData={
      ...this.state,
      financialStatement:financialStatement,
      isStatementModalVisible: !isStatementModalVisible
    }
    this.setState({financialStatement:financialStatement,isStatementModalVisible: !isStatementModalVisible},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  handleSpreadSheetUploadLinkPress = () => {
    this.toggleSpreadSheetModal();
  };

  toggleSpreadSheetModal=()=>{
      let {isSpreadSheetModalVisible}=this.state;
      const financialData={
        ...this.state,
        isSpreadSheetModalVisible:!isSpreadSheetModalVisible
      }
      this.setState({isSpreadSheetModalVisible:!isSpreadSheetModalVisible},()=>{
        this.props.updateFinancials(financialData)
      })
  }

  handleSpreadSheetDownArrowPress = () => {
    this.handleSpreadSheetCancelPress();
  };

  onChangeSpreadSheetComments = text => {
    const financialSpreadSheet={
      ...this.state.financialSpreadSheet,
      comments:text
    }
    const financialData={
      ...this.state,
      financialSpreadSheet: financialSpreadSheet,
      isModified:true
    }
    this.setState({financialSpreadSheet: financialSpreadSheet,isModified:true},()=>{
      this.props.updateFinancials(financialData);
    });
  };

  handleSpreadSheetCancelPress = () => {
    const {isSpreadSheetModalVisible}=this.state;
    const financialSpreadSheet={
      uploadedSpreadSheets:[{name:'',uri:''}],
        comments:'',
        errorMessage:''
    }
    const financialData={
      ...this.state,
      financialSpreadSheet:financialSpreadSheet,
      isSpreadSheetModalVisible: !isSpreadSheetModalVisible
    }
    this.setState({financialSpreadSheet:financialSpreadSheet,isSpreadSheetModalVisible: !isSpreadSheetModalVisible},()=>{
      this.props.updateFinancials(financialData);
    });
  };

  toggleAddKeyFiguresModal=()=>{
    const {isAddKeyFiguresModalVisible}=this.state;
    const financialData={
      ...this.state,
      isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible
    }
    this.setState({isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible},()=>{
      this.props.updateFinancials(financialData)
    })
  }
  
  handleAddKeyFiguresCancelPress=()=>{
    const {keyFinancialFigures,isAddKeyFiguresModalVisible}=this.state;
    const financialFigures={
      id:'',
      sales:'',
      capital:'',
      unsecuredLoan:'',
      pat:'',
      loansAndAdvances:'',
      debtorMoreThan6Months:'',
      debtorLessThan6Months:'',
      nameAndAmountArray:[{nameOfParty:'',amount:''}]
     }
     if(keyFinancialFigures.id!=''){
       this.getFinancialsFiguresFromDB().then(financialFigure=>{
         const financialData={
           ...this.state,
           keyFinancialFigures:financialFigure,
           isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible
         }
        this.setState({keyFinancialFigures:financialFigure,isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible},()=>{
          this.props.updateFinancials(financialData)
        })
       })
     }
     else{
      const financialData={
        ...this.state,
        keyFinancialFigures:financialFigures,
        isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible
      }
      this.setState({keyFinancialFigures:financialFigures,isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible},()=>{
        this.props.updateFinancials(financialData)
      })
     }  
  }

  onChangeAddKeyFigureSales = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      sales:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureCapital = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      capital:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureUnsecuredLoan = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      unsecuredLoan:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigurePat = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      pat:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData);
    });
  };

  onChangeAddKeyFigureLoansAndAdvances = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      loansAndAdvances:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureDebtorMoreThanSixMonths = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      debtorMoreThan6Months:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureDebtorLessThanSixMonths = text => {
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      debtorLessThan6Months:text
    }
    const financialData={
      ...this.state,
      keyFinancialFigures: keyFinancialFigures,
      isModified:true
    }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureNameOfParty = (text,index) => {
    const {keyFinancialFigures}=this.state;
    keyFinancialFigures.nameAndAmountArray[index]={...keyFinancialFigures.nameAndAmountArray[index],
                                                    nameOfParty:text
                                                  }
   const financialData={
        ...this.state,
        keyFinancialFigures: keyFinancialFigures,
        isModified:true
          }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  onChangeAddKeyFigureAmount = (text,index) => {
    const {keyFinancialFigures}=this.state;
    keyFinancialFigures.nameAndAmountArray[index]={...keyFinancialFigures.nameAndAmountArray[index],
                                                    amount:text
                                                  }
    const financialData={
          ...this.state,
          keyFinancialFigures: keyFinancialFigures,
          isModified:true
                }
    this.setState({keyFinancialFigures: keyFinancialFigures,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    });
  };

  handleOnClickCloseStatement=()=>{
    const financialStatement={
      ...this.state.financialStatement,
      uploadedStatement:{uri:'',name:''}
    }
    const financialData={
      ...this.state,
      financialStatement:financialStatement,
      isModified:true
    }
    this.setState({financialStatement:financialStatement,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    })
  }

  handleOnClickCloseSpreadSheet=()=>{
    const financialSpreadSheet={
      ...this.state.financialSpreadSheet,
      uploadedSpreadSheets:[{name:'',uri:''}]
    }
    const financialData={
      ...this.state,
      financialSpreadSheet:financialSpreadSheet,
      isModified:true
    }
    this.setState({financialSpreadSheet:financialSpreadSheet,isModified:true},()=>{
      this.props.updateFinancials(financialData)
    })
  }

  _renderFinancialStatementTypes=()=> {
    const  { financialStatementTypes } = this.state;
    return financialStatementTypes.map(item => (
      <Picker.Item label={item.name} value={item.value} />
    ));
  }

  onChangeStatementType=(value,index)=>{
    const {financialStatementTypes}=this.state;
    const financialStatement={
      ...this.state.financialStatement,
      statementType:financialStatementTypes[index].name,
      statementId:value
    }
    const financialData={
      ...this.state,
      financialStatement:financialStatement,
      isModified:true
    }
        this.setState({financialStatement:financialStatement,isModified:true},()=>{
          this.props.updateFinancials(financialData)
        })
  }

  onChangeFinancialYear=(value)=>{
    const financialStatement={
      ...this.state.financialStatement,
      financialYear:value
    }
    const financialData={
      ...this.state,
      financialStatement:financialStatement,
      isModified:true
    }
        this.setState({financialStatement:financialStatement,isModified:true},()=>{
          this.props.updateFinancials(financialData)
        })
  }

  onChangeKeyFinancialYear=(value)=>{
    const keyFinancialFigures={
      ...this.state.keyFinancialFigures,
      year:value
    }
    const financialData={
      ...this.state,
      keyFinancialFigures:keyFinancialFigures,
      isModified:true
    }
        this.setState({keyFinancialFigures:keyFinancialFigures,isModified:true},()=>{
          this.props.updateFinancials(financialData)
        })
  }

  handleStatementDownArrowPress=()=>{
    this.handleStatementCancelPress();
  }

  _renderFinancialYears=()=> {
    const  { financialYears } = this.state;
    return financialYears.map(item => (
      <Picker.Item label={item.name} value={item.value} />
    ));
  }

  _renderKeyFinancialYears=()=> {
    const  { keyFinancialYears } = this.state;
    return keyFinancialYears.map(item => (
      <Picker.Item label={item.name} value={item.value} />
    ));
  }

  handleAddNameAndAmount=()=>{
    const {keyFinancialFigures}=this.state;
    let newNameAndAmount={nameOfParty:'',amount:''}
    keyFinancialFigures.nameAndAmountArray.push(newNameAndAmount);
    const financialData={
      ...this.state,
      keyFinancialFigures:keyFinancialFigures
    }
    this.setState({keyFinancialFigures:keyFinancialFigures},()=>{
      this.props.updateFinancials(financialData)
    })
  }

  handleMinusNameAndAmount=()=>{
    const {keyFinancialFigures}=this.state;
    keyFinancialFigures.nameAndAmountArray.pop();
    const financialData={
      ...this.state,
      keyFinancialFigures:keyFinancialFigures
    }
    this.setState({keyFinancialFigures:keyFinancialFigures},()=>{
      this.props.updateFinancials(financialData)
    })
  }

  handleAddKeyFiguresSubmitPress=()=>{
    const {keyFinancialFigures,isAddKeyFiguresModalVisible}=this.state;
    
    let nameOfParty='';
    let amount='';
    keyFinancialFigures.nameAndAmountArray.map((nameAndAmount,index)=>{
        nameOfParty=nameOfParty+nameAndAmount.nameOfParty+',';
        amount=amount+nameAndAmount.amount+',';
    })
    nameOfParty = nameOfParty.substring(0, nameOfParty.length - 1);
    amount = amount.substring(0, amount.length - 1);
    const financialFigures={
              caseId:global.currentCaseIdentifiers.caseId,
              year:keyFinancialFigures.year,
              sales:keyFinancialFigures.sales,
              capital:keyFinancialFigures.capital,
              unsecuredLoan:keyFinancialFigures.unsecuredLoan,
              pat:keyFinancialFigures.pat,
              loansAndAdvances:keyFinancialFigures.loansAndAdvances,
              debtorLessThan6Months:keyFinancialFigures.debtorLessThan6Months,
              debtorMoreThan6Months:keyFinancialFigures.debtorMoreThan6Months,
              nameOfParty:nameOfParty,
              amount:amount,
              isModified:this.state.isModified,
              isUpdateRequired:false,
              isDataSubmittedToServer:true,
              isServerResponseReceivedSuccessfully:false,
    }
    if(keyFinancialFigures.id==''){
      financialFiguresService.addFinancialFigures(financialFigures).then(res=>{
            
        if(global.isOnline){
          //call api and update token
        }
  
        this.getFinancialsFiguresFromDB().then(financialFigures=>{
          const financialData={
            ...this.state,
            keyFinancialFigures:financialFigures,
            isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible
          }
          this.setState({keyFinancialFigures:financialFigures,isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible},()=>{
            this.props.updateFinancials(financialData);
          })
        })     
      })
    }
    else{
      financialFiguresService.updateFinancialFiguresByCaseId(financialFigures).then(res=>{
            
        if(global.isOnline){
          //call api and update token
        }
        this.getFinancialsFiguresFromDB().then(financialFigures=>{
          const financialData={
            ...this.state,
            keyFinancialFigures:financialFigures,
            isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible
          }
          this.setState({keyFinancialFigures:financialFigures,isAddKeyFiguresModalVisible:!isAddKeyFiguresModalVisible},()=>{
            this.props.updateFinancials(financialData);
          })
        }) 
      })
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

  }

  _keyboardDidShow = () => {
    this.setState({ financialViewHeight: 300 })
  }

  _keyboardDidHide = () => {
    this.setState({ financialViewHeight: height - 100 })
  }


  renderNameAndAmountArray=()=>{
    const {keyFinancialFigures}=this.state;
   return(
   keyFinancialFigures.nameAndAmountArray.map((item,index)=>{
    return(
      <View style={{flexDirection:"row",marginTop:30}}>
            <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Name of party"
                    value={item.nameOfParty}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureNameOfParty(text,index)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Amount"
                    value={item.amount}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureAmount(text,index)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>
                {index==0?
                  <View style={{marginTop:30,flexDirection:'row'}}>
                    {keyFinancialFigures.nameAndAmountArray.length>1?
                     <TouchableOpacity style={{marginRight:20}}
                     onPress={()=>this.handleMinusNameAndAmount()}>
                       <IconMinus/>
                     </TouchableOpacity>:
                      <View style={{marginRight:20,opacity:0.5}}>
                      <IconMinus/>
                      </View>
                  }
                  <TouchableOpacity onPress={()=>this.handleAddNameAndAmount()}>
                      <IconPlus/>
                  </TouchableOpacity>
                  </View>:null}
            </View>
    )
   })
   )
  }

  render() {
    const {financialStatement,financialSpreadSheet,keyFinancialFigures}=this.state
    return (
      <View style={{flex: 1, backgroundColor: Colors.contentBgColor}}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 40,
              justifyContent: 'space-between',
            }}>
            <View style={[styles.kycFormContainer, {marginBottom: 90}]}>
              <Text style={styles.title}>Financials</Text>
              <View style={[financialStyles.container, {padding: 16}]}>
                <Text style={financialStyles.boldFont}>
                  Upload Financial Spread Sheet
                </Text>
              </View>
              <View style={[financialStyles.downloadContainer]}>
                <TouchableOpacity
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <IconDownload />
                  <Text
                    style={[
                      financialStyles.boldFont,
                      {textDecorationLine: 'underline', paddingLeft: 8},
                    ]}>
                    Download Excel File
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 2}}
                                  onPress={()=>{this.handleSpreadSheetUploadLinkPress()}}>
                  <Text style={financialStyles.uploadExcelCsv}>
                    Upload Excel + CSV File
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity>
                  <Text style={financialStyles.initiateFinancialAnalysis}>
                    Initiate Financials Analysis
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  financialStyles.container,
                  {padding: 16, marginTop: 30},
                ]}>
                <Text style={financialStyles.boldFont}>
                  {' '}
                  Upload Financial Statement Files
                </Text>
              </View>
              <View style={[financialStyles.uploadStatementContainer]}>
                <View style={{flexDirection: 'row'}}>
            
            <View style={{ width: '90%',marginRight:20,flex:2 }}>
            <Picker
              itemTextStyle={{ color: '#f00' }}
              mode="dropdown"
             // iosIcon={<Icon name="arrow-down" />}
            selectedValue={financialStatement.statementId}
            onValueChange={(itemValue,index) =>this.onChangeStatementType(itemValue,index) }
              >
             { this._renderFinancialStatementTypes()}
            </Picker>
            <View style={financialStyles.bottomLine}></View>
            </View>
                 
                
            <View style={{ width: '90%',marginRight:30,flex:1.9 }}>
            <Picker
              itemTextStyle={{ color: '#f00' }}
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              selectedValue={financialStatement.financialYear}
            onValueChange={itemValue =>this.onChangeFinancialYear(itemValue) }
              >
             {this._renderFinancialYears()}
            </Picker>
            <View style={financialStyles.bottomLine}></View>
            </View>
             {financialStatement.statementType==''||financialStatement.statementType=='Financial Statement Type'
             ||financialStatement.financialYear==''||financialStatement.financialYear=='Select Financials Year'?
             

             <View
             style={{flex: 0.4, marginTop: 25}}>
             <Text style={financialStyles.disableUploadExcelCsv}>Upload</Text>
            </View>
            :
                  <TouchableOpacity
                    style={{flex: 0.4, marginTop: 25}}
                    onPress={() =>  this.toggleStatementUploadModal()}>
                    <Text style={financialStyles.uploadExcelCsv}>Upload</Text>
                  </TouchableOpacity>
              }
                </View>

                {keyFinancialFigures.id==''?
                   <TouchableOpacity
                   style={{
                   //  flexDirection: 'row',
                    // alignContent: 'center',
                     marginTop: 25,
                   }}
                   onPress={()=>this.toggleAddKeyFiguresModal()}>
                   <Text style={[financialStyles.boldFont,{  marginTop: 2,textDecorationLine:"underline"}]}>
                     Add Key Financial Figures
                   </Text>
                 </TouchableOpacity>
                 :
                 <View style={[financialStyles.editKeyFinancials]}>
                  <View style={{marginLeft:20,flexDirection:'row',flex:1}}>
                    <Text style={[financialStyles.boldFont]}>
                      Key Financial Figures
                    </Text>
                    <Text style={{ color: '#58595b',fontFamily: 'Helvetica',fontSize: 14}}> - {keyFinancialFigures.year}</Text>
                    </View>
                    <TouchableOpacity
                    onPress={()=>this.toggleAddKeyFiguresModal()} 
                    style={{flex:0.07}}>
                      <IconEdit/>
                    </TouchableOpacity>       
                </View>}
               
              </View>
                
              {this.state.tableData.length>0 ?
              <View>
              <View
                style={[
                  financialStyles.container,
                  {padding: 16, marginTop: 10},
                ]}>
                <Text style={financialStyles.boldFont}>Statements Details</Text>
              </View>

              <View style={[financialStyles.tableHeader]}>
                <View style={[financialStyles.tableHeaderData, {width: '8%'}]}>
                  <Text style={[financialStyles.boldFont]}>S.NO</Text>
                </View>
                <View style={financialStyles.tableRightMargin} />

                <View style={[financialStyles.tableHeaderData, {width: '32%'}]}>
                  <Text style={[financialStyles.boldFont]}>
                    Financials Statements Type
                  </Text>
                </View>
                <View style={financialStyles.tableRightMargin} />

                <View style={[financialStyles.tableHeaderData, {width: '18%'}]}>
                  <Text style={[financialStyles.boldFont]}>
                    Financials Year
                  </Text>
                </View>
                <View style={financialStyles.tableRightMargin} />

                <View style={[financialStyles.tableHeaderData, {width: '13%'}]}>
                  <Text style={[financialStyles.boldFont]}>File Name</Text>
                </View>
                <View style={financialStyles.tableRightMargin} />

                <View style={[financialStyles.tableHeaderData, {width: '29%'}]}>
                  <Text style={[financialStyles.boldFont]}>Remarks</Text>
                </View>
              </View>

              <View>
                <FlatList
                  data={this.state.tableData}
                  renderItem={({item, index}) => (
                    <Item
                      sno={index+1}
                      financialsStatementType={item.financialStatementType}
                      financialsYear={item.financialYear}
                      fileName={item.fileName}
                      remarks={item.remarks}
                      index={index}
                      length={this.state.tableData.length}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
              </View>
              :null}
            </View>
            <View style={{backgroundColor: Colors.white, width: '27%'}}>
              <DocumentStatus />
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.isStatementModalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
            <TouchableOpacity style={{height:'100%',width:'100%'}}
            onPress={()=>this.handleStatementCancelPress()}
            >
            <View style={financialStyles.modalBackgroundOpacity}></View>
            </TouchableOpacity>
            <View style={[financialStyles.modal]}>
              <ScrollView style={{marginLeft: 50, marginTop: 40, marginRight: 50}}
                           >
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '96%'}}>
                    <Text
                      style={financialStyles.modalHeader}>
                      Upload {financialStatement.statementType} 2020 Financial Statement
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{marginTop: 6}}
                    onPress={() =>
                      this.handleStatementDownArrowPress()
                    }>
                    <ArrowDown />
                  </TouchableOpacity>
                </View>
                {this.state.financialStatement.uploadedStatement.name!=''?
                <TouchableOpacity onPress={()=>this.readPdf(financialStatement.uploadedStatement.uri)}
                style={financialStyles.uploadBottomBorder}>
                <View>
                  <Text style={[styles.signedInputLabel, {marginBottom: 4,fontWeight:"bold",textDecorationLine:"underline"}]}>
                    {financialStatement.uploadedStatement.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={()=>this.handleOnClickCloseStatement()}
                  style={financialStyles.uploadIcon}>
                  <IconClose />
                </TouchableOpacity>
              </TouchableOpacity>:
                <TouchableOpacity onPress={()=>this.handleChoosePdf()}
                  style={financialStyles.uploadBottomBorder}>
                  <View>
                    <Text style={[styles.signedInputLabel, {marginBottom: 4}]}>
                      Upload PDF
                    </Text>
                  </View>
                  <View
                    style={financialStyles.uploadIcon}>
                    <IconUpload />
                  </View>
                </TouchableOpacity>
                }

             {financialStatement.errorMessage==''?null:
              <View>
              <Text style={{color:'#d0021b',fontSize:14,fontFamily:'Helvetica'}}>{financialStatement.errorMessage}</Text>
              </View>}

                <View style={{width: '45%', marginTop: 20}}>
                  <FloatingLabelNameInput
                    label="Add Comments"
                    value={financialStatement.comments}
                    onValueChanged={text =>
                      this.onChangeStatementComments(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{marginTop: 50, flexDirection: 'row'}}>
                  { (financialStatement.uploadedStatement.name=='' && financialStatement.errorMessage=='')?
                <View>
                    <Text style={[styles.btnSubmitDetailsDisable, {marginRight: 0}]}>
                      Upload
                    </Text>
                  </View>:
                  <TouchableOpacity onPress={()=>this.handleStatementUploadButtonPress()}>
                    <Text style={[styles.btnSubmitDetails, {marginRight: 0}]}>
                      Upload
                    </Text>
                  </TouchableOpacity>
                  }
                  <TouchableOpacity
                    onPress={() => this.handleStatementCancelPress()}>
                    <Text style={styles.btnResetDetails}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
        </Modal>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.isSpreadSheetModalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
            <TouchableOpacity style={{height:'100%',width:'100%'}}
            onPress={()=>this.handleSpreadSheetCancelPress()}>
            <View style={financialStyles.modalBackgroundOpacity}></View>
            </TouchableOpacity>
            <View style={[financialStyles.modal]}>
              <ScrollView style={{marginLeft: 50, marginTop: 40, marginRight: 50}}
                          >
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '96%'}}>
                    <Text
                      style={financialStyles.modalHeader}>
                      Upload Financial Spread Sheet
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{marginTop: 6}}
                    onPress={() =>
                      this.handleSpreadSheetDownArrowPress()
                    }>
                    <ArrowDown />
                  </TouchableOpacity>
                </View>
                {financialSpreadSheet.uploadedSpreadSheets[0].name!='' && financialSpreadSheet.uploadedSpreadSheets[1].name!=''?
                <View
                style={financialStyles.uploadBottomBorder}>
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>this.readPdf(financialSpreadSheet.uploadedSpreadSheets[0].uri)}>
                  <Text style={[styles.signedInputLabel, {marginBottom: 4,fontWeight:"bold",textDecorationLine:"underline"}]}>
                    {financialSpreadSheet.uploadedSpreadSheets[0].name}
                  </Text>
                  </TouchableOpacity>
                  <Text> , </Text>
                  <TouchableOpacity onPress={()=>this.readPdf(financialSpreadSheet.uploadedSpreadSheets[1].uri)}>
                  <Text style={[styles.signedInputLabel, {marginBottom: 4,fontWeight:"bold",textDecorationLine:"underline"}]}>
                    {financialSpreadSheet.uploadedSpreadSheets[1].name}
                  </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>this.handleOnClickCloseSpreadSheet()}
                  style={[financialStyles.uploadIcon]}>
                  <IconClose />
                </TouchableOpacity>
              </View> :
                <TouchableOpacity
                onPress={()=>{this.handleChooseExcelAndCsv()}}
                  style={[financialStyles.uploadBottomBorder]}>
                  <View>
                    <Text style={[styles.signedInputLabel, {marginBottom: 4}]}>
                    Upload Excel + CSV File
                    </Text>
                  </View>
                  <View
                    style={financialStyles.uploadIcon}>
                    <IconUpload />
                  </View>
                </TouchableOpacity>}
                {financialSpreadSheet.errorMessage==''?null:
              <View>
              <Text style={{color:'#d0021b',fontSize:14,fontFamily:'Helvetica'}}>{financialSpreadSheet.errorMessage}</Text>
              </View>}

                <View style={{width: '45%', marginTop: 20}}>
                  <FloatingLabelNameInput
                    label="Add Comments"
                    value={this.state.financialSpreadSheet.comments}
                    onValueChanged={text =>
                      this.onChangeSpreadSheetComments(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{marginTop: 50, flexDirection: 'row'}}>
                  {financialSpreadSheet.errorMessage==''&& financialSpreadSheet.uploadedSpreadSheets[0].name!='' && financialSpreadSheet.uploadedSpreadSheets[1].name!=''?
                   <TouchableOpacity onPress={()=>this.handleSpreadSheetUploadButtonPress()}>
                   <Text style={[styles.btnSubmitDetails, {marginRight: 0}]}>
                     Upload
                   </Text>
                 </TouchableOpacity>:
                  <View>
                  <Text style={[styles.btnSubmitDetailsDisable, {marginRight: 0}]}>
                    Upload
                  </Text>
                </View>
                 
                  }
                  <TouchableOpacity
                    onPress={() => this.handleSpreadSheetCancelPress()}>
                    <Text style={styles.btnResetDetails}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
        </Modal>


        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.isAddKeyFiguresModalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
             <TouchableOpacity style={{height:'100%',width:'100%'}}
            onPress={()=>this.handleAddKeyFiguresCancelPress()}>
            <View style={financialStyles.modalBackgroundOpacity}></View>
            </TouchableOpacity>
            <View style={[financialStyles.addKeyFinancialmodal,{height:this.state.financialViewHeight}]}>
              <ScrollView style={{marginLeft: 50, marginTop: 40, marginRight: 50}}
                          >
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '96%'}}>
                    <Text
                      style={financialStyles.modalHeader}>
                      Add Key Financial Figures
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{marginTop: 6}}
                    onPress={() =>
                      this.handleAddKeyFiguresCancelPress()
                    }>
                    <ArrowDown />
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection:"row",marginTop:20}}>
                <View style={{ width: '30%',marginRight:40 }}>
            <Text />
             <Picker
              itemTextStyle={{ color: '#f00' }}
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              selectedValue={keyFinancialFigures.year}
              onValueChange={itemValue =>this.onChangeKeyFinancialYear(itemValue) }
              >
             {this._renderKeyFinancialYears()}
            </Picker>
            <View style={financialStyles.bottomLine}></View>
            </View>

            <View style={{width: '30%',marginTop:10,marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Sales"
                    value={this.state.keyFinancialFigures.sales}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureSales(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{width: '30%',marginTop:10}}>
                  <FloatingLabelNameInput
                    label="Capital"
                    value={this.state.keyFinancialFigures.capital}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureCapital(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>
            </View>

            <View style={{flexDirection:"row",marginTop:30}}>
            <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Unsecured Loan(quasi equity)"
                    value={this.state.keyFinancialFigures.unsecuredLoan}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureUnsecuredLoan(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="PAT"
                    value={this.state.keyFinancialFigures.pat}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigurePat(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{width: '30%'}}>
                  <FloatingLabelNameInput
                    label="Loans and Advances (Non Business)"
                    value={this.state.keyFinancialFigures.loansAndAdvances}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureLoansAndAdvances(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

            </View>

            <View style={{flexDirection:"row",marginTop:30}}>
            <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Debtor more than 6 months"
                    value={this.state.keyFinancialFigures.debtorMoreThan6Months}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureDebtorMoreThanSixMonths(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

                <View style={{width: '30%',marginRight:40}}>
                  <FloatingLabelNameInput
                    label="Debtor less than 6 months"
                    value={this.state.keyFinancialFigures.debtorLessThan6Months}
                    onValueChanged={text =>
                      this.onChangeAddKeyFigureDebtorLessThanSixMonths(text)
                    }
                    blurOnSubmit={false}
                    returnKeyType={'next'}
                    keyboardShouldPersistTaps='always'
                  />
                </View>

            </View>

            {this.renderNameAndAmountArray()}

                <View style={{marginTop: 50, flexDirection: 'row'}}>
                  <TouchableOpacity onPress={()=>this.handleAddKeyFiguresSubmitPress()}>
                    <Text style={[styles.btnSubmitDetails, {marginRight: 0}]}>
                      Submit 
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.handleAddKeyFiguresCancelPress()}>
                    <Text style={styles.btnResetDetails}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
        </Modal>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  financialData: state.financial,
 
}
}
const mapDispatchToProps = dispatch => {
  return {
    updateFinancials: text =>dispatch({type: "UPDATE_FINANCIALS", payload: text}),
  };
};

export default connect( mapStateToProps,mapDispatchToProps)(FinancialsComponent);

const financialStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginRight: 40,
  },
  downloadContainer: {
    backgroundColor: '#ffffff',
    marginRight: 40,
    padding: 27,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e2e3e3',
    borderWidth: 1,
    borderRadius:2,
  },
  uploadStatementContainer: {
    backgroundColor: '#ffffff',
    marginRight: 40,
    marginTop: 10,
    padding: 20,
    borderColor: '#e2e3e3',
    borderWidth: 1,
    borderRadius:2,
  },
  boldFont: {
    fontWeight: 'bold',
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  uploadExcelCsv: {
    color: '#9d1d28',
    fontFamily: 'Helvetica',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight:"bold"
  },
  disableUploadExcelCsv: {
    color: '#9d1d28',
    fontFamily: 'Helvetica',
    fontSize: 14,
    textDecorationLine: 'underline',
    opacity:0.5,
    fontWeight:"bold"
  },
  initiateFinancialAnalysis: {
    width: 200,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  bottomLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1,
  },
  tableHeader: {
    backgroundColor: '#ffffff',
    marginRight: 40,
    marginTop: 10,
    flexDirection: 'row',
    borderColor: '#e2e3e3',
    borderWidth: 1,
    borderTopLeftRadius:2,
    borderTopRightRadius:2
  },
  font: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  tableContentData: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  tableRightMargin: {
    backgroundColor: '#e2e3e3',
    height: '100%',
    width: 1,
  },
  tableHeaderData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft:10
  },
  tableOddContent: {
    flexDirection: 'row',
    borderColor: '#e2e3e3',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#fafafa',
    marginRight: 40,
    flex: 1,
  },
  tableEvenContent: {
    flexDirection: 'row',
    borderColor: '#e2e3e3',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#ffffff',
    marginRight: 40,
    flex: 1,
  },
  modal: {
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    height: 312 + bottomNavBarHeight,
  },
  addKeyFinancialmodal: {
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    //height: 512 + bottomNavBarHeight,
  },
 modalBackgroundOpacity:{
  backgroundColor: 'rgba(0,0,0,0.3)',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  position: 'absolute',
 },
 modalHeader:{
  color: '#58595b',
  fontWeight: 'bold',
  fontFamily: 'Helvetica',
  fontSize: 18,
 },
 uploadBottomBorder:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom: 8,
  borderBottomColor: Colors.darkenGray,
  borderBottomWidth: 1,
  marginTop: 40,
  width: '45%',
 },
 uploadIcon:{
  position: 'absolute',
  bottom: 2,
  right: 0,
  padding: 10,
 },
 editKeyFinancials:{
   backgroundColor:"#ffffff",
   height:50,
   borderColor:'#e2e3e3',
   width:'100%',
   borderRadius:2,
   marginTop: 25,
   borderWidth:1,
   flexDirection:'row',
   alignItems:'center'
  }
});
