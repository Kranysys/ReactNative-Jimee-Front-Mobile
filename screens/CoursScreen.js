/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View , Text, Animated, Alert, TouchableOpacity, 
TouchableWithoutFeedback, TextInput, Button, Platform, StatusBar, Image, Slider,
Dimensions, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, getToken, getUserInstaID } from '../api';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SwitchSelector from 'react-native-switch-selector';
import Header from '../components/Header';

export default class CoursScreen extends React.Component {
  constructor(props){
    super(props);

  }
static navigationOptions = {
  header: null,
};
  render() {
    return (
      <ScrollView style={styles.AndroidSafeArea}>
        <Header title="Cours" this={this}/>

        <View style={{marginBottom: 55}}>
          <ScrollView horizontal={true}>
            <View style={{flexDirection: 'column', marginLeft: 25}}>
              <Text style={{color: '#3e3f68', fontSize: 25}}>Récent</Text>
              <View style={{borderTopColor: '#e67e22', borderTopWidth: 5}}></View>
            </View>
            <View style={{flexDirection: 'column', marginLeft: 25}}>
              <Text style={{color: '#3e3f68', fontSize: 25}}>Photographie</Text>
              {/*<View style={{borderTopColor: '#e67e22', borderTopWidth: 5}}></View>*/}
            </View>
            <View style={{flexDirection: 'column', marginLeft: 25}}>
              <Text style={{color: '#3e3f68', fontSize: 25}}>Algorithme</Text>
              {/*<View style={{borderTopColor: '#e67e22', borderTopWidth: 5}}></View>*/}
            </View>
          </ScrollView>

        <View style={{padding: 20}}>
          <View style={{borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
            <Image source={require('../assets/images/cours1bg.png')} style={{borderTopLeftRadius: 15, borderTopRightRadius: 15}} />
            <View style={{padding: 12}}>
              <Text style={{fontSize: 16}}>L'algorithme instagram</Text>
              <Text style={{fontSize: 9}}>Une brève histoire de l'algorithme</Text>
            </View>
          </View>
        </View>
          
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    marginBottom: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    marginLeft: '5%',
    width: '90%', 
    padding: '5%',
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titre: {
    fontSize: 14,
    fontWeight: '500',
  },
  titregauche: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    right: 12,
  },
  textBox: {
	  marginBottom: 6,
    fontSize: 18,
    alignSelf: 'stretch',
    height: 35,
    padding: 4,
    margin: 5,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

