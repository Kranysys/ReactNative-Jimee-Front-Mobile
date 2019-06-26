import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, 
TouchableWithoutFeedback, View, Alert, Animated, TextInput, ToastAndroid,
AsyncStorage, Switch, StatusBar } from 'react-native';
//import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
//import { MonoText } from '../components/StyledText';
import { api, getToken, getUserID, setUserID, getUserInstaID, getUserInsta, setUserInsta, getInstaAccount } from '../api';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);

    // Obtension de l'ID de l'utilisateur + nettoyage token
    //this.getID();

    this.request(); 

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

    this.valider = React.createRef();
    this.boost = React.createRef();

    this.logscount = -1;

    this.loading = 1;
  }
  /*getID() {
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
  }*/
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
      this.loading = 0;
      this.forceUpdate();
      this.getLogs(); // Affichage des logs
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  updateCheck() {
    this.valider.disabled=1;
    this.boost.disabled=1;
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
        userInstaID: getUserInstaID(),
      })
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson){
        console.log("Réponse du processus python:");
        console.log(responseJson);
        if( responseJson.body == "Okay")
        {  
          ToastAndroid.show("Processus lancé avec succès !",ToastAndroid.LONG);
        } else {
          ToastAndroid.show("Erreur, le processus ne s'est pas lancé.",ToastAndroid.LONG);
        }
      }
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
  }
  getLogs() {
    if(!getToken()) return;
    this.logcontent = [];
    this.state.valueArray = [];
    var command = "userlogs?userInstaID="+getUserInstaID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      }
    }).then((response) => response.json()).then((responseJson) => {
      this.logscount = Object.keys(responseJson).length;
      //console.log("Nombre de logs : "+this.logscount);
      //console.log(JSON.stringify(responseJson));
      if(this.logscount > 0){
        for(var i=0;i<10 && i < this.logscount;i++) {
          if(responseJson[i].id>0){
            //console.log("ADD LOG "+responseJson[i].user+" : "+responseJson[i].type);
            this.addMoreLog("@"+responseJson[i].user+" : "+responseJson[i].type);
          }
        }
      } else {
        this.forceUpdate();
        ToastAndroid.show("Aucun log à afficher.",ToastAndroid.SHORT);
      }
      setTimeout(() => { this.getLogs() }, 12000); // Logs toutes les 12s
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
  /*async _FetchInstaAccount() {
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
      this.showInstaAccount();
      this.getInstaAccounts();
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
          if(this.InstaAccountcount>0 && this.logscount<=0) {
            this.getLogs(); // Affichage des logs
            this.forceUpdate(); // met à jour l'affichage des comptes
          }
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
  }*/
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
                    <Text style ={{padding: 5, borderColor: '#000', borderRadius: 5, borderWidth: 0, margin: 5}}><Ionicons name='md-heart' size={15} color='#A7A2FB' style={{}} /> { this.logcontent[item.index] }</Text>
                </Animated.View>
            );
        }
        else
        {
            return(
                <View key = { key } style = { styles.viewHolder }>
                    <Text style ={{padding: 5, borderColor: '#000', borderRadius: 5, borderWidth: 0, margin: 5}}><Ionicons name='md-heart' size={15} color='#A7A2FB' style={{}} /> { this.logcontent[item.index] }</Text>
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
          
              <TouchableOpacity activeOpacity = { 0.8 }  onPress={ () => { this._storeInstaAccount(this.instaAccountsContentID[key]); }} style={{zIndex: 3, position: 'absolute', top: (220+key*100), width: '100%'}}>
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
    let accountIcon = <Image
                        style={{width: 120, height: 120, borderWidth: 1, borderRadius: 10, borderColor: '#ccc',     shadowRadius: 8, 
                        shadowColor: '#455b63', 
                        shadowOffset: {  width: 4,  height: 4,  }, 
                        shadowOpacity: 0.9, }}
                        source={{uri: getInstaAccount(getUserInstaID()).avatar}}
                      />;
    return (
      <ScrollView style={styles.AndroidSafeArea}>
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
          {/* this.showOverlay==1 && // LISTE DES COMPTES INSTAGRAM
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
              */}
        <View style={{marginBottom: 35}}>
            <TouchableOpacity onPress={ () => { this.props.navigation.toggleDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 15, left: 20}}>
              <Image source={require('../images/menu.png')} />
            </TouchableOpacity>
          <Text style={{fontSize: 30, fontWeight: '700', position: 'absolute', top: 7, left: 85, fontFamily: 'Roboto'}}>Mes comptes</Text>
        </View>

        { this.loading==1 && 
          <View style={{textAlign: 'center', alignItems: 'center'}}>
            <Image style={{height: 120, width: 120, alignItems: 'center'}} source={require('../assets/images/load2.gif')} />
          </View>
        }
        { this.loading==0 && 
        <View>
          <View style={{padding: 20}}>
            <View style={{borderWidth: 1, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#fff', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
              <View style={{left: 0, top: 0, padding: 25, position: 'absolute',}}>
                { accountIcon } 
              </View>
              <View style={{left: 165, right: 15, top: 15, borderColor: '#ccc', backgroundColor: '#fff', padding: 15, position: 'absolute', borderBottomColor: '#ddd', }}>
                <Text style={{fontWeight: 'bold', fontSize: 23, marginBottom: 3}}>{getUserInsta()}</Text>
                <Text style={{fontSize: 15, fontFamily: 'Roboto', color: '#bbb'}}>@{getUserInsta()}</Text>
              
                <View style={{height: 60, width: '100%', flex: 1, flexDirection: 'column', borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10, marginTop: 10}}>
                  <View style={{borderRightColor: '#ddd', borderRightWidth: 1, width: '50%', height: '90%' }}>
                    <Text style={{fontWeight: '600', marginLeft: 12, fontFamily: 'Roboto', fontSize: 18}}>{getInstaAccount(getUserInstaID()).n_followers}</Text>
                    <View style={{bottom: 0, left: 12, padding: '2%'}}>
                      <Text style={{fontSize: 11, color: '#bbb', fontFamily: 'Roboto'}}>followers</Text>
                    </View>
                  </View>
                {/*<View style={{position: "absolute", bottom: 0,  width: '75%', height: 30, left: '12%', BottomWidth: 1, }}>
                    <Text style={{fontWeight: '100', marginLeft: 12, marginTop: 3, fontFamily: 'Roboto'}}>{getInstaAccount(getUserInstaID()).n_followings}</Text>
                    <View style={{position: "absolute", bottom: 0, left: 12, padding: '0%'}}>
                      <Text style={{fontSize: 9, color: '#bbb', fontFamily: 'Roboto'}}>followings</Text>
                    </View>
                  </View>*/}
                </View>
              </View>

              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 10,zIndex:1,marginTop: 160, width: '85%', borderTopWidth: 1, borderTopColor: '#ddd'}}>
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.likesChecked=!this.likesChecked; this.forceUpdate();}} value={this.likesChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.commentsChecked=!this.commentsChecked; this.forceUpdate();}} value={this.commentsChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.followChecked=!this.followChecked;this.forceUpdate();}} value={this.followChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.unfollowChecked=!this.unfollowChecked;this.forceUpdate();}} value={this.unfollowChecked} />
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 10,zIndex:1,width:'100%', paddingLeft: '12%', paddingRight: '12%', paddingBottom: '12%'}}>
                <Text style={styles.getStartedText}>like</Text>
                <Text style={styles.getStartedText}>comments</Text>
                <Text style={styles.getStartedText}>follow</Text>
                <Text style={styles.getStartedText}>unfollow</Text>
              </View>
              <Text style={{position: 'absolute', bottom: 9, right: 9, fontSize: 9, color: '#bbb'}}>Config 1 ></Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity = { 0.8 } style={{zIndex: 3, paddingLeft: 20, paddingRight: 20}}>
            <View style={{borderWidth: 1, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#5948FF', width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={{color: '#A599FF'}}>Booster mon compte<Ionicons name='md-information-circle' size={12} color='#A599FF' style={{marginTop: 12}} /></Text>
              <Ionicons name='md-heart' size={36} color='#302597' style={{position: 'absolute', right: 25, top: 5}} />
            </View>
          </TouchableOpacity>

          {/*<View style={{zIndex: 1,}}>
            <TouchableOpacity ref={this.valider} activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b3', borderWidth: 1, borderColor: '#999', height: 40, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.updateCheck(); } }>
              <Ionicons name='md-checkmark' size={38} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> VALIDER </Text>
            </TouchableOpacity>
            <TouchableOpacity ref={this.boost} activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#BC3434', borderWidth: 1, borderColor: '#999', height: 40, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.addMoreLog(); } }>
              <Ionicons name='md-jet' size={38} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}> BOOST </Text>
            </TouchableOpacity>
          </View>
          */}

          <View style={{padding: 20}}>
            <View style={{borderWidth: 1, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#fff', width: '100%', alignItems: 'center', justifyContent: 'center', }}>
              { this.logscount==-1 &&
                <View>
                  <Text>Récupération de l'historique des actions...</Text>
                  <Image style={{height: 120, width: 120, alignItems: 'center'}} source={require('../assets/images/load2.gif')} />
                </View>
              }
              { this.logscount>0 &&
                <View style={{width: '90%'}}>
                  <Image style={{right: 5, top: 5, height: 50, width: 50, position: 'absolute'}} source={require('../assets/images/load2.gif')} />
                  <Text style={{fontWeight: 'bold'}}>Dernières actions</Text>
                  <View style={{zIndex: 1}}>
                    {rows}
                  </View>
                </View>
              }
            </View>
          </View>

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
    paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0
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
    fontSize: 13,
    color: '#999',
    lineHeight: 10,
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
