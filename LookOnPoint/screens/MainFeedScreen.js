import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text,
  View,
  Image,
  Dimensions,
  Button
 } from 'react-native';
import { ExpoLinksView } from '@expo/samples';


const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const imageHeight = Math.round(dimensions.width * 16 / 12);

export default class MainFeedScreen extends React.Component {
  static navigationOptions = {
    title: 'MainFeed',
  };


  constructor() {
     super();
     this.state = {
        postID: 1,
        posts: [
          {
            id: 1,
            url: 'https://media.gq.com/photos/58500ecd524455347e6215c8/master/w_2909,h_4362,c_limit/Kanye-West-Style-2016-12-12-16.jpg',

          },
          {
            id: 2,
            url: "https://lh5.googleusercontent.com/proxy/w2kecqYtamPR4s80pYCOjUiNV7W8PPABNLI9I_a7RQHB1aWPH4EfLfUjKWL8Egs07YM4NePpD_e8UcS4aQ_u6kHjAlLCuWf48NKBtclU7n_LCU1HdsysAsIC-rZJNlyltFgDlrlR-7yXeMIAzrY3uN3bRetE7zoWbakPlueVly_8vvYOuqtBuAv6EAG0RnThn6mzSHtkTg9DHFT1rVSNaKcDZHJP7anaT6F4oR4LyuVgDpjtg3CIwrisoE9WJIswpU2xhvAI60AJfALtzLyUDuyuuEBwwWl5WjyGMx0Zbtx-yAjA=s0-d",

          }
        ],
        
     }
   }

  showPostComments(postID){
      console.log("SHOW POST COMMENTS.. ", postID);
      let newPostArray = this.state.posts;
      //TODO: add so it can toggle between true/false dependin on prevState
      newPostArray[postID] = true;
      this.setState({
        posts: newPostArray
      });
  }

  render() {
    return (
      <View style={styles.container}>
         <View style={styles.topBar}>
           <Text style={{textAlign: 'center', color: 'white', fontSize: 37, fontFamily:'Romanesco'}}>
                LookOnPoint
           </Text>
         </View>
         

      <ScrollView style={styles.container}>
         {this.state.posts.map(postInfo => {
             return (

              // styling feed posts differently depending on even/odd id
               <View style={[(postInfo.id % 2 == 1) ? styles.oddPost : styles.evenPost]} key={postInfo.id}>
                  <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                    Look {postInfo.id}
                  </Text>
                  <Image source={{uri: postInfo.url, width: imageWidth, height: imageHeight}} />
                
                 <View style={styles.bottomFeedPostBar}>
                    <Text style={{fontStyle: 'italic', color: 'black'}}>USER: MrWest</Text>
                    <Text>&nbsp; &nbsp; &nbsp;</Text>
                    <Text style={{fontStyle: 'italic', color: 'black'}}>CAPTION: Back in black</Text>
                  </View>
                  <View style={styles.bottomFeedPostBar}>
                    <Button onPress={() => this.showPostComments(postInfo)}
                      title="comments"/>
                  </View>
                </View>
             );
          })}
         {/*<View style={{backgroundColor: '#ffe6ff'}}>
           <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                Look 1
           </Text>
         </View>

         <View style={styles.feedPost2}>
           <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                Look 2
           </Text>
         </View>

        <View style={styles.feedPostWithImage}>
           <View style={{backgroundColor: '#ffe6ff'}}>
             <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                  Look 3
             </Text>
           </View>
           <Image source={{uri: "https://lh5.googleusercontent.com/proxy/w2kecqYtamPR4s80pYCOjUiNV7W8PPABNLI9I_a7RQHB1aWPH4EfLfUjKWL8Egs07YM4NePpD_e8UcS4aQ_u6kHjAlLCuWf48NKBtclU7n_LCU1HdsysAsIC-rZJNlyltFgDlrlR-7yXeMIAzrY3uN3bRetE7zoWbakPlueVly_8vvYOuqtBuAv6EAG0RnThn6mzSHtkTg9DHFT1rVSNaKcDZHJP7anaT6F4oR4LyuVgDpjtg3CIwrisoE9WJIswpU2xhvAI60AJfALtzLyUDuyuuEBwwWl5WjyGMx0Zbtx-yAjA=s0-d", width: imageWidth, height: imageHeight}} />
           <View style={styles.bottomFeedPostBar}>
            <Text style={{fontStyle: 'italic', color: 'black'}}>USER: Jonathan Rintala</Text>
            <Text>&nbsp; &nbsp; &nbsp;</Text>
            <Text style={{fontStyle: 'italic', color: 'black'}}>CAPTION: Stripes for life</Text>
           </View>
        </View>

        <View style={styles.feedPostWithImage}>
           <View style={{backgroundColor: '#ffe6ff'}}>
             <Text style={{textAlign: 'center', fontSize: 47, fontFamily:'Romanesco'}}>
                  Look 4
             </Text>
           </View>

           <Image source={{uri: "https://media.gq.com/photos/58500ecd524455347e6215c8/master/w_2909,h_4362,c_limit/Kanye-West-Style-2016-12-12-16.jpg", width: imageWidth, height: imageHeight}} />
           
           <View style={styles.bottomFeedPostBar}>
            <Text style={{fontStyle: 'italic', color: 'black'}}>USER: MrWest</Text>
            <Text>&nbsp; &nbsp; &nbsp;</Text>
            <Text style={{fontStyle: 'italic', color: 'black'}}>CAPTION: Back in black</Text>
           </View>
           <View style={styles.bottomFeedPostBar}>
            <Button id={this.state.posts[0].id} onPress={() => this.showPostComments(this.state.posts[0].id)}
              title="comments"/>
           </View>
        </View>
        */}
        
        
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
});
