import React, {Component} from 'react';
import {Platform, StyleSheet, Text,AsyncStorage, View,Alert,Modal, Picker,ScrollView,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight,ToastAndroid,
  ActivityIndicator,TextInput,ImageBackground,Dimensions,Image, BackHandler} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
export default class UploadSignedModal extends Component {
   
constructor(props){
    super(props);
    this.myRef=React.createRef();
      this.state = {
        input: '',
        hasFocus:false,
      };
}

    render(){
        return (
              <View>
                  <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.modalVisible}
                        transparent={true}
                        onRequestClose = {() => { console.log("Modal has been closed.") } }>
                        <View style={{backgroundColor:'rgba(0,0,0,0.5)',position:'absolute',top:0,width:'100%',height:'100%'}}>
                            <View style = {styles.modal}>
                                <View style={styles.modalHeader}>
                                  <Text style={styles.modalTitle}> Upload Signed Consent Form </Text>
                                  <TouchableOpacity onPress = {() => {
                                    this.toggleModal(!this.state.modalVisible)}}>
                                    <Text style={styles.text}>
                                      <IconArrowDown />
                                    </Text>
                                </TouchableOpacity>
                                </View>
                                <View style={{flexDirection:'row', marginHorizontal:40, justifyContent:'space-around'}}>
                                  <View style={styles.uploadWidget}>
                                    <IconPdf style={styles.iconSpace}/>
                                    <TouchableOpacity  onPress={this.selectOneFile.bind(this)}>
                                        <Text style={styles.btnSaveDetails}> Upload PDF</Text>
                                    </TouchableOpacity>
                                    <View style={styles.uploadWidgetSeparator}></View>
                                  </View>
                                  <View style={styles.uploadWidget}>
                                    <IconCamera style={styles.iconSpace}/>
                                    <TouchableOpacity  onPress={this.handleChooseCamera}>
                                        <Text style={styles.btnSaveDetails}> Take Photo</Text>
                                    </TouchableOpacity>
                                    <View style={styles.uploadWidgetSeparator}></View>
                                  </View>
                                  <View style={styles.uploadWidget}>
                                    <IconGallery style={styles.iconSpace}/>
                                    <TouchableOpacity  onPress={this.handleChoosePhoto}>
                                        <Text style={styles.btnSaveDetails}> Open Gallery </Text>
                                    </TouchableOpacity>
                                    <View style={styles.uploadWidgetSeparator}></View>
                                  </View>
                                  <View style={styles.uploadWidget}>
                                    <IconMail style={styles.iconSpace}/>
                                    <TouchableOpacity  >
                                        <Text style={styles.btnSaveDetails}> Open Email</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                            </View>
                        </View>
                      </Modal>
              </View>
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
  
  });