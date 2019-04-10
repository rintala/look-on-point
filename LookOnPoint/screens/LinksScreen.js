import React from 'react';
import { ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Button, 
  Dimensions,
  TextInput,
  AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { ImagePicker } from 'expo';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);
var STORAGE_KEY = 'id_token';

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
    fileName: '',
    fileNameToRecord: '',
    userID: '',
    userName: '',
    userToken: '',
    showComments: false,
    numberOfLikes: 0,
    description: '',
    customTitle: '',

  }
  
  componentDidMount(){
    this.setState({
      userID: this.props.navigation.state.params.userID,
      userName: this.props.navigation.state.params.userName,
      userToken: this.props.navigation.state.params.userAuthToken,
    });
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
           <Text> Token: {this.state.userToken} </Text>

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
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                placeholder='Your custom title...'
                onChangeText={(text) => this.setState({customTitle: text})}
                value={this.state.customTitle}
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

  // uploadImage = async () => {
  uploadImage = async () => {
    // TOOD: complete this upload function
    // record in DB with caption/id, etc.
    // should be pretty basic - already have api for POST on new feedPosts
    var USER_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("USERXXX TOKEN: ", USER_TOKEN);
    const uploadApiUrl = api+'/upload/';
    const uri = this.state.image;
    console.log("URI that is used: ", uri);
    const uriParts = uri.split('.');
    const beforeFileType = uriParts[uriParts.length-2].split("/");
    const fileName = beforeFileType[beforeFileType.length-1];

    console.log("FILENAME USED FOR NAMING: ", fileName);
    const fileType = uriParts[uriParts.length - 1];
    console.log("FILENAME USED FOR NAMING: ", api+fileName+fileType);
    
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
      fileNameToRecord: api+"/media/"+fileName+"."+fileType,

    });

    // TODO: add fetch to POST post-data to backend
    /*refreshAfterNavigation = () => {
      this.setState({refreshing: true});
      this.fetchPosts().then(() => {
        this.setState({refreshing: false});
    });}*/
  
    //return 
    fetch(uploadApiUrl, options
      ).then((response) => {
        // HTTP 301 response
        return response.json();
      }).then((data) => {
        //var urltoPostNewPostTo = api + '/posts/';
        var urltoPostNewPostTo = api + '/rest/addPost/';
        
        return fetch(urltoPostNewPostTo, {
          method: 'POST',
          credentials: "same-origin",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + USER_TOKEN,
          },

          body: JSON.stringify({
            userID: api+'/users/'+this.state.userID+'/',
            imgUrl: this.state.fileNameToRecord ,
            description: this.state.imageCaption,
            showComments: this.state.showComments,
            customTitle: this.state.customTitle,
          })
      });
      
      }).then((response) => {
            this.props.navigation.navigate('MainFeed',{
                  activeUserID: this.state.userID,
            });
            return response.json();
            
      }).catch(function(error){
            console.log("An error occured while fetching.. ", error);
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
