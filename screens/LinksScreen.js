import React from 'react';
import { ScrollView, StyleSheet, View , Text, Animated, Alert, TouchableOpacity } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';
import { api, bearerToken, userInstaID } from '../api';

export default class LinksScreen extends React.Component {
  constructor(props){
    super(props);
    this.minFollowers = 0;
    this.maxFollowers = 0;
    this.minFollowings = 0;
    this.maxFollowings = 0;

    this.commenttagscontent = [];
    this.liketagscontent = [];
    this.state = { valueArray: [], valueArray2: [] };
    this.index = 0; this.index2 = 0;
    this.animatedValue = new Animated.Value(0);

    this.request(); // obtension des settings instagram
  }
  request() {
    let command = "configFollow&userInstaID="+userInstaID;
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+bearerToken,
      },
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson[0].min_follows>0) this.minFollowings = responseJson[0].min_follows;
      if(responseJson[0].max_follows>0) this.maxFollowings = responseJson[0].max_follows;
      if(responseJson[0].min_followers>0) this.minFollowers = responseJson[0].min_followers;
      if(responseJson[0].max_followers>0) this.maxFollowers = responseJson[0].max_followers;
      this.forceUpdate();
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });

    command = "tagLikes&userInstaID="+userInstaID;
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+bearerToken,
      },
    }).then((response) => response.json()).then((responseJson) => {
      var count = Object.keys(responseJson).length;
      //console.log("lenght "+count+"/"+responseJson[0].tag);
      if(count){this.tagLikes="";}
      for(var i=0;i<count;i++){
        this.addMoreTag(0,responseJson[i].tag);
      }
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });

    //this.index = 0;
    command = "tagComments&userInstaID="+userInstaID;
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+bearerToken,
      },
    }).then((response) => response.json()).then((responseJson) => {
      var count = Object.keys(responseJson).length;
      //console.log("lenght "+count+"/"+responseJson[0].tag);
      if(count){this.tagComments="";}
      for(var i=0;i<count;i++){
        this.addMoreTag(1,responseJson[i].tagcomments);
      }
    }).catch((error) =>{
      Alert.alert("ERREUR",error+"\n\n-Activez le Wifi ou les données mobiles");
    });
    //this.forceUpdate();
  }
  addMoreTag(type,contenu) {
    this.animatedValue.setValue(0);
    if(type==0) this.liketagscontent[this.index] = contenu;
    if(type==1) this.commenttagscontent[this.index2] = contenu;

    if(type==0) {
    let newlyAddedValue = { index: this.index };
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
    } else {
      let newlyAddedValue = { index2: this.index2 }
      this.setState({ valueArray2: [ ...this.state.valueArray2, newlyAddedValue ] }, () =>
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
              this.index2 = this.index2 + 1;
          }); 
      });  
    }
}
deleteTag(type,id,tag){
  let command = "tagLikes";
  if(type==1) command = "tagComments";
  Alert.alert(
    'Avertissement',
    'Supprimer le tag "'+tag+'" des '+command+" ?",
    [
      {text: 'Annuler', onPress: () => {return}, style: 'cancel'},
      {text: 'Supprimer', onPress: () => {
        console.log("request -> DELETE "+api+command);
        fetch(api+command,  {
          method: 'DELETE',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+bearerToken,
          },
          body : {
            
          }
        }).then((response) => response.json()).then((responseJson) => {
          this.forceUpdate();
        }).catch((error) =>{
        });
      }      
      },
    ],
    { cancelable: true }
  );
}
addTag(type){
  let command = "tagLikes";
  if(type==1) command = "tagComments";
  Alert.alert("comming..");
}
  static navigationOptions = {
    title: 'Mes profils',
  };

  render() {
    const animationValue = this.animatedValue.interpolate(
      {
        inputRange: [ 0, 1 ],
        outputRange: [ -59, 0 ]
      });
      let likeTags = this.state.valueArray.map(( item, key ) =>
      {
          if(( key ) == this.index)
          {
              return(
                  <Animated.View key = { key } style = {[ styles.viewHolder, { opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                    <View style={{position: 'relative'}}>
                      <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 15}}>{ this.liketagscontent[item.index] } </Text>
                      <TouchableOpacity style={{ position: 'absolute', right: 10, top: 13, alignItems: 'center'}} onPress={ () => { } }><Ionicons name='md-close-circle' size={15} color='#fff'/></TouchableOpacity>
                    </View>
                  </Animated.View>
              );
          }
          else
          {
              return(
                <View key = { key } style={{position: 'relative'}}>
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 15}}>{ this.liketagscontent[item.index] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 13, alignItems: 'center'}} onPress={ () => { this.deleteTag(0,item.index,this.liketagscontent[item.index]); } }><Ionicons name='md-close-circle' size={15} color='#fff'/></TouchableOpacity>
                </View>
              );
          }
      });
      let commentTags = this.state.valueArray2.map(( item, key ) =>
      {
          if(( key ) == this.index2)
          {
              return(
                <Animated.View key = { key } style = {[ styles.viewHolder, { opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                <View style={{position: 'relative'}}>
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 15}}>{ this.commenttagscontent[item.index2] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 13, alignItems: 'center'}} onPress={ () => {this.deleteTag(1,item.index2,this.commenttagscontent[item.index2]);  } }><Ionicons name='md-close-circle' size={15} color='#fff'/></TouchableOpacity>
                </View>
              </Animated.View>
              );
          }
          else
          {
              return(
                <View  key = { key } style={{position: 'relative'}}>
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 15}}>{ this.commenttagscontent[item.index2] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 13, alignItems: 'center'}} onPress={ () => { this.deleteTag(1,item.index2,this.commenttagscontent[item.index2]); } }><Ionicons name='md-close-circle' size={15} color='#fff'/></TouchableOpacity>
                </View>
              );
          }
      });
    return (
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
          <Text>Tags Likes</Text>
          <View style={{marginBottom: 5, padding: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
            {likeTags}
            <TouchableOpacity style={{marginTop: 5, marginLeft: 5}} onPress={ () => { this.addTag(0); } }><Ionicons name='md-add-circle' size={32} color='#6D48F7'/></TouchableOpacity>
          </View>
          <Text>Tags Comments</Text>
          <View style={{marginBottom: 5, padding: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
            {commentTags}
            <TouchableOpacity style={{marginTop: 5, marginLeft: 5}} onPress={ () => { this.addTag(1); } }><Ionicons name='md-add-circle' size={32} color='#6D48F7'/></TouchableOpacity>
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

