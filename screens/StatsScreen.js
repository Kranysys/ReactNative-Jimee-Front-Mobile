/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View , Text, Animated, Alert, TouchableOpacity, 
TouchableWithoutFeedback, TextInput, Button, Platform, StatusBar, Image, Slider,
Dimensions, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, getToken, getUserInstaID } from '../api';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import SwitchSelector from 'react-native-switch-selector';

export default class StatsScreen extends React.Component {
  constructor(props){
    super(props);

    this.chartSize = 6;
    this.data1 = [0,0,0,0,0,0];
    this.data2 = [50,60,70,20,50,40];
    this.chartData = "";
    this.timeline = ['January', 'February', 'March', 'April', 'May', 'June'];
    this.loading = 1;
    this.maxSize = 6; 
    this.mode = 0; // tous / flwings / flwers

    this.getChart();
  }
  getChart() {
    if(!this.chartData) // cache
    {
      command = "stats?userInstaID="+getUserInstaID();
      console.log("request -> GET "+api+command);
      fetch(api+command,  {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+getToken(),
        },
      }).then((response) => response.json()).then((responseJson) => {
        // On vide
        this.data1 = [];
        this.data2 = [];
        this.timeline = [];

        console.log("stats: ")
        console.log(responseJson)
        this.chartData = responseJson;
        console.log("taille: "+responseJson.length)
        this.maxSize = responseJson.length;
        if(responseJson.length >= 12) this.maxSize = 12;
        for(var i=0;i<this.chartSize;i++){
          console.log("stats "+i);
          console.log(responseJson[i].n_followers);
          this.data1.unshift(responseJson[i].n_followers);
          console.log(responseJson[i].n_followings);
          this.data2.unshift(responseJson[i].n_followings);
          console.log(responseJson[i].log_date);
          var log_date = responseJson[i].log_date.split("T")[0].split("-")[2]+"/"+responseJson[i].log_date.split("-")[1];
          this.timeline.unshift(log_date);
        }
        this.loading=0;
        this.forceUpdate();
      }).catch((error) =>{
        console.log("ERROR "+command+" : "+error);
      });
    }
    else
    {
      console.log("taking cache:")
      console.log(this.chartData)
      // On vide
      this.data1 = [];
      this.data2 = [];
      this.timeline = [];

      for(var i=0;i<this.chartSize;i++)
      {
        console.log("---");
        console.log(this.chartData[i]);
        this.data1.unshift(this.chartData[i].n_followers);
        this.data2.unshift(this.chartData[i].n_followings);
        var log_date = this.chartData[i].log_date.split("T")[0].split("-")[2]+"/"+this.chartData[i].log_date.split("-")[1];
        if(this.chartSize>9) log_date = this.chartData[i].log_date.split("T")[0].split("-")[2];
        this.timeline.unshift(log_date);
      }
      this.forceUpdate();
    }
  }
static navigationOptions = {
  header: null,
  gesturesEnabled: false,
};
  render() {
    return (
      <ScrollView style={styles.AndroidSafeArea}>
        <View style={{marginBottom: 55}}>
          <TouchableOpacity onPress={ () => { this.props.navigation.openDrawer(); } } style={{width: 50, height: 50, position: 'absolute', top: 15, left: 20}}>
            <Image source={require('../assets/images/menu.png')} />
          </TouchableOpacity>
          <Text style={{fontSize: 30, fontWeight: '700', position: 'absolute', top: 7, left: 85, fontFamily: 'Roboto'}}>Statistiques</Text>
        </View>
        { this.loading==1 && 
          <View style={{textAlign: 'center', alignItems: 'center'}}>
            <Image style={{height: 120, width: 120, alignItems: 'center'}} source={require('../assets/images/load2.gif')} />
          </View>
        }
        { this.loading==0 && 
          <View style={{marginLeft: '5%'}}>
          { this.mode == 0 &&
          <LineChart
              data={{
                labels: this.timeline,
                datasets: [{
                  data: this.data1
                },
                {
                  data: this.data2
                }
              ]}}
              width={(Dimensions.get('window').width-Math.round(Dimensions.get('window').width*0.1))} // voir ici si erreur conversion float
              height={(Dimensions.get('window').height-Math.round(Dimensions.get('window').height*0.4))} // voir ici si erreur conversion float
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: '#6170fc',
                backgroundGradientFrom: '#6170fc',
                backgroundGradientTo: '#4753bf',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
          />
          }
          { this.mode==1 &&
          <LineChart
              data={{
                labels: this.timeline,
                datasets: [{
                  data: this.data1
                }
              ]}}
              width={(Dimensions.get('window').width-Math.round(Dimensions.get('window').width*0.1))} // voir ici si erreur conversion float
              height={(Dimensions.get('window').height-Math.round(Dimensions.get('window').height*0.4))} // voir ici si erreur conversion float
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: '#6170fc',
                backgroundGradientFrom: '#7180fc',
                backgroundGradientTo: '#5763cf',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
          />
          }
          { this.mode==2 &&
          <LineChart
              data={{
                labels: this.timeline,
                datasets: [{
                  data: this.data2
                }
              ]}}
              width={(Dimensions.get('window').width-Math.round(Dimensions.get('window').width*0.1))} // voir ici si erreur conversion float
              height={(Dimensions.get('window').height-Math.round(Dimensions.get('window').height*0.4))} // voir ici si erreur conversion float
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: '#6170fc',
                backgroundGradientFrom: '#7180fc',
                backgroundGradientTo: '#5763cf',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
          />
          }
          </View>
        }
        <View style={styles.content}>
          <SwitchSelector 
            options={[{ label: 'tous', value: '0' },{ label: 'followers', value: '1' },{ label: 'followings', value: '2' }]} 
            buttonColor='#6170fc'
            initial={0} 
            onPress={value => {this.mode = value; console.log("value "+value); this.forceUpdate();}} />
          <MultiSlider
            values={[
              this.chartSize
            ]}
            trackStyle={{backgroundColor:'#A599FF'}}
            selectedStyle={{backgroundColor:'#5544ff'}}
            markerStyle={{backgroundColor:'#5544ff',height: 30, width: 30, borderRadius: 15}}
            pressedMarkerStyle={{height: 40, width: 40}}
            sliderLength={(Dimensions.get('window').width-(Dimensions.get('window').width*0.2))}
            onValuesChange={ (data) => { this.chartSize = data[0]; this.forceUpdate(); this.getChart(); }}
            min={2}
            max={this.maxSize}
            step={1}
            touchDimensions={{height: 250,width: 250,borderRadius: 15,slipDisplacement: 200}}
            allowOverlap
            snapped
          />
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

