/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/HeaderAction';
import JimeeButton from '../../components/JimeeButton';

export default class HashtagsScreen extends React.Component {
  constructor(props){
    super(props);

  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <Header title="Hashtags" this={this}/>

        <View style={{padding: 15}}>
          <View style={{ 
            width: '100%',
            height: 66,
            borderRadius: 12, 
            borderColor: '#aaa',
            borderWidth: 1,
            shadowRadius: 4, 
            shadowColor: '#000', 
            shadowOffset: {  width: 0,  height: 4,  }, 
            }}>
            <Text style={{ position: 'absolute', left: 50, top: 20, color: '#aaa', fontSize: 20 }}> 1-30 </Text>
            {<JimeeButton title='Générer Hashtags' style={{width: 200, position: 'absolute', right: 0, top: -18}} onPress={() => { this.loading=1; this.forceUpdate(); setTimeout(() =>  {this.loading=2},1500); }}/>}
          </View>

          <Text style={{fontStyle: 'italic', color: '#bbb', fontSize: 14, marginTop: 15}}>Permet de générer un nombre aléatoire d'hashtags en relation avec ton profil type</Text>

          { this.loading==1 && 
            <View style={{justifyContent: "center", alignItems: "center"}}>
              <Image style={{height: 90, width: 90, alignItems: 'center'}} source={require('../../assets/images/load2.gif')} />
            </View>
          }
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
