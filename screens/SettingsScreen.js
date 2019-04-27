import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { api } from '../api';

export default class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    this.minFollowers = 0;
    this.maxFollowers = 0;
    this.minFollowings = 0;
    this.maxFollowings = 0;
    this.tagLikes = "-";
    this.tagComments = "-";
    this.request(); // obtension des settings instagram
  }
  request() {
    let command = "configFollow";
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson[0].min_follows>0) this.minFollowings = responseJson[0].min_follows;
      if(responseJson[0].max_follows>0) this.maxFollowings = responseJson[0].max_follows;
      if(responseJson[0].min_followers>0) this.minFollowers = responseJson[0].min_followers;
      if(responseJson[0].max_followers>0) this.maxFollowers = responseJson[0].max_followers;
      this.forceUpdate();
    }).catch((error) =>{
        Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
      });

      command = "tagLikes";
      console.log("request -> GET "+api+command);
      fetch(api+command,  {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
      }).then((response) => response.json()).then((responseJson) => {
        var count = Object.keys(responseJson).length;
        //console.log("lenght "+count+"/"+responseJson[0].tag);
        if(count){this.tagLikes="";}
        for(var i=0;i<count;i++){
          this.tagLikes += "["+responseJson[i].tag+"] ";
        }
        this.forceUpdate();
      }).catch((error) =>{
        Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
      });

      command = "tagComments";
      console.log("request -> GET "+api+command);
      fetch(api+command,  {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
      }).then((response) => response.json()).then((responseJson) => {
        var count = Object.keys(responseJson).length;
        //console.log("lenght "+count+"/"+responseJson[0].tag);
        if(count){this.tagComments="";}
        for(var i=0;i<count;i++){
          this.tagComments += "["+responseJson[i].tagcomments+"] ";
        }
        this.forceUpdate();
      }).catch((error) =>{
        Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles\n-Vérifiez que votre TPBox fonctionne");
      });
  }
  static navigationOptions = {
    title: 'Paramètres',
  };

  render() {
    return(
      <ScrollView>
        <View style={styles.container}>
          <View style={{marginBottom: 15}}>
            <Text>Minimum followers</Text>
            <Text style={{fontSize: 20}}>{this.minFollowers}</Text>
            <Text>Maximum followers</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowers}</Text>
            <Text>Minimum followings</Text>
            <Text style={{fontSize: 20}}>{this.minFollowings}</Text>
            <Text>Maximum followings</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowings}</Text>
          </View>
          <View style={{marginBottom: 15, alignItems: 'center', padding: 10}}>
            <Text>Tags Likes</Text>
            <Text style={{fontSize: 14, alignItems: 'center'}}>{this.tagLikes}</Text>
          </View>
          <View style={{marginBottom: 15, alignItems: 'center', padding: 10}}>
            <Text>Tags Comments</Text>
            <Text style={{fontSize: 14, alignItems: 'center'}}>{this.tagComments}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
});
