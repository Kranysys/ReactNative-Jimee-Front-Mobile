import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Alert, Animated, TextInput } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { api, getToken, getUserID, setUserID, getUserInstaID, setUserInstaID } from '../api';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);

    // Obtension de l'ID de l'utilisateur + nettoyage token
    this.getID();

    this.likesChecked = false;
    this.commentsChecked = false;
    this.followChecked = false;
    this.unfollowChecked = false;

    this.accountFollowers = 0;
    this.accountPosts = 0;
    this.accountFollowing = 0;
    this.accountPictureId = 0;

    this.state = { valueArray: [], valueArray2: [], hidePassword: true, showPassword: false };
    this.index = 0; this.index2 = 0;
    this.logcontent = [];
    this.instaAccountsContent = [];
    this.instaAccountsContentID = [];
    this.animatedValue = new Animated.Value(0);

    this.showOverlay = 0;
    this.InstaAccountcount = 0;
    this.InstaAccountList = "";
    this.logInput = React.createRef();
    this.passInput = React.createRef();
    this.addAccount = 0;
  }
  getID() {
    var command = "users?token="+getToken();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
		  method: 'GET',
		  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
		}).then((response) => response.json()).then((responseJson) => {
      if(responseJson.user_id){
        setUserID(responseJson.user_id);
        // userID obtenu, les autres requêtes peuvent être effectués
        this.request(); // obtension des informations instagram
        this.getInstaAccounts(); // obtension du compte instagram
      } 
      else console.log("ERR!! No UserID found for token!!");
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  request() {
    var command = "info?userID="+getUserID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
		  method: 'GET',
		  headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
		}).then((response) => response.json()).then((responseJson) => {
      if(responseJson.followers>0) this.accountFollowers = responseJson.followers; else this.accountFollowers = "-";
      if(responseJson.posts>0) this.accountPosts = responseJson.posts; else this.accountPosts = "-";
      if(responseJson.followings>0) this.accountFollowing = responseJson.followings; else this.accountFollowing = "-";
      this.forceUpdate();
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });

    
    command = "configUserInsta?userID="+getUserID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
    }).then((response) => response.json()).then((responseJson) => {
      console.log("fl "+responseJson.followers);
      if(responseJson.follows>0) this.followChecked = true; else this.followChecked = true;
      if(responseJson.unfollows>0) this.unfollowChecked = true; else this.unfollowChecked = false;
      if(responseJson.comments>0) this.commentsChecked = true; else this.commentsChecked = false;
      if(responseJson.likes>0) this.likesChecked = true; else this.likesChecked = false;
      this.forceUpdate();
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  updateCheck() {
    var command = "configUserInsta";
    console.log("request -> POST "+api+command);
    fetch(api+command,  {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
      body: JSON.stringify({
        follows: Number(this.followChecked), 
        unfollows: Number(this.unfollowChecked),
        comments: Number(this.commentsChecked),
        likes: Number(this.likesChecked),
      })
    }).then((response) => response.json()).then((responseJson) => {
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  getLogs() {
    var command = "userlogs?userInstaID="+getUserInstaID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      }
    }).then((response) => response.json()).then((responseJson) => {
      let logscount = Object.keys(responseJson).length;
      console.log("Nombre de logs : "+logscount);
      console.log(JSON.stringify(responseJson));
      if(logscount > 0){
        for(var i=0;i<10 && i < logscount;i++) {
          
          if(responseJson[i].id>0){
            console.log("ADD LOG "+responseJson[i].user+" : "+responseJson[i].type);
            this.addMoreLog(responseJson[i].user+" : "+responseJson[i].type);
          }
        }
      }
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  addMoreLog(contenu) {
    this.animatedValue.setValue(0);
    this.logcontent[this.index] = contenu;

    let newlyAddedValue = { index: this.index }

    this.setState({ valueArray: [ ...this.state.valueArray, newlyAddedValue ] }, () =>
    {
        Animated.timing(
          this.animatedValue,
          {
              toValue: 1,
              duration: 500,
              useNativeDriver: true
          }
        ).start(() =>
        {
            this.index = this.index + 1;
        }); 
    });
  }
  getInstaAccounts() {
    var command = "instaAccounts?userID="+getUserID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      }
    }).then((response) => response.json()).then((responseJson) => {
      // On vide les variables
      this.instaAccountsContent = []; this.instaAccountsContentID = []; this.state.valueArray = []; this.state.valueArray2 = [];
      this.index2 = 0; this.index = 0;

      this.InstaAccountcount = Object.keys(responseJson).length;
      this.InstaAccountList = responseJson;

      console.log("GET INSTACCOUNT SIZE "+this.InstaAccountcount);
      //console.log(JSON.stringify(responseJson));
      if(!this.InstaAccountcount){
        console.log("NO INSTA ACCOUNT");
      } 
      for(var i=0;i<(this.InstaAccountcount);i++) {
        console.log("ADD INSTA ACCOUNT "+i+" ["+this.InstaAccountList[i].user+"] id ["+this.InstaAccountList[i].instauser_id+"]");
        if(i==0) setUserInstaID(this.InstaAccountList[i].instauser_id);
        if(i>=1){
          this.addMoreInstaAccount(this.InstaAccountList[i].user, this.InstaAccountList[i].instauser_id);
        } 
      }
      if(this.InstaAccountcount) {
        this.getLogs(); // Affichage des logs
        this.forceUpdate(); // met à jour l'affichage des comptes
      }
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  addInstaAccount() {
    console.log("Adding instaAccount action...");
    var command = "instaAccounts";
    if(!this.logInput.current._lastNativeText || !this.passInput.current._lastNativeText) {
      Alert.alert("Veuillez entrer votre login et mot de passe Instagram.");
      return;
    }
    console.log("request -> POST "+api+command);
    fetch(api+command,  {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
      body: JSON.stringify({
        instauser: this.logInput.current._lastNativeText,
        instapass: this.passInput.current._lastNativeText,
        userID: getUserID(),
      })
    }).then((response) => response.json()).then((responseJson) => {
    }).catch((error) =>{
      console.log("ERROR ADD INSTA ACCOUNT : "+error);
    });
    this.showInstaAccount();
    this.getInstaAccounts();
    this.forceUpdate();
  }
  delInstaAccount(userInstaID) {
    console.log("Deleting instaAccount action...");
    var command = "instaAccounts";
    console.log("request -> DELETE "+api+command);
    fetch(api+command,  {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
      body: JSON.stringify({
      userInstaID: userInstaID,
      userID: getUserID(),
      })
    }).then((response) => response.json()).then((responseJson) => {
    }).catch((error) =>{
      console.log("ERROR ADD INSTA ACCOUNT : "+error);
    });
    this.showInstaAccount();
    this.getInstaAccounts();
    this.forceUpdate();
  }
  addMoreInstaAccount(userInsta, userInstaID) {
    if(!userInsta || !userInstaID) return;
    console.log("ADDMOREINSTAACCOUNT "+userInsta+"/"+userInstaID+" ("+this.index2+")")
    this.instaAccountsContent[this.index2] = userInsta;
    this.instaAccountsContentID[this.index2] = userInstaID;

    let newlyAddedValue = { index: this.index2 }

    this.setState({ valueArray2: [ ...this.state.valueArray2, newlyAddedValue ] }, () =>
    {
      
      this.index2 = this.index2 + 1;
    })
  }
  showInstaAccount() { // show and hide instaAccounts
    this.showOverlay = !this.showOverlay;
    this.forceUpdate();
  }
  changeActiveInstaAccount(key) {

  }
  static navigationOptions = {
    header: null,
  };
  render() {
    const animationValue = this.animatedValue.interpolate(
    {
      inputRange: [ 0, 1 ],
      outputRange: [ -59, 0 ]
    });
    let rows = this.state.valueArray.map(( item, key ) =>
    {
        if(( key ) == this.index)
        {
            return(
                <Animated.View key = { key } style = {[ styles.viewHolder, { opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                    <Text style ={{padding: 5, borderColor: '#000', borderRadius: 5, borderWidth: 1, margin: 5}}>{ this.logcontent[item.index] }</Text>
                </Animated.View>
            );
        }
        else
        {
            return(
                <View key = { key } style = { styles.viewHolder }>
                    <Text style ={{padding: 5, borderColor: '#000', borderRadius: 5, borderWidth: 1, margin: 5}}>{ this.logcontent[item.index] }</Text>
                </View>
            );
        }
    });
    let accountList = this.state.valueArray2.map(( item, key ) =>
    { console.log("ACCOUNTLIST : "+this.instaAccountsContent[key]+" ["+key+"]");
      if(this.instaAccountsContentID[key] && this.instaAccountsContent[key]){
        return(
          // Icone suppression du compte instagram
            <View key = { key } style = { styles.viewHolder }>
              <TouchableOpacity activeOpacity = { 0.7 }  onPress={ () => { this.delInstaAccount(this.instaAccountsContentID[key]); }} style={{zIndex: 4, position: 'absolute', left: 100, top: (220+key*100),}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={{borderWidth: 3, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#eee', width: 40, height: 40, marginTop: 17, alignItems: 'center', justifyContent: 'center'}}>
                    {<Ionicons name='md-trash' size={24} color='#700' style={{}} />}
                  </View>
                </View>
              </TouchableOpacity>
          
              <TouchableOpacity activeOpacity = { 0.8 }  onPress={ () => { this.changeActiveInstaAccount(key); }} style={{zIndex: 3, position: 'absolute', top: (220+key*100), width: '100%'}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={{borderWidth: 3, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#eee', width: 75, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                    {<Text>{this.instaAccountsContent[key]}</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
        );
      }
    });
    let accountIcon = <Ionicons name='md-add' size={46} color='#090' style={{}} />;
    if(this.InstaAccountcount>0) {
      accountIcon = <Text>{this.InstaAccountList[0].user}</Text>;
    }
    return (
      <ScrollView>
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
          { this.showOverlay==1 && // LISTE DES COMPTES INSTAGRAM
            <TouchableWithoutFeedback onPress={ () => { this.addAccount=0; this.showInstaAccount(); }}>
              <View style={{backgroundColor: '#000', opacity: 0.8, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 2}}>
                { ( this.InstaAccountcount==0 || this.addAccount==1 ) && // PAS DE COMPTE, CREATION
                  <View style={{backgroundColor: '#fff', borderRadius: 10, position: 'absolute', top: 250, right: 50, left: 50, zIndex: 10}}>
                    <Text style={{fontSize: 17, padding: 3}}>Ajouter un compte Instagram existant</Text>
                    <TextInput
                      style={ styles.textBox }
                      placeholder="Login du compte"
                      ref={this.logInput}
                    />
                    <TextInput
                      style={ styles.textBox }
                      placeholder="Mot de passe"
                      underlineColorAndroid = "transparent"
                      secureTextEntry = { this.state.hidePassword }
                      ref={this.passInput}
                    />
                    <View style={{position: 'relative', alignSelf: 'stretch',}}>
                      <Button onPress={ () => {this.addInstaAccount();}} title="AJOUTER CE COMPTE"/>
                    </View>
                  </View>
                }
                { this.InstaAccountcount>0 && // PROPOSE CREATION COMPTE SUPPLEMENTAIRE et liste
                  <View>
                    {accountList}

                    <TouchableOpacity activeOpacity = { 0.8 }  onPress={ () => { this.addAccount=1; this.forceUpdate(); }} style={{zIndex: 3, position: 'absolute', top: (220+100*(this.InstaAccountcount-1)), width: '100%'}}>
                      <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                        <View style={{borderWidth: 3, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#eee', width: 75, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                          {<Ionicons name='md-add' size={46} color='#090' style={{}} />}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </TouchableWithoutFeedback>
          }
          <View style={styles.welcomeContainer}>
            <Image
              source={
                require('../assets/images/logo-large.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <TouchableOpacity activeOpacity = { 0.8 }  onPress={ () => {this.showInstaAccount(); this.addAccount = 0;}} style={{zIndex: 3}}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
              <View style={{borderWidth: 3, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#eee', width: 75, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                { accountIcon }
              </View>
            </View>
          </TouchableOpacity>

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 20,zIndex:1}}>
            <Text style={styles.getStartedText}>Abonnées</Text>
            <Text style={styles.getStartedText}>Publications</Text>
            <Text style={styles.getStartedText}>Abonnements</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 20,zIndex:1}}>
            <Text style={styles.instaNumbers}>{this.accountFollowers}</Text>
            <Text style={styles.instaNumbers}>{this.accountPosts}</Text>
            <Text style={styles.instaNumbers}>{this.accountFollowing}</Text>
          </View>

          <View style={{zIndex: 1,}}>
            <CheckBox center title='Likes' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.likesChecked} onPress={ () => {this.likesChecked=!this.likesChecked;this.forceUpdate();}}/>
            <CheckBox center title='Commentaires' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.commentsChecked} onPress={ () => {this.commentsChecked=!this.commentsChecked;this.forceUpdate();}}/>
            <CheckBox center title='Follow' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.followChecked} onPress={ () => {this.followChecked=!this.followChecked;this.forceUpdate();}}/>
            <CheckBox center title='Unfollow' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' checked={this.unfollowChecked} onPress={ () => {this.unfollowChecked=!this.unfollowChecked;this.forceUpdate();}}/>
            <TouchableOpacity activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b3', borderWidth: 1, borderColor: '#999', height: 40, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.updateCheck(); } }>
              <Ionicons name='md-checkmark' size={38} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> VALIDER </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#BC3434', borderWidth: 1, borderColor: '#999', height: 40, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.addMoreLog();/*this.updateCheck();*/ } }>
              <Ionicons name='md-jet' size={38} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> BOOST </Text>
            </TouchableOpacity>
          </View>
          <Text>Historique des actions</Text>
          <View style={{zIndex: 1,}}>
            {rows}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textBox: {
	  marginBottom: 6,
    fontSize: 18,
    alignSelf: 'stretch',
    height: 35,
    padding: 4,
    margin: 5,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1,
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
    zIndex: 1,
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
});
