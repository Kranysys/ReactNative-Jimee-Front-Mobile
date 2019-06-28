import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, AsyncStorage, Font, Dimensions } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { api, setToken, clearAll } from '../api';

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    console.log("w"+Dimensions.get('window').width)

    clearAll();

    this.state = { hidePassword: true, showPassword: false };
    this.saveChecked = true;
    this.logInput = React.createRef();
    this.passInput = React.createRef();
    this.rememberMe = React.createRef();
    this.savedLogin = "";
    this.savedPass = "";
    this.loading = 0;

    this._FetchRememberMe();
  }
  managePasswordVisibility = () =>
  {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  async _FetchRememberMe() { // Récupération des informations de login si RememberMe est checked
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
          var pieces = value.split(","); 
          //return string(pieces[field]);
          this.savedLogin = pieces[0]+"";
          this.logInput.current._lastNativeText = pieces[0]+"";
          this.savedPass = pieces[1]+"";
          this.passInput.current._lastNativeText = pieces[1]+"";
          this.saveChecked = Boolean(pieces[2]); 
          this.forceUpdate(); 
          //return value;
        }
      } else console.log("Pas de ActiveInstaAccount.");
    } catch (error) {
      console.log("Error fetching:"+error);
    } 
  };
  async _storeRememberMe(key) { // Sauvegarde des informations de login si RememberMe est checked
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
        console.log("Navigate to AccountsStack");
        this.props.navigation.navigate('Accounts');
      } else {
        Alert.alert("Utilisateur ou mot de passe incorrect");
        this.loading=0;
        this.forceUpdate();
      }
    })
    .catch((error) =>{
      console.log("ERROR: "+error);
        Alert.alert("Utilisateur ou mot de passe incorrect");
        this.loading=0;
        this.forceUpdate();
    });
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.loginBackground}>
      <Text style={styles.welcomeText}>Jimee</Text>
      <Text style={styles.smallWelcomeText}>le p'tit pote qui te rend visible</Text>
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
        <TouchableOpacity activeOpacity = { 0.8 } style = {{ width: 35, position: 'absolute', height: 35, right: 15, paddingBottom: 6, top: 9, }} onPress = { this.managePasswordVisibility }>
          <Image source = { ( this.state.hidePassword ) ? require("../assets/images/hide.png") : require('../assets/images/view.png') } style = { styles.btnImage } />
        </TouchableOpacity>
      </View>
      { this.loading==0 &&
      <TouchableOpacity ref={this.boost} activeOpacity = { 0.5 } style = { styles.loginButton }  onPress = { () => { this.loading=1; this.forceUpdate(); this.login(); } }>
        <Text style={{color: '#fff', fontSize: 18}}> Se connecter </Text>
      </TouchableOpacity>
      }
      { this.loading==1 && 
      <Image style={{height: 35, width: 35}} source={require('../assets/images/load.gif')} />
      }
      <TouchableOpacity onPress={ () => {this.saveChecked=!this.saveChecked;this.forceUpdate();}} style={{flex: 1, flexDirection: 'row'}}>
        <CheckBox 
        checkedColor='#fff' 
        checked={this.saveChecked} 
        onPress={ () => {this.saveChecked=!this.saveChecked;this.forceUpdate();}}
        ref={this.rememberMe}/><Text style={{color: '#fff', marginTop: 17, marginLeft: -14}}>Mémoriser les Identifiants</Text>
      </TouchableOpacity>
      {/*<TouchableOpacity style={{position: 'absolute', bottom: 25}} activeOpacity = { 0.8 } onPress = { () => {this.props.navigation.navigate('Register');} }> BETA
        <Text style={styles.register}>Créer un compte Jimee</Text>
      </TouchableOpacity> 
      */}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  loginBackground: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: '10%', 
    paddingBottom: '20%', 
    backgroundColor: '#3400B1',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  welcomeText: {
    fontSize: (Dimensions.get('window').width / 3), // font qui s'adapte à l'écran
    fontFamily: 'Roboto',
    //resizeMode: 'contain',
    letterSpacing: -9,
    //borderWidth: 1,
    borderColor: '#f00',
    fontWeight: 'bold',
    marginTop: 3,
    //marginLeft: -10,
    color: '#fff'
  },
  smallWelcomeText: { 
    textAlign: 'center', 
    color: '#fff', 
    fontSize: (Dimensions.get('window').width / 16), 
    marginTop: -10, 
    marginBottom: 40 
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
    width: 35
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
    marginBottom: 21,
  },
  loginButton: {
    borderColor: '#fff', 
    borderRadius: 35, 
    backgroundColor: '#3800bf', 
    borderWidth: 1, 
    height: 45, 
    textAlign: 'center', 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'stretch',
    marginBottom: 18,
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
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid'
  }
});
