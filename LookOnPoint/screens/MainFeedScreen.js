import React from 'react';
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
  RefreshControl,
  AsyncStorage,

 } from 'react-native';

// For displaying rating for each post
import { Rating } from 'react-native-elements';

import { ExpoLinksView } from '@expo/samples';

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

const nodeapp = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? 'http://'.concat(manifest.debuggerHost.split(`:`).shift().concat(`:3000`))
  : `localhost:3000`;

// For real-time comments - will communicate with nodeapp server through sockets
import SocketIOClient from 'socket.io-client';

class CommentContent extends React.Component {

    render() {
      const comments = this.props.comments;
      console.log("COMMENTS INFO UPDATED??: ",comments);
      console.log("THIS PROPS SEARCHED FOR POST ID: ", this.props.searchedForPostID);
      return (
  
        <View>
          {comments.map(commentInfo => {
             //console.log("COMMENTINFO POSTID: ",commentInfo.postID.split("/")[commentInfo.postID.split("/").length-2]);
             //console.log("SERACH FOR POSTID: ",this.props.searchedForPostID.split("/")[this.props.searchedForPostID.split("/").length-2]);
             return commentInfo.postID.split("/")[commentInfo.postID.split("/").length-2] == this.props.searchedForPostID.split("/")[this.props.searchedForPostID.split("/").length-2] ?
                //use approach 3 - proposed by 
                //source: https://medium.com/@szholdiyarov/conditional-rendering-in-react-native-286351816db4
                //provide func with params of id

                <Text key={commentInfo.commentID} style={{textAlign: 'center', fontSize: 27, fontFamily:'Romanesco'}}>
                   {commentInfo.userID.split("/")[commentInfo.userID.split("/").length-2]}: "{commentInfo.content}"
                </Text>
                :
                <View/>}
            )}
          </View>
      );
    }
}

export default class MainFeedScreen extends React.Component {
  

  static navigationOptions = {
    title: 'MainFeed',
  };
  

  constructor(props) {
     super(props);

     this.extractDynamicUrl = this.extractDynamicUrl.bind(this);
     // get current user from home screen
     const activeUserID = props.navigation.getParam('activeUserID', 'NO-ID');
     const activeUsername = props.navigation.getParam('activeUsername', 'NO-USERNAME');
     const refreshing = props.navigation.getParam('refreshing', false);
     const activeUserToken = props.navigation.getParam('activeUserToken', 'NO-USERTOKEN');
     // const { params} = this.props.navigation.state;
     // params.refreshingAfterNavigation();

     // Creating the socket-client instance will automatically connect to the server.
     this.socket = SocketIOClient(nodeapp);
    
     // Client side
     this.socket.on('comment-channel', (newComments) => {
       console.log("XYZ recived new comments on socket..");
       this.setState({ 
        comments: newComments,
        isLoading: false,
       });
     });

     this.mounted = true;

     this.state = {
        refreshing: refreshing,
        isLoading: true,
        error: null,
        postID: 1,
        posts: [],

        /*{
            id: 0,
            url: 'https://media.gq.com/photos/58500ecd524455347e6215c8/master/w_2909,h_4362,c_limit/Kanye-West-Style-2016-12-12-16.jpg',
            showComments: false,

          },
          {
            id: 1,
            url: "https://lh5.googleusercontent.com/proxy/w2kecqYtamPR4s80pYCOjUiNV7W8PPABNLI9I_a7RQHB1aWPH4EfLfUjKWL8Egs07YM4NePpD_e8UcS4aQ_u6kHjAlLCuWf48NKBtclU7n_LCU1HdsysAsIC-rZJNlyltFgDlrlR-7yXeMIAzrY3uN3bRetE7zoWbakPlueVly_8vvYOuqtBuAv6EAG0RnThn6mzSHtkTg9DHFT1rVSNaKcDZHJP7anaT6F4oR4LyuVgDpjtg3CIwrisoE9WJIswpU2xhvAI60AJfALtzLyUDuyuuEBwwWl5WjyGMx0Zbtx-yAjA=s0-d",
            showComments: false,
          }*/
        // store username directly here for displaying - instead of userID - good idea?
        // conclusion: yes, since we can still look up more userID through backend, using postID
        // tradeoff - but worth it as of now

        comments: [],
            
            /*{
              id: 0,
              postID: 0,
              content: 'Looking so dope.',
              userName: 'mrCool',
              userID: 11,
            },
            {
              id: 1,
              postID: 1,
              content: 'Fire style.',
              userName: 'fashionGuru',
              userID: 12,
            }*/
        
        showCommentInput: false,
        isFocused: true,
        commentToSubmit: {
          id: 0,
          postID: 0,
          content: 'Looking so dope.',
        },

        'currentUserID': activeUserID,
        'currentUserUsername': activeUsername, 
        'currentUserEmail': "..", 
        'currentUserGroups': "..",
        'currentUserToken': activeUserToken,
      };
   };

  fetchPosts(){
    console.log("FETCHING POSTS!...");
    return fetch(api+'/posts/', {
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       })
      .then(response => {
        if (response.ok) {
          console.log("RESPONSE OK");
          return response.json();
        } else {
          throw new Error("Encountered problem fetching posts...");
        }
      })
      .then(data => {
        //if (this.mounted) {
          var existingPosts = this.state.posts;
          /*for(i=0;i<data.length;i++){
            existingPosts.push(data[i]);
          }*/

          // Set to data directly - will overwrite any prev posts not in DB
          console.log("Setting new state...");
          this.setState({
            posts: data,
            isLoading: false,
          });
        //}

      })
  };

  // TODO: fetchComments() function
  fetchComments(){
    console.log("FETCH COMMENTS:..");
    return fetch(api+'/comments/', {
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       })
      .then(response => {
        if (response.ok) {
          console.log("RESPONSE OK");
          return response.json();
        } else {
          throw new Error("Encountered problem fetching posts...");
        }
      })
      .then(data => {
        //if (this.mounted) {
          var existingComments = this.state.comments;
          /*for(i=0;i<data.length;i++){
            existingPosts.push(data[i]);
          }*/

          // Set to data directly - will overwrite any prev posts not in DB
          console.log("Setting new state...");
          this.setState({
            comments: data
            //isLoading: false,
          });
          console.log("NEWSTATE",this.state);
        //}

      })
  };

  /* Seems to already be done by default..
  componentWillReceiveProps(nextProps) {
    console.log("WILL RECIEBEP PROPS..");
    if (nextProps.navigation.state.params.refreshing) {
      console.log("INVOKE REFREHS FEEED");
      this._onRefresh();
    }
  }*/

  _onRefresh = () => {

    this.setState({refreshing: true});

    // TODO: restrict the fetchPosts to only include the 5 last ones & include showMore button at bottom
    this.fetchPosts().then(() => {
      this.setState({refreshing: false});
    });

    // TODO: add fetchComments here as well - of relevant posts
    this.fetchComments().then(() => {
      this.setState({refreshing: false});
    });
    
  }

  postCommentToBackend = async () => {
    var USER_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
    var urltoPostNewPostTo = api + '/rest/addComment/';
    console.log("POST INFO TO SEND TO BACKEND: ", this.state.commentToSubmit);
    console.log("POSTID TO USE: ", api+'/posts/'+this.state.commentToSubmit.postID+'/')
    console.log("USERID TO USE: ", api+'/users/'+this.state.currentUserID+'/')
    
    return fetch(urltoPostNewPostTo, {
          method: 'POST',
          credentials: "same-origin",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + USER_TOKEN,
          },

          body: JSON.stringify({
            postID: api+'/posts/'+this.state.commentToSubmit.postID+'/',
            userID: api+'/users/'+this.state.currentUserID+'/',
            content: this.state.commentToSubmit.content,
          })
      }).then((response) => {
            //this._onRefresh();
            return response.json();
            
      }).catch(function(error){
            console.log("An error occured while fetching.. ", error);
      });

  }

  displayAddNewComment(){
    //alert("Adding new comment - show new component...");
    
    let showCommentInputNew = true;
    this.setState({
        showCommentInput: showCommentInputNew,
    });
    
  };

  addCommentToSubmit(event, post){
    console.log("EVENT:. ",event.nativeEvent.text);
    alert("YOUR COMMENT IS ABOUT TO BE RECORDED: ",event.nativeEvent.text);
    console.log("POST INFORMATION X", post);
    this.setState({
      // TODO: change id here and fetch from server instead
      commentToSubmit: {
        postID: post.postID,
        content: event.nativeEvent.text,
        userName: this.state.currentUserUsername,
        userID: this.state.currentUserID,
      }
    });
    console.log("STATE: ", this.state)
  };

  submitNewComment(){
    
    // Update state with new comment for instant view update
    let newCommentsArray = this.state.comments;
    

    // POST comment to backend
    this.postCommentToBackend().then(data => {
        console.log("commentID: ",data.commentID);

        // Recreate comment object structure
        newComment = this.state.commentToSubmit;
        newComment.commentID = data.commentID;
        newComment.postID = api+"/posts/"+newComment.postID+"/";
        newComment.userID = api+"/users/"+newComment.userID+"/";
        newComment.createdOn = data.createdOn;
        newCommentsArray.push(newComment);
        console.log("NEWCOMMENTSARRYA: ",newCommentsArray);

        this.setState({
          comments: newCommentsArray,
          isLoading: false,
        });

        // TODO: emit change to socket - instant update for all other users (listeners)
        this.socket.emit('comment-channel', newCommentsArray);

    });
    
  };

  showPostComments(postToSearchFor){
      console.log("SHOW POST COMMENTS.. ", postToSearchFor.postID);
      //let newPostArray = this.state.posts;
      //TODO: add so it can toggle between true/false dependin on prevState
      //newPostArray[postID.id].showComments = true;
      
      let newPostArray = this.state.posts;  
      let index = newPostArray.findIndex(post => post.postID == postToSearchFor.postID);
      console.log("INDEXXX: ",index);
      newPostArray[index].showComments = !newPostArray[index].showComments;                  
      this.setState({ posts: newPostArray });

      console.log("CHANGED showComments to true..", postToSearchFor.postID);
      console.log("COMMENTS IN STATE:", this.state.comments);
  };

  handleFocus = () => this.setState({
    isFocused: true,
  });

  handleBlur = () => this.setState({isFocused: false});
  
  componentWillUnmount() {
    this.mounted = false;
  };

  extractDynamicUrl(imgUrl){
      var imgUrlToUseVec = imgUrl.split("/");
      var imgUrlToUse = api+"/"+imgUrlToUseVec[imgUrlToUseVec.length-2]+"/"+imgUrlToUseVec[imgUrlToUseVec.length-1]
      console.log("IMGURL TO USE: ",imgUrlToUse);
      return imgUrlToUse;
  };

  hi = "IHI";

  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }

  componentDidMount(){
      let newFetchedPostArray = this.state.posts;
      //let idToFetch = 1;
      
      //console.log("MOUNTING: ", this.extractDynamicUrl("post.imgUrl"));

      fetch(api+'/posts/', {
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       })
      .then(response => {
        if (response.ok) {
          console.log("RESPONSE OK");
          return response.json();
        } else {
          throw new Error("Encountered problem fetching posts...");
        }
      })
      .then(data => {
        if (this.mounted) {
          var existingPosts = this.state.posts;
          for(i=0;i<data.length;i++){
            existingPosts.push(data[i]);
          }

          this.setState({
            posts: existingPosts,
            isLoading: false,
          });

          console.log("STATE1: ", this.state.posts);

          //console.log("loL: ", this.extractDynamicUrl;
          var postsWithNewUrl = this.state.posts.map((post) => {
            //var newUrl = this.hi;
            //console.log("NEWURL1: ", this.extractDynamicUrl(post.imgUrl)); 
            return {...post, imgUrlToUse: this.extractDynamicUrl(post.imgUrl)}
          });

          this.setState({
            posts: postsWithNewUrl
          });

          console.log("STATE2: ", this.state.posts);
        }
        console.log("NOT MOUNTED.. inside of data :/", this.mounted);
      }).then( () => {
        this.fetchComments().then(() => {
        this.setState({refreshing: false});
      })})
      .catch(fetchError => {
        if (this.mounted) {
          this.setState({
            isLoading: false,
            error: fetchError
          });
        }
      });
  };
  
  render() {
    const { isLoading, comments} = this.state;
    console.log("ISLOADING STATUS.:. ",isLoading);

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
         <View style={styles.topBar}>
           <Text style={{textAlign: 'center', color: 'white', fontSize: 37, fontFamily:'Romanesco'}}>
                LookOnPoint
           </Text>
           
         </View>
         <Button style={{flex: 1, textAlign: 'center', color: 'white', width: '50%',  fontSize: 37, fontFamily:'Romanesco'}} title="My Profile" onPress={() => 
            this.props.navigation.navigate('Settings',{
              userName: this.state.currentUserUsername,
              userID: this.state.currentUserID,
              userAuthToken: this.state.currentUserToken,
              otherParam: 'anything you want here',
            })
         }/>
         <Button style={{flex: 1, textAlign: 'center', color: 'purple', width: '50%', fontSize: 37, fontFamily:'Romanesco'}} title="Add new post" onPress={() => 
          this.props.navigation.navigate('Links',{
            userName: this.state.currentUserUsername,
            userID: this.state.currentUserID,
            userAuthToken: this.state.currentUserToken,
            otherParam: 'anything you want here',
          })
         }/> 
         

      <ScrollView style={styles.container}

        refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }

      >
         {this.state.posts.map(postInfo => {
             return (

               // styling feed posts differently depending on even/odd id
               <View key={postInfo.postID} style={[(postInfo.postID % 2 == 1) ? styles.oddPost : styles.evenPost]} key={postInfo.id}>
                  <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                    Look {postInfo.customTitle}
                  </Text>
                  
                  <Image source={{uri: postInfo.imgUrl}} 
                  style={{width: imageWidth, height: imageHeight}} />
                 <View style={{width: imageWidth}}>
                   <Rating
                        style={{paddingVertical: 3   }}
                        showRating
                        //type="heart"
                        onFinishRating={this.ratingCompleted}
                        ratingBackgroundColor = '#fbbff3'
                        ratingColor='purple'
                        type='custom'
                  />
                </View>
                 <View style={styles.bottomFeedPostBar}>
                    
                    <Text style={{color: 'black', fontFamily: 'Romanesco', fontSize: 24}}>USERID: {postInfo.userID.split("/")[postInfo.userID.split("/").length-2]}</Text>
                    <Text>&nbsp; &nbsp; &nbsp;</Text>
                    <Text style={{color: 'black', fontFamily: 'Romanesco', fontSize: 24}}>CAPTION: {postInfo.description}</Text>
                  </View>
                  <View style={styles.bottomFeedPostBar}>
                    <Button onPress={() => this.showPostComments(postInfo)}
                      title="comments"/>
                  </View>

                  {/*comment section - display dynamically*/} 
                  {/* NOT HOW THEY ARE RETRIEVED:.. console.log("POSTINFO ID ", postInfo.postID, " .. ", this.state.posts[postInfo.postID])*/}
                  {postInfo.showComments == true ? 
                    <ScrollView style={styles.container}>
                      <CommentContent isLoading={isLoading} comments={this.state.comments} searchedForPostID={api+'/posts/'+postInfo.postID+'/'}/>
                      <Button type="outline" onPress={() => this.displayAddNewComment()}
                        title="Add new comment"/>
                       {this.state.showCommentInput == true ?
                        <View style={styles.inputCommentContainer}>
                        <TextInput 
                          onFocus={this.handleFocus} 
                          onBlur={this.handleBlur}
                          style={
                            [styles.inputComment, 
                            {borderBottomColor: this.state.isFocused
                             ? 'black'
                             : 'red'}
                             ]
                         }
                        
                         onSubmitEditing={(event) => this.addCommentToSubmit(event, postInfo)}/>
                        
                         <TouchableOpacity style={styles.submitCommentButton} onPress={() => this.submitNewComment()}>
                          <Text>Comment</Text>
                        </TouchableOpacity>

                        </View>
                        :
                        <View/>}
                    </ScrollView>
                    : 
                    <View/>}
                </View>
             );
          })}
        
      </ScrollView>
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
