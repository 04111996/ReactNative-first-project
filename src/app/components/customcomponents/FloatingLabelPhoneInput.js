import React from 'react';
import {View, TextInput,Text, Animated,StyleSheet} from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

class FloatingLabelPhoneInput extends React.Component {
    textChange = (inputValue) => {
        // this.props.gacHandle(()=>this.onChangedLimit(inputValue)); // these two seperate functions
         this.props.formHandle(this.state.input); // can be linked and called simultaneously by onChangeText
     }
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
    // alert('88')
    if(this.props.onSubmitEditing !=null)
     this.props.onSubmitEditing();
    }
    
  focus() {
    // alert('99')
    this.textInput.focus()
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
      <View >
          <View style={{paddingTop: 18, backgroundColor: '#FCFCFC'}}> 
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? styles.focusedTextInput : styles.textInput}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          onChangeText={this.onTextChanged}
          keyboardType='numeric'
          returnKeyType = {this.props.returnKeyType}
          autoFocus = {this.props.autoFocus}
          onSubmitEditing = {this.onSubmitEditing.bind(this)}
          ref ={input => this.textInput = input}
        />
        { this.state.isFocused || (this.props.value != 'null' && this.props.value != '')? <Text style={styles.rupeeSymbol}>+91</Text>:null}
          </View>
        {this.state.validationError !='' ? 
            <Text style={styles.inlineError}>{this.state.validationError}</Text>
            :
            (this.props.value != '' && this.props.value.length<10) ? 
            <Text style={styles.inlineError}>Invalid phone Number</Text>
            :null}

            {/* {(this.state.validationError=='' && this.props.value != 'null' && this.props.value.length<10) ? 
            <Text style={styles.inlineError}>Invalid phone Number</Text>
            :null} */}
      </View>
      
    );
  }
}

export default FloatingLabelPhoneInput;

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
    paddingLeft:25,

  },
  textInput: {
    height: 40,
    fontSize: 14,
    color: Colors.text,
    fontWeight:'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c7c8ca',
    // backgroundColor: '',
    paddingLeft:25,

},
rupeeSymbol:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:14,
    fontWeight:'bold',
    position:'absolute',
    bottom:11,
    left:0
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
