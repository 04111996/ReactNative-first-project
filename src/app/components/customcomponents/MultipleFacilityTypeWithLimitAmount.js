import React from 'react';
import { View, TextInput, Animated, StyleSheet,Text,TouchableOpacity } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import RMBusinessPicker from './RMBusinessPicker';
import CurrencyInput from './CurrencyInput';
import FloatingLabelCurrencyInput from './FloatingLabelCurrencyInput';
import IconIncrement from '../../assets/images/icon_plus.svg';
import IconDecrement from '../../assets/images/icon_minus.svg';
import AsyncStorageFunc from "../../utilities/asyncStorage";
import { ASYNCSTORAGE } from "../../constants/AsyncStorage/asyncStorageConstants";

class MultipleFacilityType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        facilityTypeCollection:[],
        facilityOptions:[],
        selectedDynamicFacilityCollectionValues:[]
    };

  }
  componentDidMount() {
    AsyncStorageFunc.getData(ASYNCSTORAGE.API_CONFIG).then(res => {
      //  console.log(res.configuration.industries, "response industries");
      this.setState({
        facilityTypeCollection: [{
          industryCode: "0",
          industryDescription: "Source of Lead"
        }, ...res.configuration.industries],
      })

    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    // console.log('this.state.dynamicFacilityCollection.length',this.props.dynamicFacilityCollection)
    return (
        <View style={{  flexDirection:'row',width:'100%',justifyContent:'space-between', alignItems:'flex-start',marginLeft:5,marginTop:20}}>
            <View style={{width:'50%'}}>
                <View style={[styles.selectWidget],{}}>
                    <Text style={{color:Colors.text,position:'relative',top:15,left:5,fontSize:11,color:'#9c9ea0'}}> Facility Type</Text>
                    <RMBusinessPicker 
                    selectedValue={this.props.facilityTypeSelectedValue}
                        //onValueChange={(index, value) => this.props.onValueChange(index, value)}
                        onValueChange={(value) => {
                            console.log('My cahcnaged val :', this.props.compIndex, value);
                            this.setState({facilityTypeList:value})
                            //this.props.onValueChange(this.props.compIndex, value)
                        }}
                        facilityTypeList={this.props.facilityTypeList}
                        style={{height:30,position:'relative',top:15}}
                    />
                    <Text style={styles.dropDownBorder}></Text>
                </View>
            </View>
        
          <View style={{width:'49%',alignSelf:'flex-start',marginTop:6}}>
             <FloatingLabelCurrencyInput
                keyboardType="numeric"
                label="Limit Amount"
                value={this.state.limitAmount}
                formHandle={text =>{
                  this.setState({limitAmount:text})
                  console.log('My changed CurrencyInput :', this.props.compIndex, text);
                //  this.props.formHandle(text)
                }}
            />
            
        </View>

        {/* <View style={{alignSelf:'flex-end'}}>
          <View style={{flexDirection:'row',position:'relative',bottom:10}}>
            <View style={{marginHorizontal:15}}>
              {this.state.facilityTypeCollection.length > 1 ? <IconDecrement style={{opacity:0.5}} />
              :
              <TouchableOpacity 
              onPress={()=>this.props.onDecrementProperty(this.props.compIndex)}>
                <IconDecrement />
            </TouchableOpacity>
              }
            </View>
            <View>
              <TouchableOpacity 
                onPress={()=>this.props.onIncrementProperty(this.props.compIndex)}>
                  <IconIncrement />
              </TouchableOpacity>
            </View>
          </View>
        </View> */}
      </View>
    );
  }
}

export default MultipleFacilityType;

const styles = StyleSheet.create({
 dropDownBorder:{
  width:'90%',
  borderBottomColor:Colors.darkGray,
  borderBottomWidth:0.5,
  marginLeft:10,
 }

});
