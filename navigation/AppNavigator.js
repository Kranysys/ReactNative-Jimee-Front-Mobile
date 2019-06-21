import React from 'react';
import { AppRegistry, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import AccountsScreen from '../screens/AccountsScreen';

import SideMenu from '../components/sidemenu'

const AuthStack = createStackNavigator({ SignIn: LoginScreen });
const RegisterStack = createStackNavigator({ Register: RegisterScreen });
const AccountsStack = createStackNavigator({ Accounts: AccountsScreen });

const drawernav = createDrawerNavigator({
  Item1: {
      screen: AccountsStack,
    }
  }, {
    contentComponent: SideMenu,
    //drawerWidth: Dimensions.get('window').width - 120,  
});

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html

  Auth: AuthStack,
  Accounts: drawernav,
  App: MainTabNavigator,
  Register: RegisterStack,
}));