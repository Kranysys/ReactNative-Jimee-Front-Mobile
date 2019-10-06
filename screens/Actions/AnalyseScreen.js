/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image, ImageBackground, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/HeaderAction';
import JimeeButton from '../../components/JimeeButton';
import { LinearGradient } from 'expo-linear-gradient';

export default class AnalyseScreen extends React.Component {
  constructor(props){
    super(props);
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <Header title="Analyse Profil" this={this}/>

        <View style={{padding: 15}}>

        <TextInput
            style={{borderRadius: 5, fontSize: 22}}
            placeholder="Recherche un profil"
            autoCapitalize = 'none'
            underlineColorAndroid = "transparent"
            //onChangeText={(text) => this.setState({text})}
            //ref={this.recherche}
          />
          <JimeeButton title="Rechercher" onPress={ () => {}} />

        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    fontWeight: 'bold',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6, 
    borderColor: '#ccc',
    margin: 5,
  },
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
