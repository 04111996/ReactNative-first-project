import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database1 from '../../Database/Services/BusinessSiteVisit/Database1';
import { withNavigation } from 'react-navigation'; 
import { createStackNavigator } from 'react-navigation';

const db = new Database1();

 class ProductScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {  
      title: 'Product List',
      headerRight: (
        <Button 
           
          icon={{ name: 'add-circle' }}
          onPress={() => { 
            navigation.navigate('AddProduct', {
              onNavigateBack: this.handleOnNavigateBack
            }); 
          }}
        />
      ),
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      products: [],
      notFound: 'Products not found.\nPlease click (+) button to add it.'
    };
  }

  componentDidMount() {
      this.getProducts();

  }

  getProducts() {
    let products = [];
    db.listProduct().then((data) => {
      products = data;
      this.setState({
        products,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.prodName}
      leftAvatar={{
        source: item.prodImage && { uri: item.prodImage },
        title: item.prodName[0]
      }}
      onPress={() => {
        this.props.navigation.navigate('ProductDetails', {
          prodId: `${item.prodId}`,
        });
      }}
      chevron
      bottomDivider
    />
  )

  render() {
    const { navigate } = this.props.navigation;

    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.products.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      )
    }
    return (
        <View>
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.products}
        renderItem={this.renderItem}
      />
       <Button
         
         icon={{ name: 'add-circle' }}
      onPress={()=>navigate('AddProduct')}
         
       />

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: 'red'
  }
});

export default withNavigation(ProductScreen);