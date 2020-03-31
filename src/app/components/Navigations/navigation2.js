import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AddCase from '../addCase/addCaseComponent';
import  Notification from '../notifications/Notifications';
import Calendar from '../meetings/Calendar';
import HeaderComponent from '../header/header';

const AppNavigator = createStackNavigator(
  {
    AddCase: AddCase,
    Notification: Notification,
    Calendar: Calendar,
    Header:HeaderComponent
      },
  {
    initialRouteName: 'AddCase',
  }
);

export default createAppContainer(AppNavigator);