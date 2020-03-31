import React from 'react';

import { createAppContainer } from 'react-navigation';
import {
  Animated,
  Easing,
  Platform
} from 'react-native'
import { createKycSidebarNavigator } from '../tabs';
import { KycBureau } from '../components/kycBureau';
import { GSTN } from '../components/GSTN';
import { ITR } from '../components/ITR';
import { QCA } from '../components/QCA';
import {Financials} from "../components/Financials"
import { References } from '../components/References';
import {VintageProof} from '../components/VintageProof';
import BankStatements from '../components/bankstatements/bankStatementsComponent'
import EditCaseDetails from '../components/dashboard/myCaseFiles/EditCase/EditCaseDetails';

const KycSidebarNavigator = createKycSidebarNavigator(
  {
    CaseDetails: {
      screen: EditCaseDetails,
      params: {
        tabName: 'Case Details',
      }
    },
    KycBureau: {
      screen: KycBureau,
      params: {
        tabName: 'KYC & Bureau',
      },
    },

    BankStatement: {
      screen: BankStatements,
      params: {
        tabName: 'Bank Statement',
      }
    },
    GSTN: {
      screen: GSTN,
      params: {
        tabName: 'GSTN',
      }
    },
    ITR : {
      screen: ITR,
      params: {
        tabName: 'ITR',
      }
    },
    QCA : {
      screen: QCA,
      params: {
        tabName: 'QCA',
      }
    },
    Financials : {
      screen: Financials,
          params: {
              tabName: 'Financials',
          }
    },
    References : {
      screen: References,
        params: {
          tabName: 'References',
        }
    },
    VintageProof : {
      screen: VintageProof,
      params: {
          tabName: 'Vintage Proof',
      }
    }
  },

  {
    initialRouteName: 'KycBureau',
  },

  {

  }


);

export default KycSidebarNavigator;
//export default createAppContainer(sidebarNavigator);
