import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground
} from 'react-native';
import { WebBrowser } from 'expo';

import { Font } from 'expo';
import { MonoText, AmaranthText} from '../components/StyledText';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  onPressLogin(){
    alert('Logging you in');
  }

  onPressSignup(){
    alert('Signing you up');
  }


  render() {

    return (
      <View style={styles.container}>
        
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ImageBackground
                  style={styles.iconGirlBg} source={require('../assets/images/icon-girl-medium.png')}
                >  
            <View style={styles.welcomeContainer}>
              {/*<Image
                source={
                  __DEV__
                    ? require('../assets/images/robot-dev.png')
                    : require('../assets/images/robot-prod.png')
                }
                style={styles.welcomeImage}
              />*/}
            </View>
               
              <View style={styles.getStartedContainer}>
                {/*this._maybeRenderDevelopmentModeWarning()*/}
              
                <Text style={{color: '#ffe6ff', fontSize: 67, fontFamily:'Romanesco'}}>
                  LookOnPoint
                </Text>

                <Text style={styles.appNameSubText}>
                  Your personal style guide
                </Text>

                <View style={{marginTop: 16, marginBottom: 16, width: 100}}>
                  <Button buttonStyle={styles.loginButton} title=" LOGIN " onPress={this.onPressLogin} color="#400080"/>
                </View>
                <View style={{marginTop: 16, width: 100}}>
                  <Button buttonStyle={styles.signupButton} title="SIGNUP" onPress={this.onPressSignup} color="#6600cc"/>
                </View>
              </View>
          </ImageBackground>
        </ScrollView>
   
      </View>
    );
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7cac9',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
    flex: 1
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 290,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },

  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  
  appNameText: {
    fontSize: 37,
    paddingTop: 30,
    fontWeight: 'bold',
    color: '#e6f2ff',
    lineHeight: 24,
    textAlign: 'center',
  },

  appNameSubText: {
    fontSize: 17,
    color: '#ffe6ff',
    lineHeight: 54,
    textAlign: 'center',
    fontFamily: 'PT_Sans',
  },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

  loginButton: {
    fontSize: 17,
    height: 24,
    width: 100,
    marginTop: 15
  },

  signupButton: {
    fontSize: 17,
    textAlign: 'center',
  },

  iconGirl: {
    //width: 100%,
  },

  iconGirlBg: {
    width: '100%',
    height: '100%',
    flex: 1,
  }


});
