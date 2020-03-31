import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { Form, Item, Input, Label, Icon } from 'native-base';
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class TechnicalComponent extends Component {
    constructor(props) {
      super(props);
      
    }
    
    render(){
      return (
         <View style={styles.Container}>
            <View style={styles.nextRelContainer}>      
              <View style={styles.nextRelImage}>
                    <Image
                        style={styles.imgTechnical}
                        source={require('../../assets/images/icon_technical.png')}
                        />
                    <Text style={styles.comingSoonTitle}>Coming soon in the next release</Text>
                    <Text style={styles.comingSoonDesc}>We will let you know when there  </Text>
                    <Text style={styles.comingSoonDesc}>will be something new for you</Text>
                </View>   
            </View>
        </View>
      );
    }
    
  }

  const styles = StyleSheet.create({
     Container:{
      flex:1,
    },
    nextRelContainer:{
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
         flex:1
    },
    imgTechnical:{
        width:77,
        height:78,
        alignSelf:'center',
        marginBottom:30
    },
    comingSoonTitle:{
        color:'#4a4a4a',
        fontFamily: "Helvetica",
        fontSize:18,
        fontWeight:'700',
        alignSelf:'center',
        marginBottom:5
    },
    comingSoonDesc:{
        color:'#6b6b6b',
        fontFamily: "Helvetica",
        fontSize:18,
        alignSelf:'center'
    }

    
  
  });