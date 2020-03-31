import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, Image} from 'react-native';
import OnlineSvgImage from '../assets/images/icon_onlone.svg';
import OfflineSvgImage from '../assets/images/icon_offline.svg';

class NetworkStatus extends Component {
  render() {
    if (this.props.isInternetReachable) {
      return (
        <View style={styles.networkStatus}>
          <OnlineSvgImage style={styles.onlineCircle} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.networkStatus}>
          <OfflineSvgImage style={styles.offlineCircle} />
          <Text style={styles.onlineText}>Offline</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  networkStatus: {
    paddingHorizontal: 20,
    // borderRightColor: '#ccc',
    // borderRightWidth: 1,
    flexDirection: 'row',
  },
  onlineCircle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    alignSelf: 'center',
    margin: 5,
  },
  onlineText: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    color: '#58595b',
  },
  offlineCircle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    alignSelf: 'center',
    margin: 5,
  },
});

const mapStateToProps = state => {
  return {
    isInternetReachable: state.networkStatus.isInternetReachable,
  };
};

export default connect(mapStateToProps)(NetworkStatus);
