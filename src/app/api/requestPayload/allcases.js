const state = {
    empId: 12
}

class AllCases {
    constructor() {
        // super();
    }
    cases = (payloadState) => {

        const GET_ALL_CASES = {
            empId: state.empId
        }
        return GET_ALL_CASES;
    }


}

const GetAllCasesObj = new AllCases()
export default GetAllCasesObj;