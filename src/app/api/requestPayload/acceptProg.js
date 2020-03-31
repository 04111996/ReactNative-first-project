const state = {
    sfdcId: 'sfdx123',
    selectedPlanId: 'Plan1'
}

class AcceptProg {
    constructor() {
        // super();
    }
    acceptProgReqObj = (payloadState) => {

        const ACCEPT_PROGRAM = {
            sfdcId: state.sfdcId,
            selectedPlanId: state.selectedPlanId
        }
        return ACCEPT_PROGRAM;
    }


}

const AcceptProgObj = new AcceptProg()
export default AcceptProgObj;