import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image
} from 'react-native';
import IconMyLeadsPage from '../../../assets/images/icon_my_leads_page.svg';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class MyLeadsComponent extends Component {
  static navigationOptions = {
        header: null
    }
    constructor(props) {
      super(props);
    }

    render(){
      return (
        <View style={styles.notificationContainer}>
            <View style={styles.notificationImage}>
                {/* <Image
                    style={styles.imgNotification}
                    source={require('../../../assets/images/icon_group_active.png')}
                    /> */}
                  <IconMyLeadsPage style={styles.imgNotification}/>
                <Text style={styles.comingSoonTitle}>Coming soon in the next release</Text>
                <Text style={styles.comingSoonDesc}>You will be able to get leads from </Text>
                <Text style={styles.comingSoonDesc}>different sources.</Text>
            </View>
            
        </View>
      );
    }
    
  }

  const styles = StyleSheet.create({
    notificationContainer:{
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center'
    },
    imgNotification:{
        width:69,
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