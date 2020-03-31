import React, {Component, Fragment} from 'react';
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet, 
} from 'react-native';
import IconArrowDown from '../../assets/images/icon_arrow_down.svg';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';

const defaultItemValue = {
  branchName: '',
  branchCode: '',
};

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.renderTextInput = this.renderTextInput.bind(this);
    this.renderFlatList = this.renderFlatList.bind(this);
    this.searchedItems = this.searchedItems.bind(this);
    this.renderItems = this.renderItems.bind(this);

    this.state = {
      item: {},
      listItems: [],
      focus: false,
    };
  }

  renderFlatList = () => {
    if (this.state.focus) {
      const flatListPorps = {...this.props.listProps};
      const oldSupport = [
        {key: 'keyboardShouldPersistTaps', val: 'always'},
        {key: 'nestedScrollEnabled', val: false},
        {key: 'style', val: {...this.props.itemsContainerStyle}},
        {key: 'data', val: this.state.listItems},
        {key: 'keyExtractor', val: (item, index) => index.toString()},
        {
          key: 'renderItem',
          val: ({item, index}) => this.renderItems(item, index),
        },
      ];
      oldSupport.forEach(kv => {
        if (!Object.keys(flatListPorps).includes(kv.key)) {
          flatListPorps[kv.key] = kv.val;
        } else {
          if (kv.key === 'style') {
            flatListPorps.style = kv.val;
          }
        }
      });
      return <FlatList {...flatListPorps} />;
    }
  };

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex],
      });
    } else {
      this.setState({listItems});
    }
  };

  searchedItems = searchedText => {
    let setSort = this.props.setSort;
    if (!setSort && typeof setSort !== 'function') {
      setSort = (item, searchedText) => {
        return item.branchName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
      };
    }
    var ac = this.props.items.filter(item => {
      return setSort(item, searchedText);
    });
    let item = {
      branchCode: '',
      branchName: searchedText,
    };
    this.setState({listItems: ac, item: item});
    const onTextChange =
      this.props.onTextChange ||
      this.props.textInputProps.onTextChange ||
      this.props.onChangeText ||
      this.props.textInputProps.onChangeText;
    if (onTextChange && typeof onTextChange === 'function') {
      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }
  };

  renderItems = (item, index) => {
    if (
      this.props.multi &&
      this.props.selectedItems &&
      this.props.selectedItems.length > 0
    ) {
      return this.props.selectedItems.find(sitem => sitem.branchCode === item.branchCode) ? (
        <TouchableOpacity
          style={{...this.props.itemStyle, flex: 1, flexDirection: 'row'}}>
          <View
            style={{flex: 0.9, flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text>{item.branchName}</Text>
          </View>
          <View
            style={{flex: 0.1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() =>
                setTimeout(() => {
                  this.props.onRemoveItem(item, index);
                }, 0)
              }
              style={{
                backgroundColor: '#f16d6b',
                alignItems: 'center',
                justifyContent: 'center',
                width: 25,
                height: 25,
                borderRadius: 100,
                marginLeft: 10,
              }}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({item: item});
            setTimeout(() => {
              this.props.onItemSelect(item);
            }, 0);
          }}
          style={{...this.props.itemStyle, flex: 1, flexDirection: 'row'}}>
          <View
            style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text>{item.branchName}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{...this.props.itemStyle}}
          onPress={() => {
            this.setState({item: item, focus: false});
            Keyboard.dismiss();
            setTimeout(() => {
              this.props.onItemSelect(item);
              if (this.props.resetValue) {
                this.setState({focus: true, item: defaultItemValue});
                this.input.focus();
              }
            }, 0);
          }}>
          {this.props.selectedItems &&
          this.props.selectedItems.length > 0 &&
          this.props.selectedItems.find(x => x.branchCode === item.branchCode) ? (
            <Text style={{...this.props.itemTextStyle}}>{item.branchName}</Text>
          ) : (
            <Text style={{...this.props.itemTextStyle}}>{item.branchName}</Text>
          )}
        </TouchableOpacity>
      );
    }
  };

  renderListType = () => {
    return this.renderFlatList();
  };

  renderTextInput = () => {
    const textInputProps = {...this.props.textInputProps};
    const oldSupport = [
      {key: 'ref', val: e => (this.input = e)},
      {
        key: 'onTextChange',
        val: text => {
          this.searchedItems(text);
        },
      },
      {key: 'underlineColorAndroid', val: this.props.underlineColorAndroid},
      {
        key: 'onFocus',
        val: () => {
          this.props.onFocus && this.props.onFocus();
          this.setState({
            focus: true,
            item: defaultItemValue,
            listItems: this.props.items,
          });
        },
      },
      {
        key: 'onBlur',
        val: () => {
          this.props.onBlur && this.props.onBlur();
          this.setState({focus: false});
        },
      },
      {
        key: 'value',
        val: this.state.item.branchName,
      },
      {
        key: 'style',
        val: {...this.props.textInputStyle},
      },
      {
        key: 'placeholderTextColor',
        val: this.props.placeholderTextColor,
      },
      {
        key: 'placeholder',
        val: this.props.placeholder,
      },
    ];
    oldSupport.forEach(kv => {
      if (!Object.keys(textInputProps).includes(kv.key)) {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps.onChangeText = kv.val;
        } else {
          textInputProps[kv.key] = kv.val;
        }
      } else {
        if (kv.key === 'onTextChange' || kv.key === 'onChangeText') {
          textInputProps.onChangeText = kv.val;
        }
      }
    });
    return  <View>
              <Text style={[this.state.focus ? styles.focusedLabel : styles.nonFocusedLabel]}>Branch Name</Text>
              <TextInput  {...textInputProps} />
            </View>
  };

  render = () => {
    return (
      <Fragment>
        <View
          keyboardShouldPersist="always"
          style={{marginTop: 40, ...this.props.containerStyle}}>
          <IconArrowDown
            style={[this.state.focus ? styles.focusedIcon : styles.nonFocusedIcon]}
          />
          <View style={{marginTop: -40}}>
            {this.renderSelectedItems()}
            {this.renderTextInput()}
            {this.renderListType()}
          </View>
        </View>
      </Fragment>
    );
  };
  renderSelectedItems() {
    let items = this.props.selectedItems;
    if (
      items !== undefined &&
      items.length > 0 &&
      this.props.chip &&
      this.props.multi
    ) {
      return (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingBottom: 10,
            marginTop: 5,
          }}>
          {items.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: item.name.length * 8 + 60,
                  justifyContent: 'center',
                  flex: 0,
                  backgroundColor: '#eee',
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 5,
                  padding: 8,
                  borderRadius: 15,
                }}>
                <Text style={{color: '#555'}}>{item.branchName}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setTimeout(() => {
                      this.props.onRemoveItem(item, index);
                    }, 0)
                  }
                  style={{
                    backgroundColor: '#f16d6b',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 25,
                    height: 25,
                    borderRadius: 100,
                    marginLeft: 10,
                  }}>
                  <Text>X</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  focusedLabel: {
    fontFamily: "Helvetica",
    color:Colors.text,
    ...Fonts.style.normal,
    marginLeft:0,
    marginBottom: -25, 
    fontWeight:'normal', 
    color:Colors.text, 
  },
  nonFocusedLabel: {
    color:Colors.darkenGray,
    fontSize:11,
    fontFamily: "Helvetica",
    marginLeft:0,      
    marginTop:0, 
    marginBottom: -25, 
    ...Fonts.style.normal, 
    fontWeight:'normal', 
    color:Colors.text,
  },
  focusedIcon: {
    width: 22,
    height: 22,
    position: 'absolute',
    right: 0,
    // bottom: 10,
    // top: -15
  },
  nonFocusedIcon: {
    width: 22,
    height: 22,
    position: 'absolute',
    right: 0,
    // bottom: 20,
    top: -20
  },

});

