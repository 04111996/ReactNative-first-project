
class DocumentFeedback {
    constructor() {
        // super();
    }
    feedback = (payloadState) => {
        const GET_DOCUMENT_FEEDBACK_BY_ID = {
           id:payloadState
        }
        return GET_DOCUMENT_FEEDBACK_BY_ID;
    }


}

const DocFeedbackObj = new DocumentFeedback()
export default DocFeedbackObj;