import React, {Component} from 'react';
import {Platform, StyleSheet, Text,AsyncStorage, View,Alert,Modal, Picker,ScrollView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,ToastAndroid,
  ActivityIndicator,TextInput,ImageBackground,Dimensions,Image, BackHandler} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
  
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
export default class NameInput extends Component {

constructor(props){
    super(props);
    this.myRef=React.createRef();
      this.state = {
        input: '',
        hasFocus: false,
      };
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

   onTextChanged=(text)=>{
      let newText = '';
        newText = text
     this.setState({ input: newText})
     this.props.onValueChanged(newText);
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
    render(){
     // alert(this.props.value+'props')
        return (
               <Form>
               <Item floatingLabel style={styles.inputFloatingItem} >
                      {/* <Label style={(this.state.hasFocus && this.props.value != '') || (this.state.input != '') ? styles.labelFocus : styles.label }>{this.props.label}</Label> */}
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
                        autoCapitalize = 'words'
                        maxLength = {this.props.maxLength}
                      />
                    </Item>
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
  rupeeSymbol:{
    color:'#58595b',
    fontFamily: "Helvetica",
    fontSize:19,
    fontWeight:'bold',
    position:'absolute',
    bottom:14,
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