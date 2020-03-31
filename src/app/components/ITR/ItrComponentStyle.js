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

