import React from 'react';
import {Picker} from 'native-base';
import {StyleSheet, Dimensions, View, Text} from 'react-native';

const width = Dimensions.get('window').width;

const Dropdown = props => {
  // alert(props.selectedValue)
  return (
    <View>
      {props.selectedValue != '0' &&
      props.selectedValue != '' &&
      props.selectedValue != 'null' ? (
        <Text
          style={{
            //color: Colors.text,
            // position: 'relative',
            top: 30,
            left: 5,
            fontSize: 11,
            color: '#9c9ea0',
          }}>
          {props.title}
        </Text>
      ) : (
        <Text
          style={{
            top: 30,
            left: 5,
            fontSize: 11,
            color: '#9c9ea0',
          }}>
          {''}
        </Text>
      )}
      <Picker
        itextStyle={{color: '#5cb85c'}}
        itemStyle={{
          backgroundColor: '#d3d3d3',
          marginLeft: 0,
        }}
        placeholderStyle={{color: '#bfc6ea'}}
        style={props.style}
        selectedValue={props.selectedValue}
        onValueChange={props.onValueChange}
        enabled={props.enabled}>
        {props.data.map(obj => {
          return (
            <Picker.Item
              label={obj.type}
              value={obj.value}
              style={{backgroundColor: 'red'}}
            />
          );
        })}
        {/* {props.industryTypeList.map(industryType => {
                    return (
                        <Picker.Item label={industryType.industryDescription} value={industryType.industryCode} style={{ backgroundColor: 'red' }} />
                    )
                })} */}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerSelectedItem: {
    position: 'relative',
    top: 25,
    left: -5,
    color: '#58595b',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    width: width / 1.92,
  },
});

export default Dropdown;
