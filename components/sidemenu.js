import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { getUserInsta, getInstaAccount, getUserInstaID } from '../api';

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
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
                  borderWidth: 1, 
                  borderRadius: 10, 
                  borderColor: '#ccc', 
                  shadowRadius: 8, 
                  shadowColor: '#455b63', 
                  shadowOffset: {  width: 4,  height: 4,  }, 
                  shadowOpacity: 0.9, 
                  elevation: 1,
                }}
                source={{uri: getInstaAccount(getUserInstaID()).avatar}}
              />
            </View>
            <View>
              <Text style={styles.sectionHeadingStyle}>
                {getUserInsta()}
              </Text>
            </View>
          </View>
          }
          <View style={{borderTopWidth: 1, borderTopColor: '#ccc', marginLeft: 38}}>
            <TouchableOpacity ref={this.valider} activeOpacity = { 0.6 }  onPress = { () => { ToastAndroid.show('Fonction non disponible...', ToastAndroid.SHORT); } }>     
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