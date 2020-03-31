const StatusNames ={
    "ADDITIONAL_VALIDATION" :"AdditionalValidation",
    "ERROR":"Error",
    "REJECT":"REJECT",
    "RETRY":"RETRY",
    "IN_PROGRESS":"Inprogress",
    "IN_PROGRESS_":"IN PROGRESS",
    "NOT_ADDED":"NotAdded",
    "COMPLETED":"Completed",
    "ADDED":"Added",
    "FAILED":"FAILED"
}
const TabNames ={
    "GUARANTOR" :"guarantor",
    "APPLICANT":"applicant",
    "SISTER_CONCERN":"sisterconcern",
}
const CardStatus =new Object();
CardStatus[StatusNames["ADDITIONAL_VALIDATION"]] ="Additional Validation Required";
CardStatus[StatusNames["ERROR"]]="Retrigger Required";
CardStatus[StatusNames["IN_PROGRESS"]] = "In Progress";
CardStatus[StatusNames["NOT_ADDED"]] = "Not Added";
CardStatus[StatusNames["COMPLETED"]] = "Completed";
CardStatus[StatusNames["ADDED"]] = "Added";

const StatusMessage =new Object();
StatusMessage["applicant_isDataSubmittedToServer_1"] = "Applicant Details submitted"
StatusMessage["applicant_Status_AdditionalValidation"]="Applicant Additional Validation required";
StatusMessage["applicant_Status_Completed"]="Applicant Completed";

StatusMessage["applicant_Status_Error"]="Applicant Details Failed";
StatusMessage["applicant_additionalValidation_AdditionalValidation"]="Applicant Additional Validation required";
StatusMessage["applicant_Status_Inprogress"]="Applicant In progress";
StatusMessage["applicant_signedConsentFormStatus_0"] ="Sign Consent Failed";
StatusMessage["applicant_signedConsentFormStatus_1"] ="Sign Consent Completed";
StatusMessage["applicant_crnGenerationStatus_IN PROGRESS"] ="CRN Generation in progress";
StatusMessage["applicant_crnGenerationStatus_APPROVE"] ="CRN Generation successful";
StatusMessage["applicant_crnGenerationStatus_REJECT"] ="crnGenerationErrorMessage";
StatusMessage["applicant_crnGenerationStatus_RETRY"] ="crnGenerationErrorMessage";
StatusMessage['guarantor'] = "Guarantor";
StatusMessage["guarantor_isDataSubmittedToServer_1"] = "Submitted"
StatusMessage["guarantor_additionalValidation_AdditionalValidation"] ="Guarantor Additional Validation Required.";
StatusMessage["guarantor_Status_AdditionalValidation"]="Guarantor Additional Validation required";
StatusMessage["guarantor_Status_Inprogress"]="Guarantor In progress";
StatusMessage["guarantor_Status_Error"]="Guarantor Details Failed";
StatusMessage["guarantor_Status_Completed"] ="Guarantor Completed";

StatusMessage["guarantor_crnGenerationStatus_IN PROGRESS"] ="CRN Generation in progress";
StatusMessage["guarantor_crnGenerationStatus_APPROVE"] ="CRN Generation successful";
StatusMessage["guarantor_crnGenerationStatus_REJECT"] ="crnGenerationErrorMessage";
StatusMessage["guarantor_crnGenerationStatus_RETRY"] ="crnGenerationErrorMessage";
StatusMessage["guarantor_bureauStatus_IN PROGRESS"] ="Consumer Bureau initiated Successfully";
StatusMessage["guarantor_bureauStatus_SUCCESS"] ="Consumer Bureau response received";
StatusMessage["guarantor_bureauStatus_FAILED"] ="bureauErrorMessage";
StatusMessage['bank'] = "Account";
StatusMessage["bank_isDataSubmittedToServer_1"]="Submitted"
StatusMessage["bank_bankStatementStatus_SUCCESS"] = "Perfios Response received successfully"
StatusMessage["bank_bankStatementStatus_FAILED"] = "bankStatementErrorMessage"
StatusMessage["bank_bankStatementStatus_IN PROGRESS"] = "Perfios initiated successfully"
StatusMessage["bank_contentVersionStatus_SUCCESS"] = "File Uploaded Success"
StatusMessage["bank_contentVersionStatus_IN PROGRESS"] = "File In progress"
StatusMessage["bank_contentVersionStatus_FAILED"] = "contentVersionErrorMessage"
StatusMessage["bsa_bsaStatus_Completed"] ="BSA Response received successfully"
StatusMessage["bsa_bsaStatus_Inprogress"] ="Statement sent for Analysis"
StatusMessage["bsa_bsaStatus_FAILED"] ="errorMessage"
StatusMessage["bank_additionalValidation_AdditionalValidation"] ="Additional validation available for BSA"
export {StatusNames , CardStatus , StatusMessage ,TabNames} ;