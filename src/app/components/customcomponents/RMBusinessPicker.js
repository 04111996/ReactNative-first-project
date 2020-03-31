import React from 'react';
import { Picker, Icon } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

const RMBusinessPicker = props => {
    console.log('facilityTypeList : ', props.selectedValue)
    return (
        <Picker
            itemTextStyle={{ color: '#f00' }}
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={props.style}
            selectedValue={props.selectedValue}
            onValueChange={props.onValueChange}
            enabled={props.enabled}
        >
            {props.businessTypeList && props.businessTypeList.length>0 && props.businessTypeList.map(businessType => {
                return (
                    <Picker.Item label={businessType.businessType} value={businessType.businessCode} style={{ backgroundColor: 'red' }} />
                )
            })}
             {props.facilityTypeList && props.facilityTypeList.length > 0 && props.facilityTypeList.map(facilityType => {
                //  alert(JSON.stringify(facilityType))
                return (
                    <Picker.Item label={facilityType.facilityType} value={facilityType.facilityCode} style={{ backgroundColor: 'red' }} />
                )
            })}
            {props.gender && props.gender.length > 0 && props.gender.map(obj => {
                //  alert(JSON.stringify(facilityType))
                return (
                    <Picker.Item label={obj.type} value={obj.value} style={{ backgroundColor: 'red' }} />
                )
            })}
        </Picker>
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
        fontFamily: "Helvetica",
        width: width / 1.92
    },
})

export default RMBusinessPicker;