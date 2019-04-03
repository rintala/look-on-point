import React, {Component} from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text,
  TextInput,
  View,
  Image,
  Dimensions,
  Button,
  Icon,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage

 } from 'react-native';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);

// for api calls from expo app during dev
import {Constants} from 'expo';
const { manifest } = Constants;

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? 'http://'.concat(manifest.debuggerHost.split(`:`).shift().concat(`:8000`))
  : `localhost:8000`;

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      userID: '',
      userEmail: '',
      //TODO: remove after dev testing done
      userPass: '',
    }
  };
  
   componentDidMount(){
    this._loadInitialState().done();

  }

  _loadInitialState = async () => { 
    alert('Loading initial state...');
    
    this.setState({
    	userID: this.props.navigation.state.params.userID,
    	userName: this.props.navigation.state.params.userName,
    })

    var theUrl = api+'/users/'+this.props.navigation.state.params.userID;
    console.log("xxxURL: ", theUrl);
    console.log("USERIDD: ", this.props.navigation.state.params.userID);
    fetch(theUrl, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    .then((response) => response.json())
    .then((res) => {
      console.log("reS",res);
      alert("RES: ",res.toString());
      if(res.username !== ""){
        console.log("SUCCESS");
        alert("success");
        console.log("RES EMAIL: ", res.email);

        console.log("RES pw: ", res.password);
        this.setState({
        	userPass: res.password,
        });
        AsyncStorage.setItem('user', JSON.stringify(res));
      }
      else{
        console.log("UNSUCCESFUL");
        alert("RR",res.message);
      }
    })
    .done();
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    console.log("PROPS: ", this.props.navigation.state.params);
    	return (
      <View style={styles.container}>
         <View style={styles.topBar}>
           <Text style={{textAlign: 'center', color: 'white', fontSize: 37, fontFamily:'Romanesco'}}>
                My Profile - {this.props.navigation.state.params.userName} - {this.props.navigation.state.params.userID}
           </Text>
         </View>
          <Text>
           	Password info fetched from server: {this.state.userPass}
          </Text>
          <Text>
           	Maybe display PROFILE PIC here as well
          </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    backgroundColor: '#400080',
    height: 50,
  },

  // style post differentely if odd/even - aesthetic feed
  oddPost: {
    flex: 1,
    backgroundColor: '#ffe6ff',
  },

  evenPost: {
    flex: 1,
    backgroundColor: '#ecaaff',
  },

  feedPostWithImage: {
    flex: 1,
  },

  bottomFeedPostBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
    alignItems: 'center',
  },

  inputCommentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputComment: {
    //backgroundColor: 'white',
    borderBottomWidth: 1,
    width: imageWidth*0.8,
  },

  submitCommentButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },


});

