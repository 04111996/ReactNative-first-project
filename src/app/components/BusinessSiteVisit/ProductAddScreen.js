import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database1 from '../../Database/Services/BusinessSiteVisit/Database1';

const db = new Database1();

export default class ProductAddScreen extends Component {
  static navigationOptions = {
    title: 'Add Product',
  };
  constructor() {   
    super();
    this.state = {
      prodId: '',
      prodName: '',
      prodDesc: '',
      prodImage: '',
      prodPrice: '0',
      isLoading: false,
    };
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }
  
  saveProduct() {
    const { navigation } = this.props;
    this.setState({
      isLoading: true,
    });
    let data = {
      prodId: this.state.prodId,
      prodName: this.state.prodName,
      prodDesc: this.state.prodDesc,
      prodImage: this.state.prodImage,
      prodPrice: this.state.prodPrice
    }
    db.addProduct(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
    //   this.props.navigation.state.params.onNavigateBack;
    // this.props.navigation.goBack();
      this.props.navigation.navigate('Product');
        })
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Product ID'}
              value={this.state.prodId}
              onChangeText={(text) => this.updateTextInput(text, 'prodId')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Product Name'}
              value={this.state.prodName}
              onChangeText={(text) => this.updateTextInput(text, 'prodName')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Product Description'}
              value={this.state.prodDesc}
              onChangeText={(text) => this.updateTextInput(text, 'prodDesc')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Product Image'}
              value={this.state.prodImage}
              onChangeText={(text) => this.updateTextInput(text, 'prodImage')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Product Price'}
              value={this.state.prodPrice}
              keyboardType='numeric'
              onChangeText={(text) => this.updateTextInput(text, 'prodPrice')}
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'save'}}
            title='Save'
            onPress={() => this.saveProduct()} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})