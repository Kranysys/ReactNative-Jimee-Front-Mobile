import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { api } from '../api';
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
