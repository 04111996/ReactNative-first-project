import React, {Component} from 'react';
import {Platform, StyleSheet, Text,AsyncStorage, View,Alert,Modal, Picker,ScrollView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,ToastAndroid,
  ActivityIndicator,TextInput,ImageBackground,Dimensions,Image, BackHandler} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
export default class PhoneNumberInput extends Component {
    textChange = (inputValue) => {
       // this.props.gacHandle(()=>this.onChangedLimit(inputValue)); // these two seperate functions
        this.props.formHandle(this.state.input); // can be linked and called simultaneously by onChangeText
    }
constructor(props){
    super(props);
    this.myRef=React.createRef();
      this.state = {
        input: '',
        hasFocus:false,
        validationError: '',
      };
}

 onTextChanged=(text)=>{
      let newText = '';
      let numbers = text.replace(/\./g, "");
      if(isNaN(text)||text=='0'){
         // newText = numbers
      }else{ 
        if(numbers.length<=10)
        {
         newText = numbers
         this.setState({ input: newText})     
         this.props.onValueChanged(newText);
        } 
        if(numbers.length<10){
          this.setState({ validationError: 'Invalid phone Number'}) 
        }
        else{
           this.setState({ validationError: ''})  
        }
        if(numbers.length < 1){
          this.setState({ validationError: 'Please enter phone Number'}) 
        }
    }
    }
 isEnableSymbol(text){
      if(text)
      {
       if(text.length>0)
       {
         return true
       }
       else{
         return false
       }
      }
      else{
         return false
      }
    }
    focus() {
      // alert('22')
      this.textInput.focus()
    }
    render(){
        return (
               <Form>
                <View>
                  
                  <Item floatingLabel style={styles.inputFloatingItem} >
                  <Label style={ (this.props.value != '' && this.props.value != 'null' ) || (this.state.input != '') ||this.state.hasFocus ? styles.labelFocus : styles.label }>{this.props.label}</Label>
                  <Input 
                    style={this.state.hasFocus ? styles.focusedTextInputPhone : styles.textInputPhone}
                    onFocus={()=>{this.setState({hasFocus:true})}}
                    onBlur={()=>{this.setState({hasFocus:false})}}
                    value={(this.props.value != 'null')? this.props.value : ""}
                    onChangeText={this.onTextChanged}
                    keyboardType='numeric'
                    returnKeyType = {this.props.returnKeyType}
                    autoFocus = {this.props.autoFocus}
                    onSubmitEditing = {this.props.onSubmitEditing}
                    ref={input => this.textInput = input}
                    />
                  </Item>
                 
                  { this.state.hasFocus || (this.props.value != 'null' && this.props.value != '')? <Text style={styles.rupeeSymbol}>+91</Text>:null}
                  
                </View>
                {this.state.validationError ? 
                 <Text style={styles.inlineError}>{this.state.validationError}</Text>
                  :null}

                   {(this.state.validationError=='' && this.props.value != 'null' && this.props.value!='' && this.props.value.length<10) ? 
                 <Text style={styles.inlineError}>Invalid phone Number</Text>
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
    focusedTextInputPhone:{
      marginTop:-10,
      borderBottomColor:Colors.yellow,
      borderBottomWidth:0.5,
      ...Fonts.style.normal,
      fontFamily: "Helvetica",
      fontWeight:'bold',
      color:Colors.text,
      paddingBottom:0,
      paddingLeft:30,
      paddingTop:10
    },
    textInputPhone: {
      marginTop:-10,
      borderBottomColor:Colors.darkGray,
      borderBottomWidth:0.5,
      ...Fonts.style.normal,
      fontFamily: "Helvetica",
      fontWeight:'bold',
      color:Colors.text,
      paddingBottom:0,
      paddingLeft:30,
      paddingTop:10
  },
  inlineError:{
      fontFamily: "Helvetica",
      ...Fonts.style.small,
      color:Colors.error,
      marginTop:10,
      marginLeft:15,
      // position:'absolute'
   },
  rupeeSymbol:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    position:'absolute',
    bottom:1.5,
    left:15
  },
  rupeeSymbolNet:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:19,
    fontWeight:'bold',
    position:'absolute',
    bottom:-50,
    left:10
  },
  progressBarWidget:{
    width:width/1.5,
    marginTop:40,
    marginHorizontal:40
  },
  progressBarContent:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginLeft:10,
  },
  progressBarTitle:{
    color:'#272829',
    fontFamily: "Helvetica",
    fontSize:14,
  },
  progressBarCount:{
    color:'#272829',
    fontFamily: "Helvetica",
    fontSize:14,
  },
  progressBarCountValue:{
    color:'#272829',
    fontFamily: "Helvetica",
    fontSize:18,
    fontWeight:'bold'
  },

  progress: {
    margin: 10,
    height:8,
    width:'99%'
  },
  
  });