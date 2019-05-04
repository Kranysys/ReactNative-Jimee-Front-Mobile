import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Animated } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox, Button } from 'react-native-elements';
import { MonoText } from '../components/StyledText';
import { api, bearerToken } from '../api';

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.likesChecked = false;
    this.commentsChecked = false;
    this.followChecked = false;
    this.unfollowChecked = false;

    this.accountFollowers = 0;
    this.accountPosts = 0;
    this.accountFollowing = 0;
    this.accountPictureId = 0;
    this.request(); // obtension des informations instagram

    this.state = { valueArray: [] };
    this.index = 0;
    this.logcontent = [];
    this.animatedValue = new Animated.Value(0);

    this.getLogs();
    this.getInstaAccounts();

    this.showOverlay = 0;
  }
  request() {
    var command = "info";
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
      },
		}).then((response) => response.json()).then((responseJson) => {
      console.log("fl "+responseJson[0].followers+" / "+responseJson[0].followings);
      if(responseJson[0].followers>0) this.accountFollowers = responseJson[0].followers; else this.accountFollowers = "-";
      if(responseJson[0].posts>0) this.accountPosts = responseJson[0].posts; else this.accountPosts = "-";
      if(responseJson[0].followings>0) this.accountFollowing = responseJson[0].followings; else this.accountFollowing = "-";
      this.forceUpdate();
    }).catch((error) =>{
        Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
      });

    
    command = "configUserInsta";
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((responseJson) => {
      console.log("fl "+responseJson.followers);
      if(responseJson[0].follows>0) this.followChecked = true; else this.followChecked = true;
      if(responseJson[0].unfollows>0) this.unfollowChecked = true; else this.unfollowChecked = false;
      if(responseJson[0].comments>0) this.commentsChecked = true; else this.commentsChecked = false;
      if(responseJson[0].likes>0) this.likesChecked = true; else this.likesChecked = false;
      this.forceUpdate();
    }).catch((error) =>{
      Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
    });
  }
  updateCheck() {
    var command = "configUserInsta";
    console.log("request -> POST "+api+command);
    fetch(api+command,  {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        follows: Number(this.followChecked), 
        unfollows: Number(this.unfollowChecked),
        comments: Number(this.commentsChecked),
        likes: Number(this.likesChecked),
      })
    }).then((response) => response.json()).then((responseJson) => {
    }).catch((error) =>{
      Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
    });
  }
  getLogs() {
    var command = "userlogs";
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      }
    }).then((response) => response.json()).then((responseJson) => {
      console.log("Response: "+responseJson[0].id);
      for(var i=0;i<10;i++) {
        
        if(responseJson[i].id>0){
          console.log("ADD LOG "+responseJson[i].user+" : "+responseJson[i].type);
          this.addMoreLog(responseJson[i].user+" : "+responseJson[i].type);
        }
      }
    }).catch((error) =>{
      console.log("ERROR LOGS : "+error);
      //Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles");
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
    var command = "instaAccounts?userId="+1; // Behindspiks
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+bearerToken,
      }
    }).then((response) => response.json()).then((responseJson) => {
      var count = Object.keys(responseJson).length;
      //console.log(JSON.stringify(responseJson));
      if(!count){
        console.log("NO INSTA ACCOUNT");
      }
      for(var i=0;i<count;i++) {
        if(responseJson[i].instauser_id){
          console.log("ADD INSTA ACCOUNT "+responseJson[i].user+" id "+responseJson[i].instauser_id);
          //this.addMoreLog(responseJson[i].user+" : "+responseJson[i].type);
        }
      }
    }).catch((error) =>{
      console.log("ERROR INSTA ACCOUNT : "+error);
      //Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles");
    });
  }
  showInstaAccount() {
    console.log("show insta account")
    this.showOverlay = !this.showOverlay;
    this.forceUpdate();
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
    let accountIcon = <Ionicons name='md-add' size={46} color='#090' style={{}} />;
    return (
      <ScrollView>
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
          { this.showOverlay==1 &&
            <View style={{backgroundColor: '#000', opacity: 0.8, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}></View>
          }
          <View style={styles.welcomeContainer}>
            <Image
              source={
                require('../assets/images/logo-large.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <TouchableOpacity activeOpacity = { 0.8 }  onPress={ () => {this.showInstaAccount()}}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
              <View style={{borderWidth: 3, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#eee', width: 75, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                { accountIcon }
              </View>
            </View>
          </TouchableOpacity>

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 20}}>
            <Text style={styles.getStartedText}>Abonnées</Text>
            <Text style={styles.getStartedText}>Publications</Text>
            <Text style={styles.getStartedText}>Abonnements</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 20}}>
            <Text style={styles.instaNumbers}>{this.accountFollowers}</Text>
            <Text style={styles.instaNumbers}>{this.accountPosts}</Text>
            <Text style={styles.instaNumbers}>{this.accountFollowing}</Text>
          </View>

          <View style={styles.tabBarInfoContainer}>
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
          <View style={styles.tabBarInfoContainer}>
            {rows}
          </View>
        </View>
      </ScrollView>
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
});
