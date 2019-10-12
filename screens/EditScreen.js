/* Nicolas BAPTISTA - V1.0 */
import React from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, StatusBar, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/HeaderAction';
import SwitchSelector from 'react-native-switch-selector';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

export default class EditScreen extends React.Component {
  constructor(props){
    super(props);

  }
  static navigationOptions = {
    header: null,
  };
  render() {
    return(
      <ScrollView style={styles.AndroidSafeArea}>
        <Header title="Editer" this={this}/>
        <View style={{marginTop: 0, }}>
          <Text style={styles.titre}>Ma Catégorie</Text>

          <SwitchSelector 
            options={[{ label: 'Photo', value: '1' },{ label: 'Fitness', value: '2' },{ label: 'Food', value: '3' },{ label: 'Friends', value: '4' },{ label: 'Party', value: '5' }]} 
            buttonColor='#f66445'
            initial={0} 
            onPress={value => {this.mode = value; console.log("value "+value); this.forceUpdate();}} />

          <Text style={styles.titre}>Mes intérêts</Text>

          <View style={styles.feed}>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
              <TouchableOpacity onPress={ () => { this.props.navigation.navigate('AnalyseScreen')}}>
                <ImageBackground source={require('../assets/images/interet1.png')} style={{width: '100%', height: '100%', opacity: 0.8}} imageStyle={{ borderRadius: 15}}>
                  <View style={{padding: 10, borderRadius: 10}}>
                    <RadioForm
                      //radio_props={this.state.types}
                      initial={0}
                      formHorizontal={false}
                      labelHorizontal={true}
                      buttonColor={'#f66445'}
                      animation={true}
                      onPress={(value) => {this.setState({value:value})}}
                    />
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        <View style={{height: 200}}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  titre: {
    fontFamily: 'josefin',
    fontSize: 17,
    color: '#3e3f68',
    padding: 20
  },
  feed: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
  },
  bloc: {
    width: 350,
    height: 120,
    color: '#fff',
  }
});
