/* Nicolas BAPTISTA - V1 */
import React from 'react';
import { ScrollView, StyleSheet, View , Text, Animated, Alert, TouchableOpacity, 
TouchableWithoutFeedback, TextInput, Button, Platform, StatusBar, Image, Slider } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';
import { api, getToken, getUserInstaID } from '../api';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
    this.showOverlay = 0; // affichage ajout tag
    this.command = ""; // commande (tagLikes/tagComments)
    this.tagInput = React.createRef();

    console.log("TOKEN: "+getToken())

    this.request(); // obtension des settings instagram
  }
  request() {
    // On vide
    this.state.valueArray = []; this.state.valueArray2 = []; this.liketagscontent = []; this.commenttagscontent = [];
    this.index = 0; this.index2 = 0;

    let command = "configFollow?userInstaID="+getUserInstaID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
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

    command = "tagLikes?userInstaID="+getUserInstaID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
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
    command = "tagComments?userInstaID="+getUserInstaID();
    console.log("request -> GET "+api+command);
    fetch(api+command,  {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
    }).then(response => /*{console.log(response);}*/ response.json()).then((responseJson) => {
      var count = Object.keys(responseJson).length;
      //console.log("lenght "+count+"/"+responseJson[0].tag);
      if(count){this.tagComments="";}
      for(var i=0;i<count;i++){
        this.addMoreTag(1,responseJson[i].tagcomments);
      }
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
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
          'Authorization': 'Bearer '+getToken(),
          },
          body : JSON.stringify({
            userInstaID: getUserInstaID(),
            tag: tag,
          })
        }).then((response) => response.json()).then((responseJson) => {
        }).catch((error) =>{
          console.log("ERROR "+command+" : "+error);
        });
        this.request();
        this.forceUpdate();
      }      
      },
    ],
    { cancelable: true }
  );
}
addTag(type){
  this.tagcommand = "tagLikes";
  if(type==1) this.tagcommand = "tagComments";
  this.showOverlay = 1;
  this.forceUpdate();
}
addTagRequest() {
  console.log("request -> POST "+api+this.tagcommand);
  fetch(api+this.tagcommand,  {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+getToken(),
    },
    body: JSON.stringify({
      userInstaID: getUserInstaID(),
      tag: this.tagInput.current._lastNativeText,
    })
  }).then((response) => response.json()).then((responseJson) => {
  }).catch((error) =>{
    console.log("ERROR "+command+" : "+error);
  });
  this.showOverlay = 0;
  this.request();
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
      let likeTags = this.state.valueArray.map(( item, key ) =>
      {
          if(( key ) == this.index)
          {
              return(
                  <Animated.View key = { key } style = {[ styles.viewHolder, { opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                    <View style={{position: 'relative'}}>
                      <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 15}}>{ this.liketagscontent[item.index] } </Text>
                      <TouchableOpacity style={{ position: 'absolute', right: 10, top: 13, alignItems: 'center'}} onPress={ () => { this.deleteTag(0,item.index,this.liketagscontent[item.index]); } }><Ionicons name='md-close-circle' size={15} color='#fff'/></TouchableOpacity>
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
      <ScrollView style={styles.AndroidSafeArea}>
          <View style={{marginBottom: 55}}>
              <TouchableOpacity onPress={ () => { this.props.navigation.openDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 15, left: 20}}>
                <Image source={require('../images/menu.png')} />
              </TouchableOpacity>
            <Text style={{fontSize: 30, fontWeight: '700', position: 'absolute', top: 7, left: 85, fontFamily: 'Roboto'}}>Mes configs</Text>
          </View>
          { this.showOverlay==1 &&
            <TouchableWithoutFeedback onPress={ () => { this.showOverlay=0; this.forceUpdate(); }}>
              <View style={{backgroundColor: '#fff', opacity: 0.8, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 2}}>
                <View style={{backgroundColor: '#fff', borderRadius: 10, position: 'absolute', top: 150, right: 50, left: 50, zIndex: 10}}>
                  <Text style={{fontSize: 17, padding: 3}}>Ajouter un tag ({this.tagcommand})</Text>
                  <TextInput
                    style={ styles.textBox }
                    placeholder="Tag à ajouter"
                    ref={this.tagInput}
                  />
                  <View style={{position: 'relative', alignSelf: 'stretch',}}>
                    <Button onPress={ () => {this.addTagRequest();}} title="AJOUTER CE TAG"/>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          <View style={styles.content}>
            <Text>Minimum followers</Text>
            <Text style={{fontSize: 20}}>{this.minFollowers}</Text>
            <Text>Maximum followers</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowers}</Text>
            <Text>Minimum followings</Text>
            <Text style={{fontSize: 20}}>{this.minFollowings}</Text>
            <Text>Maximum followings</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowings}</Text>
            <Text style={styles.titre}>Abonnements <Ionicons name='md-information-circle' size={18} color='#A599FF' style={{marginTop: 12, marginLeft: 3}} /></Text>

            { <MultiSlider
                        values={[
                            10,
                            20,
                        ]}
                        sliderLength={280}
                        //onValuesChange={this.multiSliderValuesChange}
                        min={0}
                        max={30}
                        step={1}
                        allowOverlap
                        snapped
                      /> }

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
  content: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    marginLeft: '5%',
    width: '90%', 
    padding: '5%',
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titre: {
    fontSize: 14,
    fontWeight: '500',
  },
  textBox: {
	  marginBottom: 6,
    fontSize: 18,
    alignSelf: 'stretch',
    height: 35,
    padding: 4,
    margin: 5,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

