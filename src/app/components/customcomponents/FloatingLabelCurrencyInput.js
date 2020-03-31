import React from 'react';
import { View, TextInput, Text, Animated, StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

class FloatingLabelCurrencyInput extends React.Component {
  textChange = inputValue => {
    // this.props.gacHandle(()=>this.onChangedLimit(inputValue)); // these two seperate functions
    this.props.formHandle(this.state.input); // can be linked and called simultaneously by onChangeText
  };
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      isFocused: false,
      input: '',
      validationError: '',
    };

    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' && this.props.value ? 0 : 1,
    );
  }
  onChangedLimit = text => {
    let newText = '';
    let numbers = text;
    if (isNaN(text) || text.toString().indexOf('.') == text.length - 1) {
      if (numbers.toString().indexOf('.') > 0) {
        if (text.toString().indexOf('.') == text.length - 1) {
          newText = numbers;
        } else {
          newText = this.state.input;
        }
      }
    } else {
      if (numbers.toString().indexOf('.') > 0) {
        newText = numbers
          .toString()
          .substring(0, numbers.toString().indexOf('.') + 3);
      } else {
        newText = numbers;
      }
    }
    if (newText.toString().indexOf('.') == 0) {
      newText = newText.toString().substring(1);
    }
    newText = newText.replace('-', '');
    this.setState({ input: newText });
    this.props.formHandle(newText);
    return newText;
  };

  isEnableSymbol(text) {
    if (text) {
      if (text.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue:
        this.state.isFocused || (this.props.value !== '' && this.props.value)
          ? 1
          : 0,
      duration: 200,
    }).start();
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  onSubmitEditing() {
    // alert('88')
    if (this.props.onSubmitEditing != null) this.props.onSubmitEditing();
  }

  focus() {
    // alert('99')
    this.textInput.focus();
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
      <View>
        <View style={{
          paddingTop: 18,
          position: 'relative',
          top: 26,
          left: -5,
          color: '#58595b',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: "Helvetica",
        }}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            {...props}
            style={
              this.state.isFocused ? styles.focusedTextInput : styles.textInput
            }
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            blurOnSubmit
            onChangeText={this.onChangedLimit}
            keyboardType="numeric"
            returnKeyType={this.props.returnKeyType}
            autoFocus={this.props.autoFocus}
            onSubmitEditing={this.onSubmitEditing.bind(this)}
            ref={input => (this.textInput = input)}
            keyboardType="numeric"
            value={
              this.props.value
                ? (this.props.value + '').trim() != 'null'
                  ? this.props.value.trim()
                  : ''
                : ''
            }
            // value={(this.props.value+"")}
            editable={this.props.editable}
          />
          {this.state.isFocused &&
            this.props.value != 'null' &&
            this.props.value ? (
              <Text style={styles.rupeeSymbol}> {'\u20B9'}</Text>
            ) : this.props.value != 'null' &&
              this.props.value != '' &&
              this.props.value ? (
                <Text style={styles.rupeeSymbol}> {'\u20B9'}</Text>
              ) : null}
        </View>
        <View style={styles.lakhsText}>
          {/* {this.state.isFocused && this.props.value != 'null' && this.props.value !='' && this.props.value != null? (
            <Text style={{ color: Colors.darkenGray }}>InLakhs</Text>
          ) : null} */}
          {this.state.isFocused &&
            this.props.value != 'null' &&
            this.props.value ? (
              <Text style={{ color: Colors.darkenGray }}>InLakhs</Text>
            ) : this.props.value != 'null' &&
              this.props.value != '' &&
              this.props.value ? (
                <Text style={{ color: Colors.darkenGray }}>InLakhs</Text>
              ) : null}
        </View>
      </View>
    );
  }
}

export default FloatingLabelCurrencyInput;

const styles = StyleSheet.create({
  focusedTextInput: {
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: 'Helvetica',
    height: 40,
    color: Colors.text,
    fontWeight: 'bold',
    // backgroundColor: '',
    paddingLeft: 25,



    // position: 'relative',
    // //  top: 30,
    // left: -5,
    // color: '#58595b',
    // fontSize: 14,
    // fontWeight: 'bold',
    // fontFamily: "Helvetica",
  },
  textInput: {
    height: 40,
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#c7c8ca',
    // backgroundColor: '',
    paddingLeft: 25,
  },
  rupeeSymbol: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 11,
    left: 0,
  },

  inlineError: {
    fontFamily: 'Helvetica',
    ...Fonts.style.small,
    color: Colors.error,
    marginTop: 10,
    marginLeft: 0,
    // position:'absolute'
  },
  lakhsText: {
    position: 'absolute',
    right: 5,
    bottom: -15,
  },
});
