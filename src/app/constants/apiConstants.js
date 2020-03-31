
// export const BASEURL = 'http://192.168.120.205:8000/'; //local ip
// export const BASEURL = 'http://192.168.120.80:8080'; //host
export const BASEURL = 'http://111.93.245.157:8023'; //public_host
//export const BASEURL = 'http://192.168.120.80:8088'; //public_host dev
// export const BASEURL = 'http://192.168.120.80:8080'; //Temparary IP

// export const BASEURL = 'http://192.168.120.80:8087'; //techjini_host


// const BASEURL='192.168.120.88:8888/clinical_portal/api/v1';
// if (process.env.NODE_ENV === 'production') {
//     BASEURL = '/clinical_portal/api/v1'
// }

// console.log(process.env.PUBLIC_URL);

export const APIURL = {
    GET_USERS: `${BASEURL}/user_list`,
    UPDATE_USER: `${BASEURL}/update_user`,
    CONFIG: `${BASEURL}/config`,
    GET_ROLES: `${BASEURL}/list_user_role`,
    GET_ROLE_LIST_ON_CATEGORY: `${BASEURL}/list_user_role`,
    NEW_CASE: `${BASEURL}/processLoan/case`,
    ACCEPT_PROGRAM: '/acceptProgram',
    DECLINE_PROGRAM: '/declineProgram',
    GET_APPLICANT_KYC_INFO: `${BASEURL}/processLoan/applicantKycInfo`,
    GET_APPLICANT_GUARANTOR_INFO: `${BASEURL}/processLoan/applicantGuarantorInfo`,
    GET_APPLICANT_BANK_STATEMENT: `${BASEURL}/processLoan/applicantBankStatement`,
    GET_APPLICANT_SISTER_CONERNS: `${BASEURL}/processLoan/applicantSisterConcern`,
    GET_KYC_BUREAU_OBSERVATION: `${BASEURL}/processLoan/kycBureauObservation`,
    POST_BSA_QUESTIONNAIRE: `${BASEURL}/processLoan/bankQuestionnaire`,
    GET_ALL_CASES: `${BASEURL}/processLoan/allCases`,
    POST_APPLICANT_RELATED_INDIVIDUALS_INFO: `${BASEURL}/processLoan/relatedIndividuals`,
    // GET_ALL_CASES: 'http://www.mocky.io/v2/5dc2af132f000069004be2e7',
    GET_CASE: '/case',
    GET_APPLICANT: '/applicant',
    GET_GUARANTOR_LIST: '/guarantorList',
    GET_SISTER_CONCERNS: '/sisterConcerns',
    GET_BANK_DETAILS: '/bankDetails',
    GET_CASE_DOC_INFO: '/caseDocumentInformation',
    GET_DOC_FEEDBACK: 'processLoan/documentFeedback',
    GET_DOCUMMENT_FEEDBACK: `${BASEURL}/processLoan/documentFeedback`,
    GET_BANK_STATEMENT_CLARIFICATION: '/bankStatementClarification',
    GET_KYC_BUREAU_CLARIFICATION: '/kycBureauClarification',
    GET_FLASH_CONFIG: '/flashConfig',
    LOGIN: `${BASEURL}/login`,
    SUBMIT_CASE: `${BASEURL}/processLoan/case`,
    SUBMIT_PROGRAM_SELECTION: `${BASEURL}/processLoan/acceptProgram`,
    DECLINE_CASE: `${BASEURL}/processLoan/declineProgram`,
    POST_BANK_QUESTIONNAIRE: `${BASEURL}/bankQuestionnaire`,
    GET_KYC_STATUS: `${BASEURL}/processLoan/kycStatus`,
    GET_BANK_STATUS: `${BASEURL}/processLoan/bankStatus`,
    GET_REFERENCES:`${BASEURL}/allReferences`,
    POST_REFERENCES:`${BASEURL}/references`

}
