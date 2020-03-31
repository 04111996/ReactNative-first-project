import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  FlatList,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import AddCaseSidebarNavigator from '../../../../navigation/AddCaseLeftNavigation'
import CaseService from '../../../../Database/Services/CaseDetails/CaseService';
import IconCloseSideNav from '../../../../assets/images/icon_close_sidenav.svg';
import IconAddNote from '../../../../assets/images/icon_add_note.svg';
import { ScrollView } from 'react-native-gesture-handler';
import { CASE_CONSTANTS, CASE_CONSTANTS_STATUS } from "../../../../constants/CaseConstants/caseConstants";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height - StatusBar.currentHeight; //full height

class AddCaseScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  onClickClose = () => {
    let { entityData, financialsData, collateralData, existingLimitData, businessData, collateralsAddLaterData } = this.props
    console.log('onClickClose addcase', collateralData)
    // this.props.onReset()
    if (entityData.entityName.lenght <= 0 || entityData.entityName == 'null' || entityData.entityName == '') {
      // alert('i8f')
      const caseServiceObj = new CaseService();
      caseServiceObj.deleteCase(global.currentCaseIdentifiers.caseId).then((caseIdentifier) => {
        // alert('i8fin')
        this.props.navigation.navigate('HomeScreen')
      })
    } else {
      // alert('i8felse')
      let { entityData, financialsData, collateralData, existingLimitData, businessData, noteData, collateralsAddLaterData } = this.props
      let entity = {
        ...entityData,
        entityId: global.currentCaseIdentifiers.entityId,
      };
      let financial = {
        ...financialsData
      };
      let collateral = {
        ...collateralData
      };
      let existingLimit = {
        ...existingLimitData
      };
      let business = {
        ...businessData
      };
      let cases = {
        caseId: global.currentCaseIdentifiers.caseId,
        isModified: true, // noteData.isModified || collateralsAddLaterData.isModified,
        stage: CASE_CONSTANTS.IN_PROGRESS,
      };
      const caseServiceObj = new CaseService();
      caseServiceObj.updateAllCaseTables(entity, financial, collateral, existingLimit, business, cases).then(() => {
        this.props.onReset()
        this.props.navigation.navigate('HomeScreen')
      })
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    this.onClickClose(); // works best when the goBack is async
    this.props.onReset()
    return true;
  }

  render() {
    return (
      <View style={styles.Container}>
        <ScrollView>
          <View style={{ height: height }}>
            <AddCaseSidebarNavigator />
          </View>
          <View style={styles.navigationContainer}>
            <View style={styles.closeArrow}>
              <TouchableOpacity onPress={this.onClickClose}>
                <IconCloseSideNav />
              </TouchableOpacity>
            </View>
            <View style={styles.addNote}>
              <TouchableOpacity >
                <View style={styles.addNoteContainer}>
                  <IconAddNote />
                  <Text style={styles.addNoteText}>Add Notes</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  entityData: state.addCase.entityData,
  financialsData: state.addCase.financialsData,
  collateralData: state.addCase.collateralData,
  collateralsAddLaterData: state.addCase.collateralsAddLaterData,
  existingLimitData: state.addCase.existingLimitData,
  businessData: state.addCase.businessData,
  noteData: state.addCase.noteData,
})
const mapDispatchToProps = dispatch => {
  return {
    onReset: () => dispatch({ type: 'RESET_DATA' })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCaseScreen);

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    height: height,
    width: width / 6.2
  },
  Container: {
    flex: 1,
  },
  closeArrow: {
    paddingVertical: 40,
    alignSelf: 'center',
  },
  addNote: {
    position: 'absolute',
    bottom: 40,
    left: 25
  },
  addNoteText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: "Helvetica",
  },
  icClose: {
    height: 40,
    width: 40
  },
  addNoteContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
