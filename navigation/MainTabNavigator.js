import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Accueil',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-home'}
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Config',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-people'}
    />
  ),
};

const StatsStack = createStackNavigator({
  Settings: SettingsScreen,
});

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-pie'}
    /> 
  ),
};

const MissionsStack = createStackNavigator({
  Settings: SettingsScreen,
});

MissionsStack.navigationOptions = {
  tabBarLabel: 'Missions',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-flag'}
    />
  ),
};

const ActivityStack = createStackNavigator({
  Settings: SettingsScreen,
});

ActivityStack.navigationOptions = {
  tabBarLabel: 'Activité',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'md-megaphone'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  StatsStack,
  MissionsStack,
  ActivityStack
});
