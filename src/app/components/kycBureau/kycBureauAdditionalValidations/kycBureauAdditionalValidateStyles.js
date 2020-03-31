import { StyleSheet,Dimensions } from 'react-native'
import Colors from '../../../styles/Colors';
import Fonts from '../../../styles/Fonts';
import ApplicationStyles from '../../../styles/ApplicationStyles';
import { Col } from 'native-base';

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
  kycContainer:{
        flex:1,
        backgroundColor:Colors.contentBgColor,
    },
    kycObservationListContainer:{
      flex:1
    },
    additionalBankStatementWrapper:{
        backgroundColor:Colors.white,
        paddingVertical:20,
        paddingHorizontal:30,
        borderColor:'#e2e3e3',
        borderWidth:1,
        borderRadius:2,
        width:'93%',
        marginBottom:20,
    },
    headingText:{
        fontFamily: "Helvetica",
        color:Colors.text,
        ...Fonts.style.normal,
        marginBottom:30,
        paddingRight:30,
        lineHeight:22
    },
    uploadFormWidget:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:Colors.darkGray,
        marginTop:0,
        width:'97%',
        // backgroundColor:'blue'
      },
      signedInputLabel:{
        fontFamily: "Helvetica",
        color:Colors.text,
        ...Fonts.style.normal,
      },
      icAddressWidget:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        // height:30,
        // backgroundColor:'red'
      },
      addressField:{
        // alignSelf:'center',
        // flexDirection:'row',
        // justifyContent:'space-between',
        // width:width/2,
        paddingTop:0,
        backgroundColor:'red'
      },
      addressLabel:{
        fontFamily: "Helvetica",
        color:Colors.text,
        ...Fonts.style.normal,
      },
      btnSaveDetails:{
        width:150,
        height:40,
        backgroundColor:'#9d1d28',
        color:'#fff',
        fontFamily: "Helvetica",
        fontSize:14,
        fontWeight:'bold',
        padding:10,
        textAlign:'center',
        borderRadius:20,
        // marginRight:20,
        // marginLeft:-15,
        alignSelf:'center'
      },
      btnSaveDetailsDisable:{
        width:150,
        height:40,
        backgroundColor:'#d8ada1',
        color:'#fff',
        fontFamily: "Helvetica",
        fontSize:14,
        fontWeight:'bold',
        padding:10,
        textAlign:'center',
        borderRadius:20
      },
      btnWithBorder:{
        width:150,
        height:40,
        backgroundColor:Colors.white,
        color:Colors.primary,
        fontFamily: "Helvetica",
        fontSize:14,
        fontWeight:'bold',
        padding:10,
        textAlign:'center',
        borderRadius:20,
        borderColor:Colors.primary,
        borderWidth:1
      },
      addCommentsStyle:{
        marginBottom:30,
        marginLeft:0,
        width:'97%',
        backgroundColor:'#fff'
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
        color:Colors.darkenGray,
        fontSize:11,
        marginLeft:-3,
        marginBottom:5,
        marginTop:0,
      },
      focusedTextInput:{
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
          marginTop:-10,
          borderBottomColor:Colors.darkGray,
          borderBottomWidth:0.5,
          ...Fonts.style.normal,
          fontFamily: "Helvetica",
          fontWeight:'bold',
          color:Colors.text,
          paddingBottom:0,
          paddingLeft:0,
          paddingTop:10
      },
      kycTabNav:{
        flexDirection:'row'
    },
    kycTabNavItem:{
        ...Fonts.style.normal,
        color:Colors.text,
        marginRight:20,
        fontFamily: "Helvetica",
    },
    kycTabNavItemSelected:{
      ...Fonts.style.normal,
        color:Colors.text,
        marginRight:20,
        fontFamily: "Helvetica",
        fontWeight:'bold',
        paddingBottom:8,
        borderBottomColor:Colors.text,
        borderBottomWidth:1.5
    },
    modal:{
      width:width,
      backgroundColor:'#fff',
      position:'absolute',
      bottom:0,
      borderTopLeftRadius:32,
      borderTopRightRadius:32,
      overflow:'scroll',
      height:280
    },
    redoUploadModal:{
      height:height-100,
      width:width,
      backgroundColor:'#fff',
      position:'absolute',
      bottom:0,
      borderTopLeftRadius:32,
      borderTopRightRadius:32,
      overflow:'scroll',
      height:220
    },
    modalOverlayBtn:{
      width:'100%',
      height:'100%'
    },
    modalOverlay:{
      backgroundColor:'rgba(0,0,0,0.5)',
      position:'absolute',
      left:0,
      right:0,
      bottom:0,
      top:0
    },
    modalWidget:{
      backgroundColor:'red',
      height:height,
      flex:0.5,
      margin: 15, 
      alignItems: undefined,
      justifyContent: undefined,
    },
    modalHeader:{
      flexDirection:'row',
      justifyContent:'space-between',
      marginHorizontal:50,
      marginVertical:50,
      alignItems:'center',
    },
    modalTitle:{
      color:Colors.text,
      fontFamily: "Helvetica",
      ...Fonts.style.h1,
      fontWeight:'bold'
    },
    uploadWidget:{
      alignItems:'center',
      // borderRightWidth:1,
      borderRightColor:'red',
      // backgroundColor:'red',
      justifyContent:'center',
      alignItems:'center',
    },
    uploadWidgetSeparator:{
      backgroundColor:Colors.darkenGray,
      position:'absolute',
      right:-40,
      height:80,
      width:1
    },
    iconSpace:{
      marginBottom:20,
      minHeight:45,
    },
    flextStart:{
      alignSelf:'flex-start'
    },

    
    applicantContainer:{
      marginTop:20,
      width:'100%',
      paddingVertical:10,
      paddingHorizontal:0,
      marginBottom:30
    },
    editApplicantContainer:{
      backgroundColor:Colors.white,
      borderWidth:1,
      borderColor:Colors.darkGray,
      marginTop:20,
      width:'93%',
      paddingVertical:30,
      paddingLeft:20,
      paddingRight: 0, 
      marginBottom:30
    },
    guarantorContainer:{
      marginTop:20,
      width:'100%',
      paddingTop:10,
      paddingHorizontal:0,
      marginBottom: 50, 
      paddingBottom: 100,
      // backgroundColor:'red'
    },
    editGuarantorContainer:{
      backgroundColor:Colors.white,
      borderWidth:1,
      borderColor:Colors.darkGray,
      marginVertical:20,
      width:'93%',
      paddingTop:30,
      paddingLeft:20,
      paddingRight: 0, 
      // height:'100%'
    },
    editSisterConcernContainer:{
      backgroundColor:Colors.white,
      borderWidth:1,
      borderColor:Colors.darkGray,
      marginTop:20,
      width:'93%',
      paddingVertical:30,
      paddingLeft:20,
      paddingRight: 0, 
      marginBottom: 40
    },
    iconEdit:{
      position:'absolute',
      right:0,
      top:0
    },
    inputWidget:{

    },
    inputLable:{
      fontFamily: "Helvetica",
      color:Colors.darkGray,
      ...Fonts.style.small,
      marginBottom:2
    },
    inputValue:{
      fontFamily: "Helvetica",
      color:Colors.text,
      ...Fonts.style.normal,
      marginBottom:20
    },
    inputValueAddress:{
      fontFamily: "Helvetica",
      color:Colors.text,
      ...Fonts.style.normal,
      marginBottom:20,
      lineHeight:22,
      paddingRight:20
    },
    fileSizeError:{
      position:'absolute',
      color:Colors.error,
      left:0,
      bottom:-30,
      ...Fonts.style.small,
      fontFamily: "Helvetica",
      paddingBottom:10
    },

    redoUploadContainer:{
      backgroundColor:Colors.white,
      width:'93%',
      borderColor: "#e2e3e3", 
      borderWidth: 1,
      borderRadius:1,
      minHeight:100,
      marginTop:0,
      marginBottom:30,
      paddingHorizontal:20,
      paddingVertical:20
    },
    redoHeader:{
      ...Fonts.style.normal,
      fontFamily: "Helvetica",
      color:Colors.text,
      marginLeft:7
    },
    redoLabel:{
      ...Fonts.style.small,
      color:Colors.darkGray,
      marginBottom:5
    },
    redoValue:{
      ...Fonts.style.normal,
      color:Colors.text,
      paddingBottom:10,
      borderBottomColor:'#e2e3e3',
      borderBottomWidth:1,
      marginBottom:25
    },
    title: {
      ...Fonts.style.h1,
      color: Colors.text,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom:20
    },
    loading: { 
      backgroundColor:'rgba(0,0,0,0.5)',
      position: 'absolute', 
      left: 0, 
      right: 0, 
      top: 0, 
      bottom: 0, 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex:1 
    },



    accordionTitle:{
      fontFamily: "Helvetica",
      color:Colors.text,
      fontSize:14,
      fontWeight:'bold'
    },
    dropDownBorder: {
      width: '90%',
      borderBottomColor: Colors.darkGray,
      borderBottomWidth: 0.5,
      marginLeft: 10,
    },
    datePickerWidget: {
      marginVertical: 30,
      // width: width / 2
    },
    calendarLineWidget: {
      marginTop: -30,
      position: 'relative',
      zIndex: -1
    },
    calendarLine: {
      borderBottomColor: Colors.darkGray,
      borderBottomWidth: 1,
      textAlign: 'right',
      paddingBottom: 10,
    },
    icCalendar: {
      width: 18,
      height: 20,
      position: 'absolute',
      right: 0
    },
    heading: {
      ...Fonts.style.normal,
      color: Colors.text,
      fontFamily: "Helvetica",
      marginBottom: 16,
      marginTop: 10,
  },
    radioContainer:{
      flexDirection:'row',
      marginLeft:5
    },
    radioWidget:{
      flexDirection:'row',
      marginRight:30
    },
    radioButton:{
      width:30,
      height:30,
      borderColor:Colors.text,
    },
    radioLabel:{
      ...Fonts.style.normal,
      color:Colors.darken,
      fontFamily: "Helvetica",
      lineHeight:26
    },
    addressWidget: {
      flexDirection: 'row',
      marginTop: 55,
      marginBottom: 30,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: Colors.darkGray,
      paddingBottom: 10,
      marginLeft: 15
    },
    addressField: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width / 2,
      paddingTop: 2
    },
    addressLabel: {
      fontFamily: "Helvetica",
      color: Colors.text,
      ...Fonts.style.normal,
    },
    checkboxInput: {
      marginLeft: -10,
      borderColor: Colors.text,
      width: 20,
      height: 20,
      borderRadius: 2,
    },
    checkboxLabel: {
      ...Fonts.style.normal,
      marginLeft: 20,
      fontWeight:'bold'
    },
    bottomLine: {
      borderBottomColor: Colors.darkGray,
      borderBottomWidth: 0.5,
    },
    btnGurantorSaveDetails: {
      width: 150,
      height: 40,
      backgroundColor: '#9d1d28',
      color: '#fff',
      fontFamily: "Helvetica",
      fontSize: 14,
      fontWeight: '700',
      padding: 10,
      textAlign: 'center',
      borderRadius: 20
    },
    btnGurantorSaveDetailsDisable: {
      width: 150,
      height: 40,
      backgroundColor: '#ba636a',
      color: '#fff',
      fontFamily: "Helvetica",
      fontSize: 14,
      fontWeight: '700',
      padding: 10,
      textAlign: 'center',
      borderRadius: 20
    },
    inlineError:{
      fontFamily: "Helvetica",
      ...Fonts.style.small,
      color:Colors.error,
      marginTop:10,
      marginLeft:0,
      // position:'absolute'
   },
   mapContent: {
    flexDirection: 'row',
    marginHorizontal: 50,
    marginBottom: 60
  },
  mapView: {
    flex: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  locationDetailsWidget: {
    flex: 5,
    marginHorizontal: 20
  },
  icModalClose: {
    width: 18,
    height: 11,
  },
  icLocation: {
    width: 22,
    height: 22,
  },
  currentLocation: {
    flexDirection: 'row',
    marginBottom: 40
  },
  currentLocationText: {
    color: '#58595b',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10
  },
  locationItem: {
    marginBottom: 20
  },
  locationInput: {
    borderWidth: 0,
  },
  splitFields: {
    flexDirection: 'row', 
    marginBottom: 20
  },
  halfWidth: { 
    width:'48%'
  },
  middleSpace: {
    width:'4%'
  },
  icMarker: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginTop: -35
  },
  // selectWidget:{
  //   width:'50%',
  //   marginBottom:0,
  //   marginLeft:20
  // },
  pickerSelectedItem: {
    position: 'relative',
    top: 25,
    left: -5,
    color: '#58595b',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: "Helvetica",
    //width: width / 4.5,
    },
})

