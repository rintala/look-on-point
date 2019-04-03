import React from 'react';
import { ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Button, 
  Dimensions,
  TextInput } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ImagePicker } from 'expo';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);

// for api calls from expo app during dev
import {Constants} from 'expo';
const { manifest } = Constants;

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? 'http://'.concat(manifest.debuggerHost.split(`:`).shift().concat(`:8000`))
  : `localhost:8000`;

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  state = {
    image: null,
    imageCaption: '',
    imageName: '',
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
            onPress={this.pickImage}
          />
          {image &&
            <View>
              <Image source={{ uri: image }} style={{ width: 300, height: 400 }} />
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                placeholder='Your style caption...'
                onChangeText={(text) => this.setState({imageCaption: text})}
                value={this.state.imageCaption}
              />
              <Text> IMAGE: {this.state.image}</Text>
              <Button title="UPLOAD" onPress={this.uploadImage}/>
            </View>
          
          }
          
        </View>
        </ScrollView>
      </View>
    );
  }

  pickImage = async () => {
    //alert("PICKING IMAGE: ");
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
    });
    
    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  uploadImage = () =>{
    // TOOD: complete this upload function
    // take the image from state - upload to static/assets/user_posts
    // create django endpoint for this?
    // post to "api/uploadPostImage" and record in DB with caption/id, etc.
    const apiUrl = api+'/upload/';
    const uri = this.state.image;
    console.log("URI that is used: ", uri);
    const uriParts = uri.split('.');
    const beforeFileType = uriParts[uriParts.length-2].split("/");
    const fileName = beforeFileType[beforeFileType.length-1];

    console.log("FILENAME USED FOR NAMING: ", fileName);
    const fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();
        formData.append('file', {
          uri,
          name: `${fileName}.${fileType}`,
          type: `image/${fileType}`,
        });

    const options = {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };

    this.setState({
      fileName: fileName,
    });

    return fetch(apiUrl, options).then(response => {
        // HTTP 301 response
        this.props.navigation.navigate('MainFeed',{
              activeUserID: theUserID,
              activeUsername: res.username,
              otherParam: 'anything you want here',
        });
    });
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
