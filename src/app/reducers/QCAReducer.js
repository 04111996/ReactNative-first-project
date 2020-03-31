import AsyncStorageFunc from "../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../constants/AsyncStorage/asyncStorageConstants";

let qcaFormat = {
  // id: 0,
  questionId: 0,
  answerId: 0,
  answerValue: '',
  comments: '',
}
var qcaData = {
  qca: [],
  isModified: false,
  isUpdated: false,
};

var intialState = {
  isSuccess: false,
  qcaData: qcaData,
  isReseted: true,
};

export default function QCAReducer(state = intialState, action) {
    console.log('QCAReducer ', state)
  switch (action.type) {
    case 'QCA_DATA_UPDATE':
      // console.log("action for QCA_DATA_UPDATE ", action)

      return {
        ...state,
        // qcaData:action.payload,
        qcaData:action.payload, //qcaData.qca.splice(action.payload.questionIndex, 1, action.payload),
        isReseted: false,
      };

    case 'QCA_RESET_DATA':
    // console.log('QCA_RESET_DATA', state)
      return {
        ...state,
        qcaData: qcaData,
        isReseted: true,
        isSuccess: false,
      };
    
    case 'SUBMIT_BUTTON_STATUS_UPDATE': 
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
          var loanPrograms = res.configuration.loanPrograms

          for(let i=0; i<loanPrograms.length; i++){
            if(loanPrograms[i].programId == global.currentCaseIdentifiers.selectedProgramId) {
                let questionsArray = loanPrograms[i].QcaQuestions
                debugger;
                let answeredArrayLength = state.qcaData.qca.length-1;
                if (questionsArray.length == answeredArrayLength ){
                  return { ...state, isSuccess: true };
                }
                else return { ...state, isSuccess: false };

            }
        }  

    }).catch(err => {
      console.log(err);
    })
    
    

    default:
      return state;
  }
}
