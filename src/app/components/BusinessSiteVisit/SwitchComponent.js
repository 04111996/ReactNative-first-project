import React from 'react';
//import react in our code. 
import Colors from '../../styles/Colors';

import { Switch, Text, View, StyleSheet } from 'react-native';
//import all the components we are going to use. 
export default class SwitchComponent extends React.Component {
  //Initial state false for the switch. You can change it to true just to see.
  state = {switchValue:false}
  toggleSwitch = (value) => {
      //onValueChange of the switch this function will be called
      this.setState({switchValue: value})
      //state changes according to switch
      //which will result in re-render th  e text
   }   
  render() {  
    return (
      <View style={styles.container}>
        {/*Text to show the text according to switch condition*/}
        <View style={{flexDirection:'row'}}>
       
        <Switch
         
          onValueChange = {this.toggleSwitch}
          value = {this.state.switchValue}/>

          <Text style={{ color: Colors.text,
     fontFamily: 'Helvetica',
    fontSize: 14,}}>{this.state.switchValue?'Geo Tag Address':'Geo Tag Address'}</Text>
          </View>
      </View>
    );  
  } 
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});