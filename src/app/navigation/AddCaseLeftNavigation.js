import React from 'react';

import { createAppContainer } from 'react-navigation';
import {
  Animated,
  Easing,
  Platform
} from 'react-native'
import { createAddCaseSidebarNavigator } from '../tabs';
import { Business, Financials, Collateral, EntityDetails, ExistingLimit } from '../components/dashboard/myCaseFiles/AddCase';
/*let MyTransition = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = position.interpolate({
        inputRange,
        outputRange: [.8, 1, 1],
    });

    const scaleY = position.interpolate({
        inputRange,
        outputRange: ([0.8, 1, 1]),
    });

    return {
        opacity,
        transform: [
            {scaleY}
        ]
    };
};
let TransitionConfiguration = () => {
    return {
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {

            const {position, scene} = sceneProps;
            const {index, route} = scene
            const params = route.params || {}; // <- That's new
            const transition = params.transition || 'default'; // <- That's new

            return {
                myCustomTransition: MyCustomTransition(index, position),
                default: MyTransition(index, position),
            }[transition];
        }
    }
};*/
let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 1]),
  });

  return {
    opacity,
    transform: [
      { scaleY }
    ]
  };
};

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })
  const slideFromRight = { transform: [{ translateX }] }
  return slideFromRight
};

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width),
      }[transition];
    },
  }
}




const addNewCaseNavigator = createAddCaseSidebarNavigator(
  {
    EntityDetails: {
      screen: EntityDetails,
      params: {
        tabName: 'Entity Details',
      },
      header: null,
    },
    Financials: {
      screen: Financials,
      params: {
        tabName: 'Financials',
      },
      header: null,
    },
    Collateral: {
      screen: Collateral,
      params: {
        tabName: 'Collateral',
      },
      header: null,
    },
    ExistingLimit: {
      screen: ExistingLimit,
      params: {
        tabName: 'Existing Limit',
      },
      header: null,
    },
    Business: {
      screen: Business,
      params: {
        tabName: 'Business',
      },
      header: null,

    },
  },
{

},

  // {
  //   initialRouteName: 'EntityDetails',
  //   header: null,
  //   headerMode: 'none',
  // },
  // {
  //   transitionConfig: TransitionConfiguration,

  // },
  // {

  // }


);

export default addNewCaseNavigator;
// export default createAppContainer(sidebarNavigator);
