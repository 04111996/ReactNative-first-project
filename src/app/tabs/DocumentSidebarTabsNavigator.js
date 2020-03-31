import React from 'react';
import { createNavigator, TabRouter, SafeAreaView } from 'react-navigation';
import {Dimensions} from 'react-native';
import DocumentSidebarTab from './DocumentSidebarTab';

const width = Dimensions.get('window').width; //full width

const DocumentSidebarTabsNavigator = ({ navigation, descriptors}) => {
  const { routes, index } = navigation.state;
  const descriptor = descriptors[routes[index].key];
  const ActiveScreen = descriptor.getComponent();
 
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row'}}>
        <DocumentSidebarTab
          descriptors={descriptors}
          navigation={navigation}
        />
        <ActiveScreen navigation={descriptor.navigation} />
    </SafeAreaView>
  );
};

    const createDocumentSidebarNavigator = (routeConfigMap, sidebarNavigatorConfig) => {
    const customTabRouter = TabRouter(routeConfigMap, sidebarNavigatorConfig);
    return createNavigator(DocumentSidebarTabsNavigator, customTabRouter, {});
};

export default createDocumentSidebarNavigator;
