import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, 
TouchableWithoutFeedback, View, Alert, Animated, TextInput, ToastAndroid,
AsyncStorage, StatusBar, SafeAreaView, FlatList } from 'react-native';
//import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
//import { MonoText } from '../components/StyledText';
import { api, getToken, getUserID, setUserID, getUserInstaID, getUserInsta, setUserInsta } from '../api';
import { StackNavigator } from  'react-navigation';

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

    this.state = { 
      valueArray: [], 
      valueArray2: [], 
      hidePassword: true, 
      showPassword: false,
     };
    this.index = 0; this.index2 = 0;
    this.logcontent = [];
    this.instaAccountsContent = [];
    this.instaAccountsContentID = [];
    this.animatedValue = new Animated.Value(0);

    this.showOverlay = 1;
    this.InstaAccountcount = 0;
    this.InstaAccountList = "";
    this.logInput = React.createRef();
    this.passInput = React.createRef();
    this.addAccount = 0;

    this.valider = React.createRef();
    this.boost = React.createRef();

    this.loading=1;
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
  async _FetchInstaAccount() {
    console.log("Fetching ActiveInstaAccount...")
    try {
      const value = await AsyncStorage.getItem('ActiveInstaAccount:'+getUserID());
      if (value !== null) {
        console.log("Récupération de ActiveInstaAccount : ");
        console.log(value);
        return value;
      } else console.log("Pas de ActiveInstaAccount.");
    } catch (error) {
      console.log("Error fetching:"+error);
    }
  };
  async _storeInstaAccount(key) {
    console.log("Saving ActiveInstaAccount...")
    try {
      await AsyncStorage.setItem('ActiveInstaAccount:'+getUserID(),key+'');
      this.props.navigation.navigate('App');
      
      //this.showInstaAccount();
      //this.getInstaAccounts();
    } catch (error) {
      console.log("Error storing:"+error);
    }
  };
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
      else
      {
        this._FetchInstaAccount().then((val) => { // Compte actuel sauvegardé
          console.log("InstaAccount fetched : "+val);
          if(val){ // val -> active userInstaID
            for(var i=0;i<(this.InstaAccountcount);i++) {
              console.log("ADD INSTA ACCOUNT "+i+" ["+this.InstaAccountList[i].user+"] id ["+this.InstaAccountList[i].instauser_id+"]");
              if(this.InstaAccountList[i].instauser_id == val){
                setUserInsta(this.InstaAccountList[i].instauser_id,this.InstaAccountList[i].user);
              }
              else {
                this.addMoreInstaAccount(this.InstaAccountList[i].user, this.InstaAccountList[i].instauser_id);
              }
            }    
          } else { // 1er compte actif par défaut
            for(var i=0;i<(this.InstaAccountcount);i++) {
              console.log("ADD INSTA ACCOUNT "+i+" ["+this.InstaAccountList[i].user+"] id ["+this.InstaAccountList[i].instauser_id+"]");
              if(i==0) setUserInsta(this.InstaAccountList[i].instauser_id,this.InstaAccountList[i].user);
              if(i>=1){
                this.addMoreInstaAccount(this.InstaAccountList[i].user, this.InstaAccountList[i].instauser_id);
              } 
            }     
          }
          this.loading = 0;
          this.forceUpdate(); // met à jour l'affichage des comptes
        }); 
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
  delInstaAccount(userInstaID,userInsta) {
    console.log("Deleting instaAccount action...");
    Alert.alert(
      'Avertissement',
      'Supprimer de la liste des comptes le compte Instagram "'+userInsta+'" ?',
      [
        {text: 'Annuler', onPress: () => {return}, style: 'cancel'},
        {text: 'Supprimer', onPress: () => {
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
            console.log("ERROR DEL INSTA ACCOUNT : "+error);
          });
          this.showInstaAccount();
          this.getInstaAccounts();
          this.forceUpdate();
        }      
        },
      ],
      { cancelable: true }
    );
  }
  getUserInstaFromID(userInstaID){
    for(var i = 0;i<=this.InstaAccountcount;i++){
      console.log(i+":"+this.instaAccountsContentID[i]+" = "+userInstaID+" ?")
      if( this.instaAccountsContentID[i] == userInstaID )
      {
        console.log("yes!");
        return this.instaAccountsContent[i];
      }
    }
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
  static navigationOptions = {
    header: null,
  };
  // =====================================================================================================================
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
            <View key = { key } style = { { marginBottom: 25 } }>
              <TouchableOpacity activeOpacity = { 0.7 }  onPress={ () => { this.delInstaAccount(this.instaAccountsContentID[key],this.instaAccountsContent[key]); }} style={{zIndex: 4, left: 100, position: 'absolute'}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff', width: 60, height: 40, marginTop: 17, alignItems: 'center', justifyContent: 'center'}}>
                    {<Ionicons name='md-trash' size={24} color='#700' style={{}} />}
                  </View>
                </View>
              </TouchableOpacity>
          
              <TouchableOpacity activeOpacity = { 0.4 }  onPress={ () => { this._storeInstaAccount(this.instaAccountsContentID[key]); }} style={{zIndex: 3, width: '100%', height: 75, marginBottom: 100}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={this.state.pressStatus ? styles.accountButPress : styles.accountBut}>
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
      accountIcon = <Text>{getUserInsta()}</Text>;
    }
    // ===============================================================================================================
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        <View style={{marginBottom: 100}}>
            <TouchableOpacity onPress={ () => { this.props.navigation.toggleDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 0, left: 15}}>
              <Ionicons name='md-menu' size={44} color='#3800bf' />
            </TouchableOpacity>
          <Text style={{fontSize: 30, fontWeight: '700', position: 'absolute', top: 5, right: 15}}>Mes comptes</Text>
        </View>
        { this.loading==1 && 
            <View style={{textAlign: 'center', alignItems: 'center'}}>
              <Image style={{height: 120, width: 120, alignItems: 'center'}} source={require('../assets/images/load2.gif')} />
            </View>
          }
          { this.loading==0 && 
          <View>
            <TouchableOpacity activeOpacity = { 0.4 }  onPress={ () => {this.props.navigation.navigate('App'); this.addAccount = 0;}} style={{zIndex: 3, height: 75, marginBottom: 100}}>
              <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                <View style={this.state.pressStatus ? styles.accountButPress : styles.accountBut}>
                  { accountIcon }
                </View>
              </View>
            </TouchableOpacity>
                { ( this.InstaAccountcount==0 || this.addAccount==1 ) && // PAS DE COMPTE, CREATION
                  <View style={{backgroundColor: '#fff', borderRadius: 10, marginRight: 50, marginLeft: 50, zIndex: 10}}>
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

                    <TouchableOpacity activeOpacity = { 0.4 }  onPress={ () => { this.addAccount=1; this.forceUpdate(); }} style={{zIndex: 3, width: '100%', height: 200}}>
                      <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                        <View style={{borderWidth: 1, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#3800bf', width: 45, height: 45, alignItems: 'center', justifyContent: 'center'}}>
                          {<Ionicons name='md-add' size={20} color='#fff' style={{}} />}
                        </View>
                      </View>
                      <Text style={{textAlign: 'center', marginTop: 0, fontWeight: '300'}}>Ajouter un compte Instagram</Text>
                    </TouchableOpacity>
                  </View>
                }
          </View>
          }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  accountBut: {
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#ccc', 
    backgroundColor: '#fff', 
    width: '80%', 
    height: 75, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  accountButPress: {
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: '#ccc', 
    backgroundColor: '#fff', 
    width: '80%', 
    height: 75, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#999'
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
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
    marginTop: 50,
    marginLeft: 25,
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
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10
  },
});
