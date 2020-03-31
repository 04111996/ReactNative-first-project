import React, {Component} from 'react';
import {Platform, StyleSheet, Text,AsyncStorage, View,Alert,Modal, Picker,ScrollView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,ToastAndroid,
  ActivityIndicator,TextInput,ImageBackground,Dimensions,Image, BackHandler} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
  
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
var validationError = ''
export default class PanNumberInput extends Component {

constructor(props){
    super(props);
    this.myRef=React.createRef();
      this.state = {
        input: '',
        hasFocus: false,
        validationError:''
      };
      
}

onTextChanged=(value)=>{
    let newText = '';
     let text = value.replace(/[abcdefghijklmnopqrstuvwxyz ]/g, '')
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if(text===""){
        validationError = 'Enter PAN Number'
        this.setState({validationError:'Enter PAN Number'})
    }else if(regpan.test(text) == false){
       validationError = 'Invalid PAN Number'
        this.setState({validationError:'Invalid PAN Number'})
    }else{
      validationError = ''
        this.setState({validationError:''});
    }
   // this.props.onValueChanged(text)
   this.setState({ input: text},()=>this.props.onValueChanged(text))     
    // return newText;
  }
// onTextChanged=(text)=>{
//     let newText = '';
//       newText = text
//     this.setState({ input: newText})
//     this.props.onValueChanged(newText);
//     return newText;
//   }

hasPanValidationError = () =>{
   const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
   if(this.props.value == 'null' || this.props.value == null || regpan.test(this.props.value))
    {
       if(this.props.value===""){
        validationError = 'Enter PAN Number'
        return false
        }else if(regpan.test(this.props.value) == false){
        validationError = 'Invalid PAN Number'
        return false
        }
      
    }
    else{
        validationError = ''
      return true
    }

}

  
    render(){
        return (
               <Form>
               <Item floatingLabel style={styles.inputFloatingItem} >
                      <Label style={ (this.props.value != '' && this.props.value != 'null' ) || (this.state.input != '') ||this.state.hasFocus ? styles.labelFocus : styles.label }>{this.props.label}</Label>
                      <Input 
                        style={this.state.hasFocus ? styles.focusedTextInput : styles.textInput}
                        onFocus={()=>{this.setState({hasFocus:true})}}
                        onBlur={()=>{this.setState({hasFocus:false})}}
                        value={(this.props.value != 'null')? this.props.value : ''}
                        onChangeText={this.onTextChanged}
                        returnKeyType = {this.props.returnKeyType}
                        autoFocus = {this.props.autoFocus}
                        onSubmitEditing = {this.props.onSubmitEditing}
                        getRef ={this.props.getRef}
                        autoCapitalize ={this.props.autoCapitalize}
                      />
                    </Item>
                    {this.hasPanValidationError() && (this.props.value !='') ? 
                        <Text style={styles.inlineError}>Invalid PAN Number</Text>
                        :null}

                      {(this.props.value =='' || this.props.value =='null') ? 
                        <Text style={styles.inlineError}>Enter PAN Number</Text>
                        :null}    
             </Form>
            
        );
    }
}


 const styles = StyleSheet.create({
    financialContainer:{
        flexDirection:'column',
        justifyContent:'center',
        width:width/2,
        marginHorizontal:40,
        flex:1,
        marginVertical:50,
        minHeight:500,
    },
    navigationContainer:{
      flex:1,
      position:'absolute',
     // backgroundColor:'red',
       height:'100%',
      width:'100%'
    },
    Container:{
      flex:1,
    },
    uparrowContainer:{
       padding:40,
       marginTop:95
    },
    downarrowContainer:{
      position:'absolute',
      padding:40,
      bottom:0,
    },
    inputFloatingItem:{ 
      borderColor:"transparent",
      paddingVertical:0
    },
    label:{
      fontFamily: "Helvetica",
      color:Colors.text,
      ...Fonts.style.normal,
      marginTop:-10,
      marginLeft:0,
      marginBottom:5,
    },
    labelFocus:{
      color:Colors.darkenGray,
      fontSize:11,
      fontFamily: "Helvetica",
      marginLeft:0,
      marginBottom:5,
      marginTop:0,
    },
    
      focusedTextInput:{
      // marginTop:10,
      // borderBottomColor:'#ffcb05',
      // borderBottomWidth:0.5,
      // position:'relative',
      // top:0,
      // textAlign:'left',
      //textTransform:'uppercase',
      marginTop:-10,
      borderBottomColor:Colors.yellow,
      borderBottomWidth:0.5,
      ...Fonts.style.normal,
      fontFamily: "Helvetica",
      fontWeight:'bold',
      color:Colors.text,
      paddingBottom:0,
      paddingLeft:0,
      paddingTop:10

    },
    textInput: {
      // marginTop:10,
      // borderBottomColor:'#c7c8ca',
      // borderBottomWidth:0.5,
      // position:'relative',
      // top:0,
      // textAlign:'left',
     //textTransform:'uppercase',
      marginTop:-10,
      borderBottomColor:Colors.darkGray,
      borderBottomWidth:0.5,
      ...Fonts.style.normal,
      fontFamily: "Helvetica",
      fontWeight:'bold',
      color:Colors.text,
      paddingBottom:0,
      paddingLeft:0,
      paddingTop:10,

  },
  inlineError:{
    fontFamily: "Helvetica",
    ...Fonts.style.small,
    color:Colors.error,
    marginTop:10,
    marginLeft:15,
    // position:'absolute'
 },
  
  });