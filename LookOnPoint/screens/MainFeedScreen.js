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
  RefreshControl,

 } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);

// for api calls from expo app during dev
import {Constants} from 'expo';
const { manifest } = Constants;

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? 'http://'.concat(manifest.debuggerHost.split(`:`).shift().concat(`:8000`))
  : `localhost:8000`;

class CommentContent extends Component {
  
    render() {
      return (
  
        <View>
          <Text>{this.props.searchedForPostID}</Text>
          {this.props.comments.map(commentInfo => {
             return commentInfo.postID == this.props.searchedForPostID ?
                //use approach 3 - proposed by 
                //source: https://medium.com/@szholdiyarov/conditional-rendering-in-react-native-286351816db4
                //provide func with params of id

                <Text key={commentInfo.id} style={{textAlign: 'center', fontSize: 27, fontFamily:'Romanesco'}}>
                   {commentInfo.userName}: "{commentInfo.content}"
                </Text>
                :
                <Text key={commentInfo.id}>.....</Text>}
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
     this.mounted = true;

     this.state = {
        refreshing: false,
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

        comments: [
            {
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
            }
        ],
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchPosts().then(() => {
      this.setState({refreshing: false});
    });
  }

  displayAddNewComment(){
    //alert("Adding new comment - show new component...");
    let showCommentInputNew = true;
    this.setState({
        showCommentInput: showCommentInputNew,
    });
  };

  //handleBlur = () =>
  addCommentToSubmit(event, postID){
    console.log("EVENT:. ",event.nativeEvent.text);
    alert("YOUR COMMENT IS ABOUT TO BE RECORDED: ",event.nativeEvent.text);
    this.setState({
      commentToSubmit: {
        id: 0,
        postID: postID,
        content: event.nativeEvent.text,
        userName: this.state.currentUserUsername,
        userID: this.state.currentUserID,

      }
    });
    console.log("STATE: ", this.state)
  };

  submitNewComment(){
    //alert("Adding new comment - show new component...");

    let newCommentsArray = this.state.comments;
    newCommentsArray.push(this.state.commentToSubmit);
    console.log("NEWCOMMENTSARRYA: ",newCommentsArray);

    this.setState({
      comments: newCommentsArray,
    });
  
  };

  showPostComments(postID){
      console.log("SHOW POST COMMENTS.. ", postID);
      let newPostArray = this.state.posts;
      //TODO: add so it can toggle between true/false dependin on prevState
      newPostArray[postID.id].showComments = true;
      
      this.setState({
        posts: newPostArray,
      });

      console.log("CHANGED showComments to true..", postID);
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
      })
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
              otherParam: 'anything you want here',
            })
           }/> 
           <Button style={{flex: 1, textAlign: 'center', color: 'purple', width: '50%', fontSize: 37, fontFamily:'Romanesco'}} title="Add new post" onPress={() => 
            this.props.navigation.navigate('Links',{
              userName: this.state.currentUserUsername,
              userID: this.state.currentUserID,
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
                    Look {postInfo.imgUrl}
                  </Text>
                  
                  <Image source={{uri: postInfo.imgUrl}} 
                  style={{width: imageWidth, height: imageHeight}} />
                
                 <View style={styles.bottomFeedPostBar}>
                    <Text style={{fontStyle: 'italic', color: 'black'}}>USER: {postInfo.userID}</Text>
                    <Text>&nbsp; &nbsp; &nbsp;</Text>
                    <Text style={{fontStyle: 'italic', color: 'black'}}>CAPTION: {postInfo.description}</Text>
                  </View>
                  <View style={styles.bottomFeedPostBar}>
                    <Button onPress={() => this.showPostComments(postInfo)}
                      title="comments"/>
                  </View>

                  {/*comment section - display dynamically
                  {this.state.posts[postInfo.id].showComments == true ? 
                    <ScrollView style={styles.container}>
                      <CommentContent comments={this.state.comments} searchedForPostID={postInfo.id}/>
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
                         returnKeyType='My Custom button'
                         onSubmitEditing={(event) => this.addCommentToSubmit(event, postInfo.id)}/>
                        
                         <TouchableOpacity style={styles.submitCommentButton} onPress={() => this.submitNewComment()}>
                          <Text>Comment</Text>
                        </TouchableOpacity>

                        </View>
                        :
                        <View/>}
                    </ScrollView>
                    : 
                    <View/>} */}
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
