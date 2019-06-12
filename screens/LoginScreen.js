import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { api, setToken } from '../api';

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = { hidePassword: true, showPassword: false };
    this.saveChecked = true;
    this.logInput = React.createRef();
    this.passInput = React.createRef();
    this.rememberMe = React.createRef();
    this.savedLogin = "";
    this.savedPass = "";

    this._FetchRememberMe();
  }
  managePasswordVisibility = () =>
  {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  async _FetchRememberMe() { // Récupération des informations de login si RememberMe est checked
    console.log("Fetching RememberMe...")
    try {
      const value = await AsyncStorage.getItem('RememberMe:');
      if (value !== null) {
        if(value.split(",")[0] == "" || value.split(",")[0] == undefined || value.split(",")[0] == "undefined" || value.split(",")[1] == "undefined" || value.split(",")[1] == "" || value.split(",")[1] == undefined){
          if(value.split(",")[2] == 0){
            this.saveChecked = 0; 
            this.forceUpdate(); 
          }
        }
        else {
          console.log("active account is "+value);
          var pieces = value.split(","); 
          //return string(pieces[field]);
          this.savedLogin = pieces[0]+""; console.log("set savedLogin to "+pieces[0]+" / "+pieces[1]+" / "+pieces[2])
          this.logInput.current._lastNativeText = pieces[0]+"";
          this.savedPass = pieces[1]+"";
          this.passInput.current._lastNativeText = pieces[1]+"";
          this.saveChecked = (pieces[2])-0; 
          this.forceUpdate(); 
          //return value;
        }
      } else console.log("Pas de ActiveInstaAccount.");
    } catch (error) {
      console.log("Error fetching:"+error);
    } 
  };
  async _storeRememberMe(key) { // Sauvegarde des informations de login si RememberMe est checked
    console.log("Saving RememberMe...")
    try {
      await AsyncStorage.setItem('RememberMe:',key+'');
    } catch (error) {
      console.log("Error storing:"+error);
    }
  };
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

    if( this.rememberMe.current.props.checked == true ){
      this._storeRememberMe(this.logInput.current._lastNativeText+","+this.passInput.current._lastNativeText+",1");
    } else {
      this._storeRememberMe(",,0");
    }
  
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
      <View style={styles.loginBackground}>
      <Image
        source={
          require('../assets/images/logo-large.png')
        }
        style={styles.welcomeImage}
      />
      <TextInput
          style={ styles.textBox }
          placeholder="Identifiant"
          autoCapitalize = 'none'
          onChangeText={(text) => this.setState({text})}
          defaultValue={this.savedLogin}
          ref={this.logInput}
      />
      <View style = { styles.textBoxBtnHolder }>
        <TextInput
          style={ styles.textBox }
          placeholder="Mot de passe"
          autoCapitalize = 'none'
          underlineColorAndroid = "transparent"
          secureTextEntry = { this.state.hidePassword }
          onChangeText={(text) => this.setState({text})}
          defaultValue={this.savedPass}
          ref={this.passInput}
        />
        <TouchableOpacity activeOpacity = { 0.8 } style = {{ width: 35, position: 'absolute', height: 35, right: 15, paddingBottom: 6}} onPress = { this.managePasswordVisibility }>
          <Image source = { ( this.state.hidePassword ) ? require("../assets/images/hide.png") : require('../assets/images/view.png') } style = { styles.btnImage } />
        </TouchableOpacity>
      </View>
      {/*<View style={{position: 'relative', alignSelf: 'stretch'}}>
        <Button onPress={ () => {this.login();}} title="Se connecter" style={{color: '#000'}}/>
      </View>*/}
      <TouchableOpacity ref={this.boost} activeOpacity = { 0.8 } style = { styles.loginButton } onPress = { () => { this.login(); } }>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> BOOST </Text>
      </TouchableOpacity>
      <View style={{ alignSelf: 'stretch', marginLeft: -10, marginRight: -10}}>
        <CheckBox title='Mémoriser les identifiants' style={{backgroundColor: '#fff'}} checked={this.saveChecked} onPress={ () => {this.saveChecked=!this.saveChecked;this.forceUpdate();}} ref={this.rememberMe}/>
      </View>
      <TouchableOpacity style={{position: 'absolute', bottom: 25}} activeOpacity = { 0.8 } onPress = { () => {this.props.navigation.navigate('Register');} }>
        <Text style={styles.register}>Créer un compte Jimee</Text>
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  loginBackground: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20, 
    paddingBottom: 100, 
    backgroundColor: '#3400B1',
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
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 35,
    color: '#3800bf',
    paddingLeft: 25, 
    paddingBottom: 5,
  },
  loginButton: {
    fontSize: 25,
    borderRadius: 35,
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: '#3800bf',
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
  },
  register:
  {
    color: '#66c', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#fff',
  }
});
