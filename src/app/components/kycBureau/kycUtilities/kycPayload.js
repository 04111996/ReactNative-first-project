import React, {Component} from 'react';
import asyncStorageFunc from '../../../utilities/asyncStorage';
import {ASYNCSTORAGE} from '../../../constants/AsyncStorage/asyncStorageConstants';
import RNFS from 'react-native-fs';

// function ReactHeader(props) {
//     return (
//       <h1>
//         React {props.version || 16} Documentation
//       </h1>
//     )
//   }

const getFormattedApplicantDetailsAPI = async ({applicantDetailsData}) => {
  // let {applicantDetailsData} = this.props;
  let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
  console.log('empId 111', empId);
  console.log('applicantDetailsData 123', applicantDetailsData);
  console.log(
    'this.state.signedConsentForm.uri',
    applicantDetailsData.signedConsentForm.uri,
  );
  return RNFS.readFile(
    applicantDetailsData.signedConsentForm.uri,
    'base64',
  ).then(res => {
    let foramttedApplicantDetailsObj = {
      empId: empId,
      applicantId: '',
      sfdcId: global.sfdcId,
      dateOfIncorporation: applicantDetailsData.dateOfIncorporation,
      name: applicantDetailsData.applicantName,
      isaPropertyOwner: applicantDetailsData.isaPropertyOwner,
      contactNumber: applicantDetailsData.contactNumber,
      pan: applicantDetailsData.panCard,
      address: {
        houseNumber: applicantDetailsData.address.houseNumber,
        houseDetails: applicantDetailsData.address.houseDetails,
        streetName: applicantDetailsData.address.streetName,
        city: applicantDetailsData.address.city,
        state: applicantDetailsData.address.state,
        latitude: applicantDetailsData.address.latitude,
        longitude: applicantDetailsData.address.longitude,
        pincode: applicantDetailsData.address.pinCode,
      },
      signedConsentForm: {
        docTypeId: 500001,
        docName: 'Application Form AND KYC',
        data: res,
      },
    };
    console.log(res);
    var sizeInBytes = 4 * Math.ceil(res.length / 3) * 0.5624896334383812;
    var sizeInKb = sizeInBytes / 1000;
    console.log('res size', sizeInKb);
    console.log('foramttedApplicantDetailsObj', foramttedApplicantDetailsObj);
    return foramttedApplicantDetailsObj;
  });
};
const getFormattedGuarantorDetailsAPI = async ({guarantorDetailsData}) => {
  // let {guarantorDetailsData} = this.props;
  let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
  console.log('empId 111', empId);
  console.log('guarantorDetailsData 111', guarantorDetailsData);
  console.log(
    'guarantorDetailsData 111',
    guarantorDetailsData.guarantorsDetails,
  );
  // if (guarantorDetailsData.guarantorDetails >1 );
  let foramttedGuarantorsDetail = [];
  guarantorDetailsData.guarantorsDetails.map(item => {
    console.log('item 111', item);
    let guarantorDetailsFormattedData = {
      guatantorUniqueId: item.guatantorUniqueId,
      guarantorId: item.guarantorId,
      guarantorName: item.name,
      gender: item.gender,
      isaPropertyOwner: item.isaPropertyOwner,
      contactNumber: item.contactNumber,
      pan: item.panCard,
      guarantorAddress: {
        houseNumber: item.address.houseNumber,
        houseDetails: item.address.houseDetails,
        streetName: item.address.streetName,
        city: item.address.city,
        state: item.address.state,
        latitude: item.address.latitude,
        longitude: item.address.longitude,
        pincode: item.address.pinCode,
      },
      signedConsentFormStatus: item.hasSignedConsentForm,
      dateOfBirth: item.dateOfBirth,
    };
    foramttedGuarantorsDetail.push(guarantorDetailsFormattedData);
  });
  let foramttedGuarantorsDetailObj = {
    sfdcId: global.sfdcId,
    empId: empId,
    listOfguarantors: foramttedGuarantorsDetail,
  };
  return foramttedGuarantorsDetailObj;
};

const getFormattedSisterConcernDetailsAPI = async ({
  sisterConcernCollection,
}) => {
  // let { sisterConcernCollection } = this.props;
  let empId = await asyncStorageFunc.getData(ASYNCSTORAGE.EMPLOYEE_ID);
  console.log(
    'sisterConcernCollection 111',
    sisterConcernCollection.sisterConcerns,
  );
  let formattedSisterConcernDetail = [];
  sisterConcernCollection.sisterConcerns.map(item => {
    console.log('item 111', item);
    let sisterConcernDetailsFormattedData = {
      sisterConcernUniqueId: item.sisterConcernUniqueId || '',
      sisterConcernId: item.sisterConcernId || '',
      sisterConcern: item.name,
    };
    formattedSisterConcernDetail.push(sisterConcernDetailsFormattedData);
  });
  let foramttedSisterConcernDetailObj = {
    empId: empId,
    sfdcId: global.sfdcId,
    listOfSisterConcerns: formattedSisterConcernDetail,
  };
  return foramttedSisterConcernDetailObj;
};
const getFormattedRelatedIndividualsDetailsAPI =  relatedIndividualsData => {
  // let {guarantorDetailsData} = this.props;
  console.log('relatedIndividualsData 555', relatedIndividualsData);
  
  let foramttedRelatedIndividuals = [];
  // relatedIndividualsData.map(item => {
    let relatedIndividualsFormattedData = {
      relatedIndividualUniqueId: relatedIndividualsData.relatedExistenceUniqueId,
      relatedIndividualId: relatedIndividualsData.relatedExistenceId,
      name: relatedIndividualsData.name,
      email: relatedIndividualsData.email,
      gender: relatedIndividualsData.gender,
      contactNumber: relatedIndividualsData.contactNumber,
      contactNumber: relatedIndividualsData.contactNumber,
      dateOfBirth: relatedIndividualsData.dateOfBirth,
      isPropertyOwner: relatedIndividualsData.isPropertyOwner,
      isPromoter: relatedIndividualsData.isPromoter,
      isGuarantor: relatedIndividualsData.isGuarantor,
      isGroup: relatedIndividualsData.isGroup,
      propertyOwner: {
        "relationshipId": relatedIndividualsData.relationshipId,
        "relatedWith": relatedIndividualsData.relatedWith,
        "otherRelation": relatedIndividualsData.otherRelation,
      },
      promoter: {
        "shareholding": relatedIndividualsData.shareholding,
        "qualification": relatedIndividualsData.qualification,
        "role": relatedIndividualsData.role,
        "experience": relatedIndividualsData.experience,
        "associatedSince": relatedIndividualsData.associatedSince,
        "remark": relatedIndividualsData.remark,
      },
      group: {
        limitDetails: {
          existingBbgLimit: relatedIndividualsData.existingBbgLimit,
          proposedBbgLimit: relatedIndividualsData.proposedBbgLimit,
          limitTaggedAsGroup: relatedIndividualsData.limitTaggedAsGroup,
        },
      },
      guarantor	:	{
        pan	:	relatedIndividualsData.pan,
        voterId	:	relatedIndividualsData.voterId,
        drivingLiscense	:	relatedIndividualsData.drivingLiscense,
        netWorth	:	relatedIndividualsData.netWorth,
        consentGivenForBureau	:	relatedIndividualsData.consentGivenForBureau,
        address:{
          houseNumber: relatedIndividualsData.address.houseNumber,
          houseDetails:relatedIndividualsData.address.houseDetails,
          streetName: relatedIndividualsData.address.streetName,
          city: relatedIndividualsData.address.city,
          state: relatedIndividualsData.address.state,
          latitude: relatedIndividualsData.address.latitude,
          longitude: relatedIndividualsData.address.longitude,
          pincode: relatedIndividualsData.address.pinCode,
        }
      },
    };
    console.log("payload obj"+JSON.stringify(relatedIndividualsFormattedData))
    foramttedRelatedIndividuals.push(relatedIndividualsFormattedData);
  // });
  let foramttedRelatedIndividualsObj = {
    sfdcId: global.sfdcId,
    loanNumber: '',
    listOfRelatedIdividuals: foramttedRelatedIndividuals,
  };
  return foramttedRelatedIndividualsObj;
};
export {
  getFormattedApplicantDetailsAPI,
  getFormattedGuarantorDetailsAPI,
  getFormattedSisterConcernDetailsAPI,
  getFormattedRelatedIndividualsDetailsAPI
};
