import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  FlatList,
  Alert,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';


//import DocumentationNavigator from '../../navigation/DocumentationStack'
//import Navigation from '../../navigation/NavigationStack';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height-StatusBar.currentHeight; //full height
export default class CaseDetailsScreen extends React.Component {
    
 static navigationOptions = {
        header: null
    }
  onClickClose = () =>{
    this.props.navigation.navigate('HomeScreen')
  }
   
  render() {
    return (
      <View style={styles.Container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     
        {/* <DocumentationNavigator /> */}
      </View>
      <View style={styles.navigationContainer}>
       <View style={styles.closeArrow}>
       <TouchableOpacity  onPress={this.onClickClose}>
                      <View style={styles.addNoteContainer}>
               <Image
                    //style={styles.icAddCase}
                    source={require('../../assets/images/icon_back.png')}
                    />
                    <Text style={{color:'white',marginLeft:5,fontWeight:'bold'}}>My Case Files</Text>
            </View>

                </TouchableOpacity>
      </View>
       <View style={styles.addNote}>
        <TouchableOpacity >
            <View style={styles.addNoteContainer}>
               <Image
                    //style={styles.icAddCase}
                    source={require('../../assets/images/icon_add_white.png')}
                    />
                    <Text style={{color:'white',marginLeft:5,fontWeight:'bold'}}>Add Note</Text>
            </View>
                </TouchableOpacity>
      </View>

      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  navigationContainer:{
      flex:1,
      position:'absolute',
     // backgroundColor:'red',
     alignItems:'center',
       height:'100%',
      width:width/6.2
    },
    Container:{
      flex:1,
     
    },
    closeArrow:{
      position:'absolute',
      padding:40,
    },
    addNote:{
      position:'absolute',
      padding:40,
      bottom:0,
    },
    icClose:{
       height:40,
       width:40
    },
    addNoteContainer:{
      flexDirection:'row',
      justifyContent:'center'
    }
   
  
  });