import React ,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image
} from 'react-native';
import styles from './bankStatementsStatusComponentStyle';
import IconSuccess from '../../assets/images/icon_success.svg';
import IconProgress from '../../assets/images/icon_progress.svg';
const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class bankStatementsStatusComponent extends Component {
  static navigationOptions = {
        header: null
    }
    constructor(props) {
      super(props);
    }

    render(){
      return (
        <View style={styles.documentStatusWidget}>
            <Text style={styles.docTitle}> Document Status</Text>
            <View style={styles.docStatusTextWidget}>
              <Text>
                <IconSuccess style={styles.icSuccess} />
              </Text>
              <Text style={styles.docStatusText}>Applicant Details Submitted</Text>
            </View>
            <View style={styles.verticalBarWidget}>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
            </View>
            <View style={styles.docStatusTextWidget}>
              <Text>
                <IconProgress style={styles.IconProgress} />
              </Text>
              <Text style={styles.docStatusText}>PAN Validation In Progress</Text>
            </View>
            <View style={styles.verticalBarWidget}>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
              <Text style={styles.verticalBar}></Text>
            </View>
            <View style={styles.docStatusTextWidget}>
              <Text>
                <IconSuccess style={styles.IconProgress} />
              </Text>
              <Text style={styles.docStatusText}>Signed Consent form Uploaded</Text>
            </View>
        </View>
      );
    }
    
  }

  