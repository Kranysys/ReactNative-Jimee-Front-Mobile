import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import AccountsScreen from '../screens/AccountsScreen';

const AuthStack = createStackNavigator({ SignIn: LoginScreen });
const RegisterStack = createStackNavigator({ Register: RegisterScreen });
const AccountsStack = createStackNavigator({ Accounts: AccountsScreen });

import home from '../screens/Home';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html

  Auth: AuthStack,
  Accounts: home, //AccountsStack,
  App: MainTabNavigator,
  Register: RegisterStack,
}));