import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { api, bearerToken, setToken } from '../api';

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = { hidePassword: true, showPassword: false };
    this.saveChecked = true;
    this.logInput = React.createRef();
    this.passInput = React.createRef();
  }
  managePasswordVisibility = () =>
  {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  login() {
    let command = "auth/login";
    console.log("POST "+api+command);
    var details = {
      'username': this.logInput.current._lastNativeText,
      'password': this.passInput.current._lastNativeText,
      'grant_type': 'password',
      'client_id': 'null',
      'client_secret': 'null'
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
    fetch(api+command, {
		  method: 'POST',
		  headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody,
      timeout: 2000,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("LOGIN INFO: "+responseJson.token_type+"/"+responseJson.access_token);
      if(responseJson.token_type && responseJson.access_token){
        setToken(responseJson.access_token); // Stockage du token
        this.props.navigation.navigate('App');
      } else {
        Alert.alert("Utilisateur ou mot de passe incorrect");
      }
    })
    .catch((error) =>{
      console.log("ERROR: "+error);
        Alert.alert("Utilisateur ou mot de passe incorrect");
    });
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Image
        source={
          require('../assets/images/logo-large.png')
        }
        style={styles.welcomeImage}
      />
      <TextInput
          style={ styles.textBox }
          placeholder="Identifiant"
          onChangeText={(text) => this.setState({text})}
          ref={this.logInput}
      />
      <View style = { styles.textBoxBtnHolder }>
        <TextInput
          style={ styles.textBox }
          placeholder="Mot de passe"
          underlineColorAndroid = "transparent"
          secureTextEntry = { this.state.hidePassword }
          onChangeText={(text) => this.setState({text})}
          ref={this.passInput}
        />
        <TouchableOpacity activeOpacity = { 0.8 } style = {{ width: 35, position: 'absolute', height: 35, right: 15, paddingBottom: 6}} onPress = { this.managePasswordVisibility }>
          <Image source = { ( this.state.hidePassword ) ? require("../assets/images/hide.png") : require('../assets/images/view.png') } style = { styles.btnImage } />
        </TouchableOpacity>
      </View>
      <View style={{position: 'relative', alignSelf: 'stretch',}}>
        <Button onPress={ () => {this.login();}} title="SE CONNECTER"/>
      </View>
      <View style={{ alignSelf: 'stretch', marginLeft: -10, marginRight: -10}}>
        <CheckBox title='Mémoriser les identifiants' style={{backgroundColor: '#fff'}} uncheckedIcon='circle-o' checked={this.saveChecked} onPress={ () => {this.saveChecked=!this.saveChecked;this.forceUpdate();}}/>
      </View>
      <TouchableOpacity style={{position: 'absolute', bottom: 25}} activeOpacity = { 0.8 } onPress = { () => {this.props.navigation.navigate('Register');} }>
        <Text style={{color: '#66c', fontSize: 18, fontWeight: 'bold'}}>Créer un compte Jimee</Text>
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    //flexDirection: 'row', 
    backgroundColor: '#fbfbfb',
    paddingVertical: 2,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  instaNumbers: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginTop: -40,
  },
  instaActions: {
    fontSize: 16, 
  },
  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5
  },
  buttonText: {
    padding: 20,
    color: 'white'
  },
  textBox: {
	  marginBottom: 6,
    fontSize: 18,
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    paddingLeft: 8,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5
  },
  picker: {
    marginLeft: 20,
	  marginRight: 20,
	  marginBottom: 6,
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    paddingLeft: 8,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5
  },
  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginLeft: 20,
	  marginRight: 20,
    marginBottom: 30,
    alignItems: 'center',
    color: '#2196F3',
    paddingRight: 45
  },
  buttonContainer: {
    marginBottom: 20,
  },
  visibilityBtn:
  {
    position: 'absolute',
    right: 20,
    height: 40,
    width: 35,
    paddingBottom: 7
  },
  btnImage:
  {
    resizeMode: 'contain',
    height: '100%',
    width: '100%'
  }
});
