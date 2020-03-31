import React from 'react';

import { createAppContainer } from 'react-navigation';
import {
  Animated,  
  Easing,  
  Platform
} from 'react-native' 
import { createDocumentSidebarNavigator } from '../tabs';
import {Documents,Legal,SanctionLetter,Technical} from '../components/Documentation';
import {BusinessSiteVisitReport} from '../components/BusinessSiteVisit'

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



//Documents,Legal,SanctionLetter,Technical
const sidebarNavigator = createDocumentSidebarNavigator(
  {
    Documents: {
      screen: Documents,
      params: {
        tabName: 'Documents',
      },
    },
    Legal : {
      screen: Legal,
        params: {
            tabName: 'Legal and Technical',
        }
    },
    SanctionLetter : {
      screen: SanctionLetter,
        params: {
            tabName: 'Sanction Letter',
        }
    },
    BusinessSiteVisitReport : {
      screen: BusinessSiteVisitReport,
        params: {
            tabName: 'Business Site Visit Report',
        }
    },
    // Technical : {
    //   screen: Technical,
    //     params: {
    //         tabName: 'Technical',
    //     }
    // },
  },
 
  {
    initialRouteName: 'Documents',
  },
  {
transitionConfig: TransitionConfiguration,
 
  },
  {
   
  } 
  
   
);
export default sidebarNavigator;
//export default createAppContainer(sidebarNavigator);
