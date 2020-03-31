import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
import Fonts from '../../../../styles/Fonts';
import IconLeads from '../../../../assets/images/icon_my_leads.svg';
import IconLeadsActive from '../../../../assets/images/icon_my_leads_active.svg';
import IconCaseFiles from '../../../../assets/images/icon_case_files.svg';
import IconCaseFilesActive from '../../../../assets/images/icon_case_files_active.svg';
import IconGuidebook from '../../../../assets/images/icon_guidebook.svg';
import IconGuidebookActive from '../../../../assets/images/icon_guidebook_active.svg';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class LeftNavigation extends Component {
    constructor(props) {
      super(props);
       this.state = { selectedLayout:'addcase' }
    }

    onClickNavigation = (selectedScreen) =>{
      this.props.onClickNavigation(selectedScreen)
      this.setState({selectedLayout:selectedScreen})
    } 

    render(){
      let {selectedLayout} = this.state
      let {selected} = this.props
      return (
        <View style={styles.leftNavContainer}>
            <View style={styles.navItems}>
             {selected=='myleads'? <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('myleads')}>
                {/* <Image
                    style={styles.icMyLeads}
                    source={require('../../../../assets/images/icon_group_active.png')}
                    /> */}
                  <IconLeadsActive />
                <Text style={styles.navItemSelected}> My Leads</Text>
                 </TouchableOpacity>: <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('myleads')}>
                {/* <Image
                    style={styles.icMyLeads}
                    source={require('../../../../assets/images/icon_my_leads.png')}
                    /> */}
                  <IconLeads />
                <Text style={styles.navItem}> My Leads</Text>
                 </TouchableOpacity>}
             
            </View>
           
            <View style={styles.navItems}>
            {(selected=='addcase')?
                <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('addcase')}>
                        {/* <Image
                    style={styles.icAddCase}
                    source={require('../../../../assets/images/case_files_icon_big.png')}
                    /> */}
                    <IconCaseFilesActive/>
                    <Text style={styles.navItemSelected}> My Case Files</Text>
                </TouchableOpacity>: <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('addcase')}>
                        {/* <Image
                    style={styles.icAddCase}
                    source={require('../../../../assets/images/icon_case_files.png')}
                    /> */}
                    <IconCaseFiles />
                    <Text style={styles.navItem}> My Case Files</Text>
                </TouchableOpacity>}
               
            </View>
            <View style={styles.navItems}>
            {selected=='guidebook'?
              <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('guidebook')}>
                {/* <Image
                    style={styles.icGuidebook}
                    source={require('../../../../assets/images/icon_guidebook_active.png')}
                    /> */}
                    <IconGuidebookActive />
                <Text style={styles.navItemSelected}> Guide Book</Text>
                </TouchableOpacity>: <TouchableOpacity style={{alignItems:'center'}}  onPress={()=>this.onClickNavigation('guidebook')}>
                {/* <Image
                    style={styles.icGuidebook}
                    source={require('../../../../assets/images/icon_guidebook.png')}
                    /> */}
                    <IconGuidebook />
                <Text style={styles.navItem}> Guide Book</Text>
                </TouchableOpacity>}
            </View>
        </View>
      );
    }
    
  }

  const styles = StyleSheet.create({
    leftNavContainer:{
      justifyContent:'center',
      flex:1,
    },
    navItems:{
        marginBottom:52,
        alignItems:'center',
    },
    navItem:{
        fontFamily: "Helvetica",
        ...Fonts.style.normal,
        fontWeight:'700',
        color:'#f3f3f3',
        paddingTop:6,
        opacity:0.5
    },
      navItemSelected:{
        fontFamily: "Helvetica",
        ...Fonts.style.normal,
        fontWeight:'700',
        color:'#ffffff',
        paddingTop:6
    },
    icMyLeads:{
      width:43,
      height:40
    },
    icGuidebook:{
   //  width:26,
     // height:30
      width:43,
      height:40
    },
    icAddCase:{
      width:43,
      height:40
    }
  });