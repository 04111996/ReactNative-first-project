import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import OnlineSvg from '../assets/images/icon_onlone.svg';
import OfflineSvg from '../assets/images/icon_offline.svg';
import CloseImage from '../assets/images/icon_close_copy_2.svg';
import {
  Container,
  Header,
  Content,
  Toast,
  Button,
  Text,
  CardItem,
  Card,
  Right,
} from 'native-base';
import {updateVisibility} from '../constants/NetworkStatus/index';

class NetworkStatusToast extends Component {
  handleNetworkStatusChange = () => {
    setTimeout(() => {
      this.props.updateVisibility(false);
    }, 3000);
  };
  handleOnClick = () => {
    this.props.updateVisibility(false);
  };
  render() {
    if (this.props.isInternetReachable && this.props.isVisible) {
      this.handleNetworkStatusChange();
      return (
        <View style={styles.cardContainerStyle}>
          <Card style={styles.cardStyle}>
            <View style={styles.networkStatus}>
              <OnlineSvg style={styles.onlineCircle} />
              <Text>Your'e online</Text>
              <TouchableOpacity
                style={styles.opacityStyle}
                onPress={() => this.handleOnClick()}>
                <CloseImage style={styles.closeImage} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      );
    }
    if (!this.props.isInternetReachable && this.props.isVisible) {
      this.handleNetworkStatusChange();
      return (
        <View style={styles.cardContainerStyle}>
          <Card style={styles.cardStyle}>
            <View style={styles.networkStatus}>
              <OfflineSvg style={styles.offlineCircle} />
              <Text>Your'e offline</Text>
              <TouchableOpacity
                style={styles.opacityStyle}
                onPress={() => this.handleOnClick()}>
                <CloseImage style={styles.closeImage} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  networkStatus: {
    padding: 20,
    flexDirection: 'row',
  },
  onlineCircle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    alignSelf: 'center',
    margin: 5,
    paddingRight: 30,
  },
  onlineText: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    color: '#58595b',
  },
  closeImage: {
    width: 10,
    height: 10,
    //alignSelf: 'center',
    paddingLeft: 70,
  },
  offlineCircle: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    alignSelf: 'center',
    margin: 5,
    paddingRight: 30,
  },
  cardStyle: {
    width: 200,
    position: 'absolute',
    alignItems: 'center',
  },
  cardContainerStyle: {
    alignItems: 'flex-end',
    marginRight: 15,
  },
  opacityStyle: {
    height: '100%',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    isInternetReachable: state.networkStatus.isInternetReachable,
    isVisible: state.networkStatus.isVisible,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateVisibility: isVisible => {
      dispatch(updateVisibility(isVisible));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkStatusToast);
