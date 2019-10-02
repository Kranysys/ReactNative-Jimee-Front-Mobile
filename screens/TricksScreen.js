/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

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
        <Header title="Conseils" this={this}/>
        <View style={{marginTop: 35, }}>
          <Text style={styles.titre}>Inspiration Posts</Text>
          <Text style={styles.titre}>Améliorer mon profil</Text>
          <Text style={styles.titre}>Notifications & Conseils</Text>

          <View style={styles.feed}>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
              <Ionicons name='md-airplane' size={15} style={{marginRight: 7}} /><Text>Feed</Text><Text style={{position: 'absolute', right: 15, fontWeight: 'bold'}}>22 sept</Text>
            </View>
            <Text>Et si tu ajoutais un peu plus de peps dans les textes detes posts. Un peu de smiley, une pointe d'ironie, et une petite histoire, je suis sur qu'ils vont adorer !</Text>
          </View>

          <View style={styles.feed}>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
              <Ionicons name='md-airplane' size={15} style={{marginRight: 7}} /><Text>Feed</Text><Text style={{position: 'absolute', right: 15, fontWeight: 'bold'}}>22 sept</Text>
            </View>
            <Text>Ta publication a été plus performante que toutes celledu mois dernier. Bravo Michel, je te conseille de continuerà poster ce type de photo, ta communauté adore ca !</Text>
          </View>

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
    padding: 20
  },
  feed: {
    margin: 20,
    padding: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
  }
});
