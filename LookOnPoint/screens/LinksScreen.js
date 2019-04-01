import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Button, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ImagePicker } from 'expo';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  state = {
    image: null,
  }
  
  onPressLogin = () => {
    alert('Logging you in');

    fetch('http://127.0.0.1:8000/users/post/', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })

    .then((response) => response.json())
    .then((res) => {
      console.log("reS",res);
      //alert("RES: ",res.toString());
      if(res.username !== ""){
        console.log("SUCCESS");
        alert("success");
        AsyncStorage.setItem('user', JSON.stringify(res));
      
        var theUrl = res.url.split( '/' );
        console.log("theurl:", theUrl);
        var theUserID = theUrl[theUrl.length-2];

        console.log("USERID:", theUserID);

        this.props.navigation.navigate('MainFeed',{
              activeUserID: theUserID,
              activeUsername: res.username,
              otherParam: 'anything you want here',
            });
      }
      else{
        console.log("UNSUCCESFUL");
        alert("RR",res.message);
      }
    })
    .done();
  }
  
  render() {
    const { image } = this.state

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
         
         <View style={styles.topBar}>
           <Text style={{textAlign: 'center', color: 'white', fontSize: 37, fontFamily:'Romanesco'}}>
                Add Post (+)
           </Text>
         </View>

        </View>

        <ScrollView>
        <View>
           <Text> ... </Text>
         </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
          {image &&
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        </View>
        </ScrollView>
      </View>
    );
  }

  _pickImage = async () => {
    alert("PICKING IMAGE: ");
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    
    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
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
