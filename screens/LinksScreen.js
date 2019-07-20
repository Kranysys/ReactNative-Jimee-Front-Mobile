/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View , Text, Animated, Alert, TouchableOpacity, 
TouchableWithoutFeedback, TextInput, Button, Platform, StatusBar, Image, Slider,
Dimensions, Switch } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Ionicons } from '@expo/vector-icons';
import { api, getToken, getUserInstaID, getConfigUserInsta } from '../api';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class LinksScreen extends React.Component {
  constructor(props){
    super(props);

    this.commenttagscontent = [];
    this.liketagscontent = [];
    this.state = { valueArray: [], valueArray2: [], minFollowers: 100, maxFollowers: 5000, minFollowings: 100, maxFollowings: 4000 };
    this.index = 0; this.index2 = 0;
    this.animatedValue = new Animated.Value(0);
    this.showOverlay = 0; // affichage ajout tag
    this.command = ""; // commande (tagLikes/tagComments)
    this.tagInput = React.createRef();

    this.followChecked = false;
    this.unfollowChecked = false;
    this.commentsChecked = false;
    this.likesChecked = false;
    this.updating=0;

    if(getConfigUserInsta()){
      if(getConfigUserInsta().follows>0) this.followChecked = true; else this.followChecked = false;
      if(getConfigUserInsta().unfollows>0) this.unfollowChecked = true; else this.unfollowChecked = false;
      if(getConfigUserInsta().comments>0) this.commentsChecked = true; else this.commentsChecked = false;
      if(getConfigUserInsta().likes>0) this.likesChecked = true; else this.likesChecked = false;
    }

    this.getFollows(); // obtension des settings instagram
    
  }
  getFollows() {
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
      if(responseJson[0].min_follows>0) this.state.minFollowings = responseJson[0].min_follows;
      if(responseJson[0].max_follows>0) this.state.maxFollowings = responseJson[0].max_follows;
      if(responseJson[0].min_followers>0) this.state.minFollowers = responseJson[0].min_followers;
      if(responseJson[0].max_followers>0) this.state.maxFollowers = responseJson[0].max_followers;
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
  updateFollow() {
    this.updating=1;
    this.forceUpdate();

    command = "configFollow";
    console.log("request -> POST "+api+command);
    fetch(api+command,  {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+getToken(),
      },
      body: JSON.stringify({
        userInstaID: getUserInstaID(),
        min_followers: this.state.minFollowers,
        max_followers: this.state.maxFollowers,
        min_follows: this.state.minFollowings,
        max_follows: this.state.maxFollowings,
      })
    }).then(response => /*{console.log(response);}*/ response.json()).then((responseJson) => {
      this.updating=0;
      this.forceUpdate();
    }).catch((error) =>{
      console.log("ERROR "+command+" : "+error);
    });
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
        this.getFollows();
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
  this.getFollows();
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
                      <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 25}}>#{ this.liketagscontent[item.index] } </Text>
                      <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, alignItems: 'center'}} onPress={ () => { this.deleteTag(0,item.index,this.liketagscontent[item.index]); } }><Ionicons name='md-close-circle' size={18} color='#fff'/></TouchableOpacity>
                    </View>
                  </Animated.View>
              );
          }
          else
          {
              return(
                <View key = { key } style={{position: 'relative'}}>
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 25}}>#{ this.liketagscontent[item.index] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, alignItems: 'center'}} onPress={ () => { this.deleteTag(0,item.index,this.liketagscontent[item.index]); } }><Ionicons name='md-close-circle' size={18} color='#fff'/></TouchableOpacity>
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
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 25}}>{ this.commenttagscontent[item.index2] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, alignItems: 'center'}} onPress={ () => {this.deleteTag(1,item.index2,this.commenttagscontent[item.index2]);  } }><Ionicons name='md-close-circle' size={18} color='#fff'/></TouchableOpacity>
                </View>
              </Animated.View>
              );
          }
          else
          {
              return(
                <View  key = { key } style={{position: 'relative'}}>
                  <Text style ={{padding: 5, borderColor: '#000', backgroundColor: '#6D48F7', color: '#fff', borderRadius: 5, borderWidth: 1, margin: 5, paddingRight: 25}}>{ this.commenttagscontent[item.index2] } </Text>
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, alignItems: 'center'}} onPress={ () => { this.deleteTag(1,item.index2,this.commenttagscontent[item.index2]); } }><Ionicons name='md-close-circle' size={18} color='#fff'/></TouchableOpacity>
                </View>
              );
          }
      });
    return (
      <ScrollView style={styles.AndroidSafeArea}>
          <View style={{marginBottom: 55}}>
              <TouchableOpacity onPress={ () => { this.props.navigation.openDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 15, left: 20}}>
                <Image source={require('../assets/images/menu.png')} />
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
            <View style={{borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 50}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding: 10,zIndex:1, width: '100%', }}>
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.likesChecked=!this.likesChecked; this.forceUpdate();}} value={this.likesChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.commentsChecked=!this.commentsChecked; this.forceUpdate();}} value={this.commentsChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.followChecked=!this.followChecked;this.forceUpdate();}} value={this.followChecked} />
                <Switch thumbColor='#3800bf' trackColor={{true:'#8F8BFF', false: null}} onValueChange = { () => {this.unfollowChecked=!this.unfollowChecked;this.forceUpdate();}} value={this.unfollowChecked} />
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', zIndex:1,width:'100%', paddingLeft: '12%', paddingRight: '12%', paddingBottom: '12%'}}>
                <Text style={styles.getStartedText}>like</Text>
                <Text style={styles.getStartedText}>comments</Text>
                <Text style={styles.getStartedText}>follow</Text>
                <Text style={styles.getStartedText}>unfollow</Text>
              </View>
            </View>

            {/*<Text>Minimum followers</Text>
            <Text style={{fontSize: 20}}>{this.minFollowers}</Text>
            <Text>Maximum followers</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowers}</Text>
            <Text>Minimum followings</Text>
            <Text style={{fontSize: 20}}>{this.minFollowings}</Text>
            <Text>Maximum followings</Text>
            <Text style={{fontSize: 20}}>{this.maxFollowings}</Text>*/}

            <Text style={styles.titre}>Abonnées <Ionicons name='md-information-circle' size={18} color='#A599FF' style={{marginTop: 12, marginLeft: 3}} />             <Text style={styles.titregauche}>{this.state.minFollowers} → {this.state.maxFollowers}</Text> </Text>

            { <MultiSlider
                        values={[
                          this.state.minFollowers,
                          this.state.maxFollowers,
                        ]}
                        trackStyle={{backgroundColor:'#A599FF'}}
                        selectedStyle={{backgroundColor:'#5544ff'}}
                        markerStyle={{backgroundColor:'#5544ff'}}
                        sliderLength={(Dimensions.get('window').width-(Dimensions.get('window').width*0.2))}
                        onValuesChange={ (data) => { this.state.minFollowers = data[0]; this.state.maxFollowers = data[1]; this.forceUpdate(); }}
                        onValuesChangeFinish={ (data) => { this.updateFollow(); } }
                        min={0}
                        max={10000}
                        step={100}
                        touchDimensions={{height: 150,width: 150,borderRadius: 15,slipDisplacement: 200}}
                        allowOverlap
                        snapped
                      /> }

            <Text style={styles.titre}>Abonnements <Ionicons name='md-information-circle' size={18} color='#A599FF' style={{marginTop: 12, marginLeft: 3}} />             <Text style={styles.titregauche}>{this.state.minFollowings} → {this.state.maxFollowings}</Text> </Text>

            { <MultiSlider
                        values={[
                          this.state.minFollowings,
                          this.state.maxFollowings,
                        ]}
                        trackStyle={{backgroundColor:'#A599FF'}}
                        selectedStyle={{backgroundColor:'#5544ff'}}
                        markerStyle={{backgroundColor:'#5544ff'}}
                        sliderLength={(Dimensions.get('window').width-(Dimensions.get('window').width*0.2))}
                        onValuesChange={ (data) => { this.state.minFollowings = data[0]; this.state.maxFollowings = data[1]; this.forceUpdate(); }}
                        onValuesChangeFinish={ (data) => { this.updateFollow(); } }
                        min={0}
                        max={10000}
                        step={100}
                        touchDimensions={{height: 150,width: 150,borderRadius: 15,slipDisplacement: 200}}
                        allowOverlap
                        snapped
                      /> }
            { this.updating==1 &&
              <Image style={{height: 120, width: 120, alignItems: 'center'}} source={require('../assets/images/load2.gif')}/>
            }
            {/* this.updating==0 &&
            <TouchableOpacity ref={this.boost} activeOpacity = { 0.8 } style = {{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#A599FF', borderWidth: 1, borderColor: '#999', height: 35, borderRadius: 5, margin: 5, color: '#fff' }} onPress = { () => { this.updateFollow(); } }>
              <Ionicons name='md-checkmark' size={32} color='#fff' style={{marginLeft: 10, marginRight: 10}} />
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>OK</Text>
            </TouchableOpacity>
            */}
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
    marginBottom: 55,
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
  titregauche: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    right: 12,
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

