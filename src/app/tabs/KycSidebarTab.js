import React ,{Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Dimensions,ScrollView,} from 'react-native';
import IconBack from '../assets/images/icon_back.svg';

const width = Dimensions.get('window').width; 
const height = Dimensions.get('window').height; 

export default class KycSidebarTabs extends Component {
    constructor(props) {
      super(props);
    }
    render(){
        const { routes, index } = this.props.navigation.state;
        return (
    <View style={{backgroundColor:'#9d1d28',width:width/6.2,height:height}}>
        <ScrollView style={{}}>
            <View style={{height:100,justifyContent:"center",paddingLeft:20}}>
                <TouchableOpacity onPress={() => this.props.navigation.replace('DocumentationStack')} style={{flexDirection:'row'}}>
                    <IconBack />
                    <Text style={{color:'#fff',fontSize:14,fontWeight:'bold',paddingLeft:10}}>Documents</Text>
                </TouchableOpacity>
            </View>
            <View style={{height:height-200,justifyContent:"center"}}>
                {routes.map((route, tabIndex) => {
                    const { routeName, params } = route;
                    const { icon, tabName } = params || {};
                    const color = tabIndex === index ? 'white' : '#ffffff7F';
                    const fontWeight = tabIndex === index ? 'bold' : 'normal';
                    return (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName)}
                            style={styles.tab}
                            key={route.routeName}
                        >
                            <View style={{ flex: 1, marginLeft:20 }}>
                                <Text style={{ color, fontWeight, fontSize:14,fontFamily:'Helvetica' }}>
                                    {tabName}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{height:100,bottom:20,justifyContent:"center",alignItems:"center"}}>
                
            </View>
        </ScrollView>
    </View>

    );
  }
}

const styles = StyleSheet.create({
      header: { position: 'absolute', top: 0 },
      tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: '100%',
        margin: 5,
        backgroundColor: 'transparent',
        overflow: 'hidden',
      },
      tabContainer: {
        width:width/6.2,
        backgroundColor: '#9d1d28',
        height: '100%',
        left: 0,
        top: 0,
        bottom:0
      },
    });



 