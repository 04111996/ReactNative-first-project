import { StyleSheet, Dimensions } from 'react-native'
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import ApplicationStyles from '../../styles/ApplicationStyles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    gstnContainer: {
    ...ApplicationStyles.screen.container,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  nextRelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  navigationContainer: {
    flex: 1,
    position: 'absolute',
    // backgroundColor:'red',
    height: '100%',
    width: '100%',
  },
  Container: {
    flex: 1,
  },
  uparrowContainer: {
    padding: 40,
  },
  selectWidget: {
    width: "50%",
    //flex: 0.5,
    marginBottom: 0,
    marginLeft: 20,
    //   backgroundColor: 'green'
  },
  checkboxWidget: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'absolute',
   paddingRight:50,
    top: 28
  },
  btnResetDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    color: '#9d1d28',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9d1d28',
    marginLeft: 30
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    marginRight: 20
  },
  addGurantorText: {
    ...Fonts.style.normal,
    color: Colors.text,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    paddingLeft: 8
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
  calendarLineWidget: {
    // marginTop: -30,
    // position: 'relative',
    // zIndex: -1
  },
  
  datePickerWidget: {
    //marginVertical: 30,
    //width: width / 2,
    width: "50%",
    marginLeft: 20,
    marginBottom: 0,
  },
  CheckboxContainer: {
    flex: 1,
    
   
    justifyContent: 'space-between',
    paddingTop: (Platform.OS === 'ios') ? 25 : 0
  },
  labelFocus: {
   
     color: Colors.text,
     fontFamily: 'Helvetica',
    fontSize: 14,
  
    marginLeft: -3,
    // marginBottom: 5,
    // marginTop: 0,
    // backgroundColor: 'red'
  },
  checkboxInput: {
    
    borderColor: Colors.text,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  checkboxLabel: {
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
     marginLeft: 25,
    // width: '30%'
  },
  checkboxWidget1: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'absolute',
   paddingRight:100,
    top: 28
    
  },
  checkboxInput1: {
   
    borderColor: Colors.text,
    width: 20,
    height: 20,
    borderRadius: 2,
  },
  checkboxLabel1: {
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
     marginLeft: 25,
  
  },
  calendarLineWidget: {
    marginTop: -30,
    position: 'relative',
    zIndex: -1
  },
  heading: {
    color: Colors.text,
    fontFamily: 'Helvetica',
   fontSize: 14,
   
  },
  primaryContact: {
    position: 'relative',
    width: width / 2,
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    
  },
  radioWidget: {
    flexDirection: 'row',
    marginRight: 30
  },
  radioButton: {
    width: 30,
    height: 30,
    borderColor: Colors.text,
  },
  radioLabel: {
    color: Colors.text,
     fontFamily: 'Helvetica',
    fontSize: 14,
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
  collateralContainer: {
    // backgroundColor:'red',
    flexDirection: 'column',
    flex: 1,
    // width: width / 2,
    marginHorizontal: 25,
    // height:height-280,
    minHeight: height - 280,
    paddingRight: 8,
    paddingLeft: 8,
    marginRight:10,
    // overflow:'scroll'
  },
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
  bottomLine: {
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1
  },

  downarrowContainer: {
    position: 'absolute',
    padding: 40,
    bottom: 0,
  },
  imgLegal: {
    width: 79,
    height: 81,
    alignSelf: 'center',
    marginBottom: 30,
  },
  businessContainer: {
    flex: 1,
    flexDirection: 'column',
    //height: height - 310,
    //   marginHorizontal: 40,
    width: width / 2,
    //paddingHorizontal: 15,
    // backgroundColor:"red"
    marginHorizontal: 25,
    marginTop: 10,
    justifyContent: 'center',


  },
  title: {
    ...Fonts.style.h1,
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom:20,
    marginLeft:30
  },
  comingSoonTitle: {
    color: '#4a4a4a',
    fontFamily: 'Helvetica',
    fontSize: 18,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 5,
  },
  comingSoonDesc: {
    color: '#6b6b6b',
    fontFamily: 'Helvetica',
    fontSize: 18,
    alignSelf: 'center',
  },
})

