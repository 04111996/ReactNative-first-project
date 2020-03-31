import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  Alert,
  Modal,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  ActivityIndicator,
  TextInput,
  ImageBackground,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import {Form, Item, Input, Label, Icon} from 'native-base';
import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class CurrencyInput extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      input: '',
      hasFocus: false,
    };
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
    }else {
     
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
    if(newText.toString().indexOf('.') == 0)
    {
      newText = newText
      .toString()
      .substring(1);
    }
    newText = newText.replace("-", "")
    this.setState({input: newText});
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
  focus(){
    this.inputdata.focus()
  }
  render() {
    // alert('jhgjh'+(this.props.value))
    return (
      <View>
        <Form>
          <Item floatingLabel style={styles.inputFloatingItem}>
            <Label
              style={
                (this.props.value != '' && this.props.value != 'null') ||
                this.state.input != '' ||
                this.state.hasFocus
                  ? styles.labelFocus
                  : styles.label
              }>
              {this.props.label}
            </Label>
            <Input
              style={
                this.state.hasFocus ? styles.focusedTextInput : styles.textInput
              }
              onFocus={() => {
                this.setState({hasFocus: true});
              }}
              onBlur={() => {
                this.setState({hasFocus: false});
              }}
              keyboardType="numeric"
              value={this.props.value != 'null' ? this.props.value : ''}
              onChangeText={this.onChangedLimit}
              returnKeyType={this.props.returnKeyType}
              autoFocus={this.props.autoFocus}
              onSubmitEditing={this.props.onSubmitEditing}
              ref={ref => this.inputdata = ref}
              disabled={this.props.disabled}
              editable={this.props.editable}
            />
          </Item>

          {this.isEnableSymbol(this.props.value) &&
          this.props.value != 'null' ? (
            <Text style={styles.rupeeSymbol}> {'\u20B9'}</Text>
          ) : null}
        </Form>
        {(this.isEnableSymbol(this.props.value) &&
          this.props.value != 'null') ||
        this.state.hasFocus ? (
          <View style={styles.calendarLineWidget}>
            <Text style={{color: Colors.darkenGray}}>Lakhs</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

{
  /* <TextInput
            style={this.props.style}
            placeholder={this.props.placeholder}
            onChangeText={this.onChangedLimit}
            value={this.state.input}
            numberOfLines={2}
            multiline={true}
            ref={this.props.inputRef}
            onEndEditing={this.props.onEndEditing}
            clearTextOnFocus={this.props.clearTextOnFocus}
            onFocus={this.props.onFocus}
            /> */
}

const styles = StyleSheet.create({
  financialContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: width / 2,
    marginHorizontal: 40,
    flex: 1,
    marginVertical: 50,
    minHeight: 500,
  },
  navigationContainer: {
    flex: 1,
    position: 'absolute',
    // backgroundColor:'red',
    height: '100%',
    width: '100%',
  },
  Container: {
    flex: 1,
  },
  calendarLineWidget: {
    //  marginTop:30,
    // position:'relative',
    // zIndex:-1
    //justifyContent:'center',
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
  uparrowContainer: {
    padding: 40,
    marginTop: 95,
  },
  downarrowContainer: {
    position: 'absolute',
    padding: 40,
    bottom: 0,
  },
  inputFloatingItem: {
    borderColor: 'transparent',
    paddingVertical: 0,
  },
  label: {
    fontFamily: 'Helvetica',
    color: Colors.text,
    ...Fonts.style.normal,
    marginTop: -10,
    marginLeft: -3,
    marginBottom: 5,
  },
  labelFocus: {
    color: Colors.darkenGray,
    fontSize: 11,
    fontFamily: 'Helvetica',
    marginLeft: -3,
    marginBottom: 5,
    marginTop: 0,
  },

  //   focusedTextInput:{
  //     marginTop:10,
  //     borderBottomColor:'#ffcb05',
  //     borderBottomWidth:0.5,
  //     position:'relative',
  //     top:0,
  //     paddingLeft:15,
  //    // backgroundColor:'red'
  //   },
  //   textInput: {
  //     marginTop:10,
  //     borderBottomColor:'#c7c8ca',
  //     borderBottomWidth:0.5,
  //     position:'relative',
  //     top:0,
  //     paddingLeft:15,
  //     // backgroundColor:'red'
  // },
  focusedTextInput: {
    marginTop: -10,
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingTop: 10,
  },
  textInput: {
    marginTop: -10,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 15,
    paddingTop: 10,
  },
  rupeeSymbol: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    left: 10,
  },
  rupeeSymbolNet: {
    color: '#58595b',
    fontFamily: 'Helvetica',
    fontSize: 19,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: -50,
    left: 10,
  },
  progressBarWidget: {
    width: width / 1.5,
    marginTop: 40,
    marginHorizontal: 40,
  },
  progressBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  progressBarTitle: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  progressBarCount: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
  progressBarCountValue: {
    color: '#272829',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: 'bold',
  },

  progress: {
    margin: 10,
    height: 8,
    width: '99%',
  },
});
