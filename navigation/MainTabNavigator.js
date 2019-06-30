import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Accueil',
  tabBarIcon: ({ tintColor }) => (
    <Icon
      size={32}
      color={tintColor}
      name={'ios-home'}
    />
  )
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Config',
  tabBarIcon: ({ tintColor }) => (
    <Icon
      size={28}
      color={tintColor}
      name={'md-people'}
    />
  ),
};

const StatsStack = createStackNavigator({
  Settings: SettingsScreen,
});

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ tintColor }) => (
    <Icon
      size={28}
      color={tintColor}
      name={'ios-pie'}
    /> 
  ),
};

const MissionsStack = createStackNavigator({
  Settings: SettingsScreen,
});

MissionsStack.navigationOptions = {
  tabBarLabel: 'Missions',
  tabBarIcon: ({ tintColor }) => (
    <Icon
      size={32}
      color={tintColor}
      name={'md-flag'}
    />
  ),
};

const ActivityStack = createStackNavigator({
  Settings: SettingsScreen,
});

ActivityStack.navigationOptions = {
  tabBarLabel: 'Activité',
  tabBarIcon: ({ tintColor }) => (
    <Icon
      size={26}
      color={tintColor}
      name={'md-megaphone'}
    />
  ),
};

export default createMaterialTopTabNavigator({
  HomeStack,
  LinksStack,
  StatsStack,
  MissionsStack,
  ActivityStack
}, {
  initialRouteName: 'HomeStack',
  swipeEnabled: true,
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    pressColor: '#6170fc',
    showIcon: true,
    activeTintColor: '#6170fc',
    inactiveTintColor: '#d1d8eb',
    style: {
      backgroundColor: 'white',
      color: '#6170fc',
    },
    labelStyle: {
      fontSize: 12,
      fontFamily: 'Roboto',
    }
  }
});
