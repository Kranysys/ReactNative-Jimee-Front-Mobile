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
});

const drawernavtab = createDrawerNavigator({
  Item1: {
      screen: MainTabNavigator,
    }
  }, {
    contentComponent: SideMenu, 
});

export default createAppContainer(createSwitchNavigator({
  Auth: AuthStack,
  Accounts: drawernav,
  App: drawernavtab,
  Register: RegisterStack,
}));