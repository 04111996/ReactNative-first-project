import { StyleSheet, Dimensions } from 'react-native'
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import ApplicationStyles from '../../styles/ApplicationStyles';
import { gray } from 'ansi-colors';
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
  kycContainer: {
    flex: 1,
    backgroundColor: Colors.contentBgColor,
  },
  leftNav: {
    backgroundColor: '#9d1d28',
    flex: 1,
    height: height,
  },
  mainContent: {
    flex: 6.2,
    height: height
  },
  addCaseContainerSpacing: {
    justifyContent: 'center',
    flex: 1
  },
  title: {
    ...Fonts.style.h1,
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom:20
  },
  kycFormContainer: {
    backgroundColor: Colors.contentBgColor,
    width: '73%'
  },
  documentStatusContainer: {
    backgroundColor: Colors.white,
    width: '27%',
    height: height
  },
  docTitle: {
    ...Fonts.style.small,
    color: Colors.darkenGray,
    paddingHorizontal: 20,
    fontFamily: "Helvetica",
  },
  kycTabNav: {
    flexDirection: 'row'
  },
  kycTabNavItem: {
    ...Fonts.style.normal,
    color: Colors.text,
    marginRight: 20,
    fontFamily: "Helvetica",
  },
  kycTabNavItemSelected: {
    ...Fonts.style.normal,
    color: Colors.text,
    marginRight: 20,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    paddingBottom: 8,
    borderBottomColor: Colors.text,
    borderBottomWidth: 1.5
  },
  inputFloatingItem: {
    borderColor: "transparent",
    paddingVertical: 0
  },
  label: {
    fontFamily: "Helvetica",
    color: Colors.text,
    ...Fonts.style.normal,
    marginTop: -10,
    marginLeft: -3,
    marginBottom: 5,
  },
  labelFocus: {
    color: Colors.darkenGray,
    fontSize: 11,
    marginLeft: -3,
    marginBottom: 5,
    marginTop: 0,
  },
  focusedTextInput: {
    marginTop: -10,
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingTop: 10
  },
  textInput: {
    marginTop: -10,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingTop: 10
  },
  focusedTextInputPhone: {
    marginTop: -10,
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 30,
    paddingTop: 10
  },
  textInputPhone: {
    marginTop: -10,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 30,
    paddingTop: 10
  },
  focusedTextInputPan: {
    marginTop: -10,
    borderBottomColor: Colors.yellow,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingTop: 10,
    // textTransform:'uppercase'
  },
  textInputPan: {
    marginTop: -10,
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 0.5,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingTop: 10,
    // textTransform:'uppercase'
  },
  phoneNumberPrefix: {
    position: 'relative',
    bottom: 39,
    left: 15,
    ...Fonts.style.normal,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    color: Colors.text
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
  icAddressWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  icAddress: {
    width: 22,
    height: 22,
    position: 'absolute',
    right:-25,
  },
  addressText: {
    color: Colors.text,
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
  },

  uploadFormWidget: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
    paddingBottom: 10,
    marginLeft: 15,
    marginTop: 0
  },
  signedInputLabel: {
    fontFamily: "Helvetica",
    color: Colors.text,
    ...Fonts.style.normal,
  },
  signedInputLabelFocus: {
    fontFamily: "Helvetica",
    color: Colors.darkenGray,
    ...Fonts.style.normal,
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
    // marginRight:20
  },
  btnSaveDetailsDisable: {
    width: 150,
    height: 40,
    backgroundColor: '#d8ada1',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 0
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
    ...Fonts.style.normal,
    color: Colors.darken,
    fontFamily: "Helvetica",
    lineHeight: 26
  },
  datePickerWidget: {
    marginTop: 10,
    marginBottom: 40,
    marginLeft: 15
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
  addGurantorText: {
    ...Fonts.style.normal,
    color: Colors.text,
    fontFamily: "Helvetica",
    fontWeight: 'bold',
    paddingLeft: 8
  },
  modal: {
    height: height - 100,
    width: width,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'scroll',
    height: 280
  },
  modalOverlayBtn: {
    width: '100%',
    height: '100%'
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
    alignItems: undefined,
    justifyContent: undefined,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: "Helvetica",
    ...Fonts.style.h1,
    fontWeight: 'bold'
  },
  uploadWidget: {
    alignItems: 'center',
    // borderRightWidth:1,
    // borderRightColor:'red'
  },
  uploadWidgetSeparator: {
    backgroundColor: Colors.darkenGray,
    position: 'absolute',
    right: -40,
    height: 80,
    width: 1
  },
  iconSpace: {
    marginBottom: 20,
    minHeight: 45,
    // backgroundColor:'red'
  },
  checkboxWidget: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'absolute',
    right: 0,
    top: 28
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
  },
  fileSizeError: {
    position: 'absolute',
    color: Colors.error,
    left: 0,
    top: 40,
    ...Fonts.style.small,
    fontFamily: "Helvetica",

  },
  inlineError: {
    ...Fonts.style.small,
    fontFamily: "Helvetica",
    color: Colors.error,
    position: 'relative',
    top: 15,
    left: 15
  },
  pdf: {
    flex: 1,
    width: width,
    height: height
  },
  modalWidget: {
    backgroundColor: 'red',
    height: height,
    flex: 0.5,
    margin: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 50,
    marginVertical: 50,
    alignItems: 'center',
  },
  modalOverlayBtn: {
    width: '100%',
    height: '100%'
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  modalTitle: {
    color: Colors.text,
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 'bold'
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
    // borderBottomColor: Colors.primary,
    // borderBottomWidth: 0.5,
    // marginTop:-10
  },
  btnSaveDetails: {
    width: 150,
    height: 40,
    marginTop: 20,
    backgroundColor: '#9d1d28',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
  },
  btnSaveDetailsDisable: {
    width: 150,
    height: 40,
    marginTop: 20,
    backgroundColor: '#ba636a',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: '700',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
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
  icMarker: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    marginTop: -35
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
  btnSubmitDetails: {
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

  btnSubmitDetailsDisable: {
    width: 150,
    height: 40,
    backgroundColor: '#ba636a',
    color: '#fff',
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    borderRadius: 20
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
  addressIcon:{
    position:'absolute',
    right:-35
  },
  addressIconEdit:{
    position:'absolute',
    right:30
  },
  addressIconGuarantor:{
    position:'absolute',
    right:0
  },
  addressIconEditGuarantor:{
    position:'absolute',
    right:60
  },
  iconUploadTouchable:{
    width: '76.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'blue'
  },
  iconUploadTouchableEdit:{
    width: '77%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'blue'
  },
  iconUpload:{
    position:'absolute',
    right:0
  },
  iconUploadAdded:{
    position:'absolute',
    right:0
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
})

