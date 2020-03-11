import React from "react";
import {
StyleSheet,
View,
ActivityIndicator,
FlatList,
Text,
ScrollView,
TouchableOpacity
} from "react-native";

export default class Source extends React.Component {
static navigationOptions = ({ navigation }) => {
return {
  title: "Source Listing",
  headerStyle: {backgroundColor: "#fff"},
  headerTitleStyle: {textAlign: "center",flex: 1}
 };
};
constructor(props) {
 super(props);
 this.state = {
   loading: true,
   dataSource:[]
  };
}
componentDidMount(){
  fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then((responseJson)=> {
    this.setState({
    loading: false,
    dataSource: responseJson
    })
  })
.catch(error=>console.log(error)) //to catch the errors if any
}
FlatListItemSeparator = () => {
return (
  <View style={{
     height: .5,
     width:"100%",
     backgroundColor:"rgba(0,0,0,0.5)",
}}
/>
);
}
renderItem=(data)=>
<TouchableOpacity style={styles.list}>
<Text style={styles.lightText}>{data.item.name}</Text>
<Text style={styles.lightText}>{data.item.username}</Text>
<Text style={styles.lightText}>{data.item.address.street}</Text>
<Text style={styles.lightText}>{data.item.address.suite}</Text>
{/* <Text style={styles.lightText}>{data.item.address.suite}</Text> */}
{/* <Text style={styles.lightText}>{data.item.address.geo.lat}</Text> */}



<Text style={styles.lightText}>{data.item.email}</Text>
{/* <Text style={styles.lightText}>{data.item.company.name}</Text> */}
<Text style={styles.lightText}>{data.item.company.catchPhrase}</Text></TouchableOpacity>
render(){
 if(this.state.loading){
  return( 
    <View style={styles.loader}> 
      <ActivityIndicator size="large" color="red"/>
    </View>
)}
return(
   <ScrollView>
 <View style={styles.container}>
  
   <Text>Source Listing</Text>
 <FlatList
    data= {this.state.dataSource}
    ItemSeparatorComponent = {this.FlatListItemSeparator}
    renderItem= {item=> this.renderItem(item)}
    keyExtractor= {item=>item.id.toString()}
 />
 
</View>
</ScrollView>
)}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
   },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
   },
  list:{
    paddingVertical: 4,
    margin: 5,
    backgroundColor: "#fff"
   }
});