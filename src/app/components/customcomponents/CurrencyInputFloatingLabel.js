import React, {Component} from 'react';
import {Platform, StyleSheet, Text,AsyncStorage, View,Alert,Modal, Picker,ScrollView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,ToastAndroid,
  ActivityIndicator,TextInput,ImageBackground,Dimensions,Image, BackHandler,Animated} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Fonts from '../../styles/Fonts';
import Colors from '../../styles/Colors';

  const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
export default class FloatingTitleTextInputField extends Component {


  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
       input: '',
    }
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
      }).start();
    }
  }

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
      }).start();
    }
  }

  onChangedLimit=(text)=>{
      let newText = '';
      let numbers = text;
      if(isNaN(text)||text.toString().indexOf('.')==(text.length-1)){
        if(text.toString().indexOf('.')==(text.length-1))
        {
          newText = numbers
          }
        else{
          newText=this.state.input;
        }
      }else{
        if(numbers.toString().indexOf('.')>0)
      {
        newText = numbers.toString().substring(0,numbers.toString().indexOf('.')+3)
      }else {
        newText = numbers
      }
      
    }
    if(newText.toString().indexOf('.') == 0)
    {
      newText = newText
      .toString()
      .substring(1);
    }
    newText = newText.replace("-", "")
     this.setState({ input: newText})
     this.props.formHandle(newText);
    return newText;
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

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive, input} = this.state;
    let {value} = this.props
    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive || (value !='' && isFieldActive) ? 11.5 : 15,
      color: isFieldActive || (value !='' && isFieldActive)  ? 'black' : 'dimgrey',
    }
  }

  render() {
    return (
      <View style = {styles.container}>
        <Animated.Text
          style = {[styles.titleStyles, this._returnAnimatedTitleStyles()]}
        >
          {this.props.label}
        </Animated.Text>
        <View style={{flexDirection:'row'}}>
        { this.isEnableSymbol(this.props.value)  && (this.props.value != 'null') ? <Text style={styles.rupeeSymbol}> {'\u20B9'}</Text>:null}
       <Input 
                style={this.state.isFieldActive ? styles.focusedTextInput : styles.textInput}
                onFocus={()=>{this._handleFocus()}}
                onBlur={()=>{this._handleBlur()}}
                keyboardType='numeric'
                value={(this.props.value != 'null')? this.props.value : ""}
                onChangeText={this.onChangedLimit}
                returnKeyType = {this.props.returnKeyType}
                autoFocus = {this.props.autoFocus}
                onSubmitEditing = {this.props.onSubmitEditing}
                getRef ={this.props.getRef}
                />
    </View>
      </View>
    )
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
   container: {
    width: '100%',
   // borderRadius: 3,
    //borderStyle: 'solid',
    //borderWidth: 0.5,
    height: 50,
    marginVertical: 4,
  },
  textInput: {
    fontSize: 15,
    marginTop: 5,
    fontFamily: 'Avenir-Medium',
    color: 'black',
  },
  titleStyles: {
    position: 'absolute',
    fontFamily: 'Helvetica',
    left: 3,
    left: 4,
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
      marginLeft:-3,
      marginBottom:5,
    },
    labelFocus:{
      color:Colors.darkGray,
      fontSize:11,
      fontFamily: "Helvetica",
      marginLeft:-3,
      marginBottom:5,
      marginTop:0,
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
  focusedTextInput:{
    marginTop:-10,
    borderBottomColor:Colors.yellow,
    borderBottomWidth:0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight:'bold',
    color:Colors.text,
    paddingBottom:0,
    paddingLeft:15,
    paddingTop:10
  },
  textInput: {
    marginTop:-10,
    borderBottomColor:Colors.darkGray,
    borderBottomWidth:0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight:'bold',
    color:Colors.text,
    paddingBottom:0,
    paddingLeft:15,
    paddingTop:10
},
  rupeeSymbol:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:16,
    fontWeight:'bold',
    position:'absolute',
    bottom:0,
    left:10
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