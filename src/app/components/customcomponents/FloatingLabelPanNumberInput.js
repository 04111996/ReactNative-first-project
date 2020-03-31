import React from 'react';
import {View, TextInput,Text, Animated,StyleSheet, Alert} from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

var validationError = '';

class FloatingLabelPanNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      input: '',
      validationError: '',
    };

    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1,
    );
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200,
    }).start();
  }
  componentDidMount(){
    if (this.props.onRef != null) {
      this.props.onRef(this)
      }
      if (typeof this.props.resetValidationError === 'function') {
        this.props.resetValidationError(this.resetState.bind(this));
      }
  }

  resetState(){
    this.setState({validationError:''})
  }

  onSubmitEditing() {
    // alert('11')
    if(this.props.onSubmitEditing !=null)
     this.props.onSubmitEditing();
    }
    
  focus() {
    // alert('22')
    this.textInput.focus()
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
    }else if(this.props.panType == "applicant" && text.charAt(3) != "C"){
      validationError = 'Provide Valid business PAN'
      this.setState({validationError:validationError})
    }else if(this.props.panType == "guarantor" && text.charAt(3) != "P"){
      validationError = 'Provide Valid Individual PAN'
      this.setState({validationError:validationError})
    }else{
      validationError = ''
        this.setState({validationError:''});
    }
   // this.props.onValueChanged(text)
   this.setState({ input: text},()=>this.props.onValueChanged(text))     
    // return newText;
  }
  hasPanValidationError = () =>{
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    const text = this.props.value;
    //alert(!regpan.test(text))
    if(text !='null' && text!=""){
      if(!regpan.test(text))
        validationError = 'Invalid PAN Number'
      else if(this.props.panType == "applicant" && text.charAt(3) != "C")
        validationError = 'Provide Valid business PAN'
      else if(this.props.panType == "guarantor" && text.charAt(3) != "P")
        validationError = 'Provide Valid Individual PAN'
      else 
        validationError =""    
    }
    else{
      validationError = ''
    }
    return validationError;
    // if(this.props.value != "" && regpan.test(this.props.value))
    //  {
    //    alert('777')
    //     // if(this.props.value.length < 1){
    //     //     validationError: 'Please enter phone Number'
    //     // }
    //     // if(this.props.value == ""){
    //     //  validationError = 'Enter PAN Number'
    //     //  return false
    //     //  }else if(regpan.test(this.props.value) == false){
    //     //  validationError = 'Invalid PAN Number'
    //     //  return false
    //     //  }
    //     validationError ="";
    //     return true;
       
    //  }
    //  else{
    //      validationError = 'drtfghhhhh'
    //    return true
    //  }
 
 }

  render() {
    const {label, ...props} = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 10],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 11],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#58595b', '#9c9ea0'],
      }),
    };
    return (
          <View style={{paddingTop: 18, backgroundColor: '#FCFCFC'}}> 
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          // {...props}
          style={this.state.isFocused ? styles.focusedTextInput : styles.textInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          onChangeText={this.onTextChanged}
          value={(this.props.value != 'null')? this.props.value : ''}
          returnKeyType = {this.props.returnKeyType}
          autoFocus = {this.props.autoFocus}
          onSubmitEditing = {this.onSubmitEditing.bind(this)}
          ref ={input => this.textInput = input}
          autoCapitalize ={this.props.autoCapitalize}
        />
          {this.state.validationError != "" ? 
        <Text style={styles.inlineError}>{this.state.validationError}</Text>
            :this.hasPanValidationError() != "" ? 
            <Text style={styles.inlineError}>{this.hasPanValidationError()}</Text>
            :null
          }

            {/* {(this.props.value =='' || this.props.value =='null') ? 
            <Text style={styles.inlineError}>Enter PAN Number</Text>
            :null}  */}
      </View>
      
    );
  }
}

export default FloatingLabelPanNumberInput;

const styles = StyleSheet.create({
    focusedTextInput:{
    borderBottomColor:Colors.yellow,
    borderBottomWidth:0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    height: 40,
    color: Colors.text,
    fontWeight:'bold',
    // backgroundColor: '',
    paddingLeft:0,

  },
  textInput: {
    height: 40,
    fontSize: 14,
    color: Colors.text,
    fontWeight:'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c7c8ca',
    // backgroundColor: '',
    paddingLeft:0,

},
rupeeSymbol:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    position:'absolute',
    bottom:11,
    left:15
  },
  
  inlineError:{
    fontFamily: "Helvetica",
    ...Fonts.style.small,
    color:Colors.error,
    marginTop:10,
    marginLeft:0,
    // position:'absolute'
 },

});
