import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import NetworkStatusToast from '../NetworkStatusToast';
import styles from './VintageProofComponentStyle';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class VintageProofComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLayout: '',
    }
  }
  componentDidMount() {


  }
  

  render() {
    
    return (
        <View style={styles.Container}>
        <View style={styles.nextRelContainer}>
          <View style={styles.nextRelImage}>
            <Image
              style={styles.imgLegal}
              source={require('../../assets/images/icon_legal.png')}
            />
            <Text style={styles.comingSoonTitle}>
              Coming soon in the next release
            </Text>
            <Text style={styles.comingSoonDesc}>
              We will let you know when there{' '}
            </Text>
            <Text style={styles.comingSoonDesc}>
              will be something new for you
            </Text>
          </View>
        </View>
      </View>

    );
  }
}
