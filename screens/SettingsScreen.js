import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
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
    title: 'Paramètres',
  };

  render() {
    return(
      <ScrollView>
        <View style={styles.container}>
          <View style={{marginBottom: 15}}>
            <Text>VERSION</Text>
            <Text style={{fontSize: 20}}>{pkg.version} BETA</Text>
          </View>
          <View>
            <TouchableOpacity ref={this.valider} activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', borderWidth: 1, borderColor: '#999', height: 40, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.props.navigation.navigate('Auth');} }>
              <Ionicons name='md-exit' size={38} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> DECONNEXION </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
});
