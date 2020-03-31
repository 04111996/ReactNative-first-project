import React from 'react';

import { createNavigator, TabRouter, SafeAreaView } from 'react-navigation';
import {Dimensions} from 'react-native';
import AddCaseSidebarTabs from './AddCaseSidebarTabs';

const width = Dimensions.get('window').width; //full width
const AddCaseSidebarTabsNavigator = ({ navigation, descriptors}) => {
  const { routes, index } = navigation.state;
  const descriptor = descriptors[routes[index].key];

  const ActiveScreen = descriptor.getComponent();
 
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row'}}>
        <AddCaseSidebarTabs
          descriptors={descriptors}
          navigation={navigation}
        />
        <ActiveScreen navigation={descriptor.navigation} />
    </SafeAreaView>
  );
};

const createAddCaseSidebarNavigator = (routeConfigMap, sidebarNavigatorConfig) => {
  const customTabRouter = TabRouter(routeConfigMap, sidebarNavigatorConfig);
  return createNavigator(AddCaseSidebarTabsNavigator, customTabRouter, {});
};

export default createAddCaseSidebarNavigator;
