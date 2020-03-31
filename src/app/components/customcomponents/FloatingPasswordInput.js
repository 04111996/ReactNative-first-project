import React from 'react';
import { View, TextInput, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import VisibilityImage from "../../assets/images/visibility.svg";
import MakeInvisibleImage from "../../assets/images/invisible.svg";

class FloatingPasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      input: '',
      passwordHide: true,
      keyboardType: 'default'
    };

    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1,
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
    let newText = '';
    newText = text
    this.setState({ input: newText })
    this.props.onValueChanged(newText);
    return newText;
  }

  makeVisible = () => {
    this.setState({keyboardType: 'visible-password'})
  }

  makeInvisible = () => {
    this.setState({keyboardType: 'default'})
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
        <View style={[this.state.isFocused ? styles.focusedTextInput : styles.textInput,this.props.style]}>
            <View style={{flex: 1}}>
                <TextInput
                secureTextEntry={this.state.passwordHide}
                keyboardType ={this.state.keyboardType}
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
            </View>
            <View style={{width:20, height: 80, top: 15}}>
                {this.state.keyboardType == 'default' ?
                    <TouchableOpacity onPress={this.makeVisible }>
                        <VisibilityImage/>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={this.makeInvisible }>
                        <MakeInvisibleImage/>
                    </TouchableOpacity>  

                }
                
            </View>
        </View>
      </View>
    );
  }
}

export default FloatingPasswordInput;

const styles = StyleSheet.create({
  focusedTextInput: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    height: 40,
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c7c8ca',
    // backgroundColor: '',
    paddingLeft: 0,

  },

});
