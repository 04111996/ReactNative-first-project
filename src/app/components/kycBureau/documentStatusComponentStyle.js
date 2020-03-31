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
      marginTop:80,
      marginLeft:20
    },
     calendarLineWidget:{
        marginTop:-30,
        position:'relative',
        zIndex:-1
      },
      calendarLine:{
        borderBottomColor:Colors.darkGray,
        borderBottomWidth:1,
        textAlign:'right',
        paddingBottom:10,
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

})

