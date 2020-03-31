import React, {Component} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Radio} from 'native-base';
import Colors from '../../styles/Colors';
import refStyle from './ReferencesComponentStlye';
import NameInput from '../customcomponents/NameInput';
import IconAddress from '../../assets/images/icon_address.svg'; //'../../../../assets/images/icon_address.svg';
import {connect} from 'react-redux';
import {CHAR_LIMIT_FOR_NAME_FIELD} from '../../constants/AddCase/AddCaseConstants';
import Fonts from '../../styles/Fonts';
import PhoneNumberInput from '../customcomponents/PhoneNumberInput';
import ReferencesServices from '../../Database/Services/References/ReferencesServices';

class ReferencesItemComponent extends Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      entityName: '',
      contactPerson: '',
      contactNumber: '',
      designation: '',
      city: '',
      remarks: '',
      contacted: 'No',
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  componentDidMount() {
    const {
      entityName,
      contactPerson,
      contactNumber,
      designation,
      city,
      remarks,
    } = this.props.item;
    this.setState({
      ...this.state,
      entityName,
      contactPerson,
      contactNumber,
      designation,
      city,
      remarks,
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.layoutHeight !== nextState.layoutHeight) {
  //     return true;
  //   }
  //   return false;
  // }
  onSaveDetails() {
    //;
    let rs = new ReferencesServices();
    let data = {
      entityName: this.state.entityName,
      contactPerson: this.state.contactPerson,
      contactNumber: parseInt(this.state.contactNumber),
      designation: this.state.designation,
      city: this.state.city,
      remarks: this.state.remarks,
      id:this.props.item.id
    };
    rs.updateReferenceById(data).then(res=>console.log("Update"))
    this.props.onClickFunction(this.props.key)
    console.log(this.props)
    this.props.updateParent()
  };
  render() {
    const {
      entityName,
      contactPerson,
      contactNumber,
      designation,
      city,
      remarks,
    } = this.props.item;

    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>this.props.onClickFunction(this.props.key)}
          style={refStyle.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{}}>
              <Text style={refStyle.refHeaderName}>Reference Name</Text>
              <Text style={refStyle.refHeaderValue}>{entityName}</Text>
            </View>
            <View style={{}}>
              <Text style={refStyle.refHeaderName}>% of total credit txns</Text>
              <Text style={refStyle.refHeaderValue}>Nil</Text>
            </View>
            <View style={{}}>
              <Text style={refStyle.refHeaderName}>Source</Text>
              <Text style={refStyle.refHeaderValue}>RM</Text>
            </View>
            <View style={{}}>
              <Text style={refStyle.refHeaderName}>Reference Type</Text>
              <Text style={refStyle.refHeaderValue}>Other Market Reference</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
            //  marginTop:10
          }}>
          <View style={refStyle.editView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: -20,
              }}>
              <View style={{width: '48%'}}>
                <NameInput
                  label="Entity Name"
                  value={this.state.entityName}
                  onValueChanged={text => this.setState({entityName: text})}
                  returnKeyType={'next'}
                  autoFocus={false}
                  // onSubmitEditing={event => {
                  //   this._inputRef._root.focus();
                  // }}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
              <View style={{width: '48%'}}>
                <NameInput
                  label="Contact Person"
                  value={this.state.contactPerson}
                  onValueChanged={text => this.setState({contactPerson: text})}
                  returnKeyType={'next'}
                  autoFocus={false}
                  // onSubmitEditing={event => {
                  //   this._inputRef._root.focus();
                  // }}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {/* <Form> */}
              <View style={{width: '48%'}}>
                <PhoneNumberInput
                  label="Contact Number"
                  value={""+this.state.contactNumber}
                  onValueChanged={text => this.setState({contactNumber: text})}
                  returnKeyType={'next'}
                  autoFocus={false}
                  // onSubmitEditing={event => {
                  //   this._inputRef._root.focus();
                  // }}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
              <View style={{width: '48%'}}>
                <NameInput
                  label="Designation"
                  value={this.state.designation}
                  onValueChanged={text => this.setState({designation: text})}
                  returnKeyType={'next'}
                  autoFocus={false}
                  // onSubmitEditing={event => {
                  //   this._inputRef._root.focus();
                  // }}
                  maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
                />
              </View>
            </View>
            <View style={{}}>
              <NameInput
                label="City"
                value={this.state.city}
                onValueChanged={text =>
                  this.setState({
                    city: text,
                  })
                }
                returnKeyType={'next'}
                autoFocus={false}
                // onSubmitEditing={event => {
                //   this._inputRef._root.focus();
                // }}
                maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
              />
            </View>
            <View style={{}}>
              <NameInput
                label="Remarks"
                value={this.state.remarks}
                onValueChanged={text =>
                  this.setState({
                    remarks: text,
                  })
                }
                returnKeyType={'next'}
                autoFocus={false}
                // onSubmitEditing={event => {
                //   this._inputRef._root.focus();
                // }}
                maxLength={CHAR_LIMIT_FOR_NAME_FIELD}
              />
            </View>
            <View style={{marginHorizontal: 15, marginVertical: 20}}>
              <Text
                style={{
                  color: Colors.darkenGray,
                  fontSize: 11,
                  fontFamily: 'Helvetica',
                  marginLeft: 0,
                  marginBottom: 5,
                  marginTop: 0,
                }}>
                Contacted
              </Text>
              <View style={refStyle.radioContainer}>
                <View style={refStyle.radioWidget}>
                  {this.state.contacted == 'Yes' ? (
                    <Radio
                      style={refStyle.radioButton}
                      color={'#58595b'}
                      selected={true}
                      selectedColor={'#9d1d28'}
                      onPress={() => this.setState({contacted: 'Yes'})}
                    />
                  ) : (
                    <Radio
                      style={refStyle.radioButton}
                      color={'#58595b'}
                      selected={false}
                      onPress={() => this.setState({contacted: 'Yes'})}
                      selectedColor={'#9d1d28'}
                    />
                  )}

                  <Text style={refStyle.radioLabel}>Yes</Text>
                </View>
                <View style={refStyle.radioWidget}>
                  {this.state.contacted == 'No' ? (
                    <Radio
                      style={refStyle.radioButton}
                      color={'#58595b'}
                      selected={true}
                      selectedColor={'#9d1d28'}
                      onPress={() => this.setState({contacted: 'No'})}
                    />
                  ) : (
                    <Radio
                      style={refStyle.radioButton}
                      color={'#58595b'}
                      selected={false}
                      onPress={() => this.setState({contacted: 'No'})}
                      selectedColor={'#9d1d28'}
                    />
                  )}

                  <Text style={refStyle.radioLabel}>No</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 12,
                marginBottom: 30,
              }}>
              <TouchableOpacity onPress={()=>this.onSaveDetails()}>
                <View>
                  <Text style={refStyle.btnSaveDetails}> Save Details</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.props.onClickFunction(this.props.key)}>
                <Text style={[refStyle.btnWithBorder, {marginLeft: 20}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}></View>
          </View>
          {/*Content under the header of the Expandable List Item*/}
          {/* {this.props.item.subcategory.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() => alert('Id: ' + item.id + ' val: ' + item.val)}>
              <Text style={styles.text}>
                {key}. {item.val}
              </Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))} */}
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    referenceData: state.referenceReducer.referenceData,
    isUpdated: state.referenceReducer.isUpdated,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onbankReferenceDataUpdate: text =>
      dispatch({ type: 'REFERENCE_DATA', payload: text }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReferencesItemComponent);
