import {combineReducers} from 'redux';
import NetworkStatusReducer from './NetworkStatusReducer';
import AddCaseReducer from './AddCaseReducer';
import KycBureauReducer from './KycBureauReducer';
import KycBureauObservationsReducer from './KycBureauObservationsReducer';
import BankStatementReducer from './BankStatementReducer'
import ReferenceReducer from './ReferenceReducer'
import QCAReducer from './QCAReducer';
import FinancialReducer from './FinancialReducer'

const RootReducer = combineReducers({
  addCase: AddCaseReducer,
  networkStatus: NetworkStatusReducer,
  kycBureau:KycBureauReducer,
  kycBureauObservations:KycBureauObservationsReducer,
  bankStatement:BankStatementReducer,
  referenceReducer:ReferenceReducer,
  addQCA: QCAReducer,
  financial:FinancialReducer
});

export default RootReducer;
