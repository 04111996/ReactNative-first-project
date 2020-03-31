import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, AsyncStorage, View, Alert, Modal, Picker, ScrollView, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight, ToastAndroid,
    ActivityIndicator, TextInput, ImageBackground, Dimensions, Image, BackHandler, Animated
} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class AddressPinCodeInput extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            input: '',
            isFocused: false,
        };
        this._animatedIsFocused = new Animated.Value(
            this.props.value === '' ? 0 : 1,
        );
    }

    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
          toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
          duration: 200,
        }).start();
    }

    // componentDidUpdate(prevProps,prevState) {
    //   let { value } = this.props 
    //   // Typical usage (don't forget to compare props):
    //   if (value !='null') {
    //     this.setState({
    //       hasFocus : true
    //     })
    //   }
    // }

    onTextChanged = (text) => {
        let num = text.replace(".", '');
        if (isNaN(num)) {
            // Its not a number
        } else {
            let newText = '';
            newText = num
            this.setState({ input: newText })
            this.props.onValueChanged(newText);
            return newText;
        }
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
           
                    // <Input 
                    //    style={this.state.hasFocus ? styles.focusedTextInput : styles.textInput}
                    //     onFocus={()=>{this.setState({hasFocus:true})}}
                    //     onBlur={()=>{this.setState({hasFocus:false})}}
                    //     value={this.props.value !== null ? this.props.value.toString() : ''}
                    //     onChangeText={this.onTextChanged}
                    //     returnKeyType = {this.props.returnKeyType}
                    //     autoFocus = {this.props.autoFocus}
                    //     onSubmitEditing = {this.props.onSubmitEditing}
                    //     getRef ={this.props.refs}
                    //     // autoCapitalize = 'words'
                    //     // keyboardType = 'numeric'
                    //     maxLength = {35}
                    // />

                    <View style={{paddingTop: 18 }}>
                        <Animated.Text style={labelStyle}>{label}</Animated.Text>
                        <TextInput 
                            style={[this.state.isFocused ? styles.focusedTextInput : styles.textInput,this.props.style]}
                            onFocus={()=>{this.setState({isFocused:true})}}
                            onBlur={()=>{this.setState({isFocused:false})}}
                            value={this.props.value !== null ? this.props.value+"" : ''}
                            onChangeText={this.onTextChanged}
                            returnKeyType = {this.props.returnKeyType}
                            autoFocus = {this.props.autoFocus}
                            onSubmitEditing = {this.props.onSubmitEditing}
                            ref ={this.props.refs}
                            // autoCapitalize = 'words'
                            // keyboardType = 'numeric'
                            maxLength = {this.props.maxLength}
                        />
                    </View>
                

        );
    }
}

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
  
  });