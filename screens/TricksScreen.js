/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoConfigView } from '@expo/samples';
import { api } from '../api';
import { Button } from 'react-native-elements';
let pkg = require('../package.json');

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);

  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <View style={{marginBottom: 55}}>
          <TouchableOpacity onPress={ () => { this.props.navigation.openDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 15, left: 20}}>
            <Image source={require('../assets/images/menu.png')} />
          </TouchableOpacity>
          <Text style={{fontSize: 30, fontWeight: '700', position: 'absolute', top: 7, left: 85, fontFamily: 'Roboto'}}>Conseils</Text>
        </View>
        <View style={{marginTop: 35, }}>
          <Text style={styles.titre}>Inspiration Posts</Text>
          <Text style={styles.titre}>Améliorer mon profil</Text>
          <Text style={styles.titre}>Notifications & Conseils</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  titre: {
    fontFamily: 'josefin',
    fontSize: 17,
    color: '#3e3f68',
    paddingBottom: 20
  }
});
