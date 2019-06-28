import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity, ToastAndroid, Image, Linking } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { getUserInsta, getInstaAccount, getUserInstaID } from '../api';

class SideMenu extends Component {
  constructor(props){
    super(props);

    this.state = { 
      valueArray: [], 
      valueArray2: [], 
    };
  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    let accountList = this.state.valueArray2.map(( item, key ) =>
    { console.log("ACCOUNTLIST : "+this.instaAccountsContent[key]+" ["+key+"]");
      if(this.instaAccountsContentID[key] && this.instaAccountsContent[key]){
        return(
          // Icone suppression du compte instagram
            <View key = { key }>
              <TouchableOpacity activeOpacity = { 0.7 }  onPress={ () => { this.delInstaAccount(this.instaAccountsContentID[key],this.instaAccountsContent[key]); }} style={{zIndex: 4, left: 20, position: 'absolute', }}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={{borderRadius: 20, borderColor: '#ccc', backgroundColor: '#C1BAFC', width: 35, height: 35, marginTop: 17, alignItems: 'center', justifyContent: 'center'}}>
                    {<Ionicons name='md-trash' size={18} color='#fff' style={{}} />}
                  </View>
                </View>
              </TouchableOpacity>
          
              <TouchableOpacity activeOpacity = { 0.4 }  onPress={ () => { this._storeInstaAccount(this.instaAccountsContentID[key],this.instaAccountsContent[key]); }} style={{zIndex: 3, width: '100%', height: 75, marginBottom: 9, }}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                  <View style={styles.accountBut}>
                    <Image
                        style={{width: 55, height: 55, borderWidth: 1, borderRadius: 10, borderColor: '#ccc', position: 'absolute', top: 8, left: 40 }}
                        source={{uri: getInstaAccount(this.instaAccountsContentID[key]).avatar}}
                      />
                    <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 20, left: 110 }}>
                      <Text style={{fontSize: 16, fontWeight: '200', fontFamily: 'Roboto'}}>{this.instaAccountsContent[key]}</Text>
                      <Text style={{fontSize: 12, color: '#bbb', fontFamily: 'Roboto'}}>@{this.instaAccountsContent[key]}</Text>
                    </View>

                    <View style={{height: '80%', width: '25%', position: 'absolute', right: 0, top: 0, borderLeftColor: '#ddd', borderLeftWidth: 1, flex: 1, flexDirection: 'column', top: '10%', bottom: '10%'}}>
                      <View style={{position: "absolute", borderBottomColor: '#ddd', borderBottomWidth: 1, width: '75%', height: 30, left: '12%', top: 0  }}>
                        <Text style={{fontWeight: '100', marginLeft: 12, fontFamily: 'Roboto'}}>{getInstaAccount(this.instaAccountsContentID[key]).n_followers}</Text>
                        <View style={{position: "absolute", bottom: 0, left: 12, padding: '2%'}}>
                          <Text style={{fontSize: 9, color: '#bbb', fontFamily: 'Roboto'}}>followers</Text>
                        </View>
                      </View>
                      <View style={{position: "absolute", bottom: 0,  width: '75%', height: 30,  left: '12%',  }}>
                        <Text style={{fontWeight: '100', marginLeft: 12, marginTop: 3, fontFamily: 'Roboto'}}>{getInstaAccount(this.instaAccountsContentID[key]).n_followings}</Text>
                        <View style={{position: "absolute", bottom: 0, left: 12, padding: '0%'}}>
                          <Text style={{fontSize: 9, color: '#bbb', fontFamily: 'Roboto'}}>followings</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
        );
      }
    });
    return (
      <View style={styles.container}>
        <ScrollView style={{marginTop: 25}}>
          { getUserInsta() != "" && 
          <View styles={{flex: 1, flexDirection: 'row', marginLeft: 38}}>
            <View>
              <Image
                style={{
                  width: 85, 
                  height: 85, 
                  marginLeft: 25,
                  marginBottom: 25,
                  borderWidth: 1, 
                  borderRadius: 10, 
                  borderColor: '#ccc', 
                  shadowRadius: 8, 
                  shadowColor: '#455b63', 
                  shadowOffset: {  width: 4,  height: 4,  }, 
                  shadowOpacity: 0.9
                }}
                source={{uri: getInstaAccount(getUserInstaID()).avatar}}
              />
              <View style={{flex: 1, flexDirection: 'column', position: 'absolute', top: 20, left: 130,  }}>
                <Text style={{fontSize: 24, fontWeight: '200', fontFamily: 'Roboto', color: '#8C87FC'}}>{getUserInsta()}</Text>
                <Text style={{fontSize: 14, color: '#bbb', fontFamily: 'Roboto', color: '#8C87FC'}}>@{getUserInsta()}</Text>
              </View>
            </View>

            <View>
                {accountList}
                { /* AJOUTER UN COMPTE */ } 
                <TouchableOpacity activeOpacity = { 0.4 }  onPress={ () => {  }} style={{zIndex: 3, width: '100%', height: 90, }}>
                  <View style={{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                    <View style={{borderWidth: 1, borderRadius: 50, borderColor: '#ccc', backgroundColor: '#5643FF', width: 45, height: 45, alignItems: 'center', justifyContent: 'center', shadowRadius: 8, shadowColor: '#455b63', shadowOffset: {  width: 4,  height: 4,  }, shadowOpacity: 0.9, elevation: 1,}}>
                      {<Ionicons name='md-add' size={20} color='#fff' style={{}} />}
                    </View>
                    <Text style={{textAlign: 'center', marginTop: 0, fontWeight: '300', fontSize: 16, marginLeft: 10}}>ajouter compte</Text>
                  </View>
                </TouchableOpacity>
            </View>
          </View>
          }
          <View style={{borderTopWidth: 1, borderTopColor: '#ccc', paddingLeft: 38}}>
            <TouchableOpacity ref={this.valider} activeOpacity = { 0.6 }  onPress = { () => { /*ToastAndroid.show('Fonction non disponible...', ToastAndroid.SHORT);*/ Linking.openURL('https://jimee.fr') } }>     
              <Text style={styles.sectionHeadingStyle}>
                Mon Abonnement
              </Text>        
              <Text style={styles.sectionHeadingStyle}>
                Mes Réglages
              </Text>      
              <Text style={styles.sectionHeadingStyle}>
                Chat
              </Text>      
              <Text style={styles.sectionHeadingStyle2}>
                A Propos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity ref={this.valider} activeOpacity = { 0.6 }  onPress = { () => { this.props.navigation.navigate('Auth');} }>     
              <Text style={styles.sectionHeadingStyle2}>
                Se Déconnecter
              </Text> 
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>Jimee 1.0 BETA</Text>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1
  },
  navItemStyle: {
    padding: 10
  },
  navSectionStyle: {
    backgroundColor: 'lightgrey'
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#8C87FC',
    fontSize: 22,
  },
  sectionHeadingStyle2: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#73798B',
    fontSize: 22,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'lightgrey'
  }
});

export default SideMenu;