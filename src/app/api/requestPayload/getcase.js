const state = {
    empId: 12,
    sfdcId: 'sfdc123'
}

class CaseById {
    constructor() {
        // super();
    }
    cases = (payloadState) => {

        const GET_CASE_BY_ID = {
            empId: state.empId,
            sfdcId: state.sfdcId
        }
        return GET_CASE_BY_ID;
    }


}

const CaseByIdObj = new CaseById()
export default CaseByIdObj;