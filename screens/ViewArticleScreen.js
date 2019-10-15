/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import Header from '../components/HeaderAction';
import SwitchSelector from 'react-native-switch-selector';

export default class ViewArticleScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {cours: []};

  }
  getCours() {
    var command = "cours";
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
		  method: 'GET',
		  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
		}).then((response) => response.json()).then((responseJson) => {
      console.log("cours:")
      console.log(responseJson.cours)
      this.setState({cours: responseJson.cours});
      this.forceUpdate();
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <Header title="Editer" this={this}/>
        <View style={{marginTop: 0, }}>
          <Text style={styles.titre}>{navigation.getParam('id', 9)}</Text>


        </View>

        <View style={{height: 200}}></View>
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
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
    height: 200,
    width: 200,
  },
  bloc: {
    width: 350,
    height: 120,
    color: '#fff',
  }
});
