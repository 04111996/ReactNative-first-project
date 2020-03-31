import { StyleSheet,Dimensions } from 'react-native'
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import ApplicationStyles from '../../styles/ApplicationStyles';
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 
export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
    kycFormContainer:{
        backgroundColor:Colors.contentBgColor,
        width:'70%'
    },
    documentStatusWidget:{
      marginTop:100,
      marginLeft:20
    },
    docTitle:{
        ...Fonts.style.small,
        color:Colors.darkenGray,
        marginBottom:40,
        fontFamily: "Helvetica",
    },
    icSuccess:{
        width:24,
        height:24,
        marginRight:10
      },
    docStatusTextWidget:{
      flexDirection:'row', 
      // alignItems:'center',
      // flexWrap:'wrap',
      marginRight:25,
    },
    docStatusText:{
      ...Fonts.style.normal,
        color:Colors.text,
        fontFamily: "Helvetica",
        paddingLeft:10,
        lineHeight:22,
    },
    verticalBarWidget:{
      marginTop:-1
    },
    verticalBar:{
      backgroundColor:Colors.text,
      width:2, 
      marginBottom:4,
      height:8,
      marginLeft:10
    },
     buttonCancel: {
   width: 150,
    height: 40,
    backgroundColor: Colors.white,
    color: Colors.primary,
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth:1,
    marginRight: 20,
    borderColor:Colors.primary,
  },

})

