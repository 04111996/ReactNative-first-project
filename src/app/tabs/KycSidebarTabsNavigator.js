import React from 'react';
import { createNavigator, TabRouter, SafeAreaView } from 'react-navigation';
import {Dimensions,StyleSheet} from 'react-native';
import KycSidebarTab from './KycSidebarTab';

const width = Dimensions.get('window').width; //full width

const KycSidebarTabsNavigator = ({ navigation, descriptors}) => {
  const { routes, index } = navigation.state;
  const descriptor = descriptors[routes[index].key];
  const ActiveScreen = descriptor.getComponent();
 
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row'}}>
        <KycSidebarTab
          descriptors={descriptors}
          navigation={navigation}
        />
        <ActiveScreen navigation={descriptor.navigation} />
    </SafeAreaView>
  );
};

    const createKycSidebarNavigator = (routeConfigMap, sidebarNavigatorConfig) => {
    const customTabRouter = TabRouter(routeConfigMap, sidebarNavigatorConfig);
    return createNavigator(KycSidebarTabsNavigator, customTabRouter, {});
};

export default createKycSidebarNavigator;
