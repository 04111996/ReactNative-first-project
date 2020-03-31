import React from 'react';
import { View, TextInput, Animated, StyleSheet, Text } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

class FloatingLableCustomInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      input: '',
      validationError: '',
    };

    this._animatedIsFocused = new Animated.Value(
      this.props.value === ''||this.props.value==null ? 0 : 1,
    );
  }
  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200,
    }).start();
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this)
    }
  }
  onSubmitEditing() {
    // alert('11')
    if (this.props.onSubmitEditing != null)
      this.props.onSubmitEditing();
  }

  focus() {
    // alert('22')
    this.textInput.focus()
  }
  onTextChanged = (text) => {
    let newText = text;
    var validationError = "";
    // if(newText===""){
    //   validationError = 'Enter Shareholding value'
    //   this.setState({validationError:'Enter Shareholding Value'})
    // }else if(this.props.pattern.test(newText) == false){
    //   validationError = 'Please enter Maximum 100%'
    //   this.setState({validationError:'Please enter Maximum 100%'})
    // }else{
    //   validationError = ''
    //     this.setState({validationError:''});
    // }
    console.log("pattern::: "+ this.props.pattern)
    if(this.props.pattern && this.props.pattern !="" && !this.props.pattern.test(text)){
        validationError = this.props.errorMessage
     }
    this.setState({ input: newText ,validationError:validationError})
    this.props.onValueChanged(newText);
    return newText;
  }

  render() {
    const { label, ...props } = this.props;
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
      <View style={{paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          // style={{
          //   height: 40,
          //   fontSize: 14,
          //   color: '#000',
          //   fontWeight:'bold',
          //   borderBottomWidth: 1,
          //   borderBottomColor: '#c7c8ca',
          //   backgroundColor: '',
          //   paddingLeft:15,
          // }}
          style={[this.state.isFocused ? styles.focusedTextInput : styles.textInput,this.props.style]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          onChangeText={this.onTextChanged}
          value={(this.props.value != 'null') ? this.props.value : ''}
          returnKeyType={this.props.returnKeyType}
          autoFocus={this.props.autoFocus}
          onSubmitEditing={this.onSubmitEditing.bind(this)}
          ref={input => this.textInput = input}
          autoCapitalize='words'
          maxLength = {this.props.maxLength}
        />
        {this.props.requiredEndText ? 
          <Text style={{color:'#9c9ea0',fontSize:18,alignSelf:'flex-end',marginTop:-30}}>{this.props.endText}</Text>
        : null
        }
      {this.state.validationError !='' ? 
            <Text style={styles.inlineError}>{this.state.validationError}</Text>
            :
            null}
      </View>
    );
  }
}

export default FloatingLableCustomInput;

const styles = StyleSheet.create({
  focusedTextInput: {
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    height: 40,
    color: Colors.text,
    fontWeight: 'bold',
    // backgroundColor: '',
    paddingLeft: 0,

  },
  textInput: {
    height: 40,
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c7c8ca',
    // backgroundColor: '',
    paddingLeft: 0,

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
