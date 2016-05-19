import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';
import { timeAgo } from '../utils/core'

const data = [{
  "tweet_id": "733350150056206336",
  "tweet_author": "geekykaran",
  "tweet_author_name": "Karan Thakkar",
  "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_author": "williampietri",
  "original_tweet_author_name": "William Pietri",
  "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/673948945962303489/5sxyC3Ey_normal.jpg",
  "original_tweet_id": "732602463082188801",
  "tweet_text": "Your company's most valuable resource is people giving a shit. Ask yourself: does your system encourage or discourage that?",
  "tweet_url_entities": [],
  "tweet_media_entities": [],
  "tweet_type": "retweet",
  "retweet_count": 441,
  "favorite_count": 378,
  "tweet_posted_at": "Tue May 17 16:03:32 +0000 2016"
}, {
  "tweet_id": "733304007557419013",
  "tweet_author": "geekykaran",
  "tweet_author_name": "Karan Thakkar",
  "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_author": "geekykaran",
  "original_tweet_author_name": "Karan Thakkar",
  "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_id": "733304007557419013",
  "tweet_text": "And that is why bots will never take over the world #YouHadOneJob https://t.co/Oiol9ZflI0",
  "tweet_url_entities": [],
  "tweet_media_entities": [{
    "url": "https://t.co/Oiol9ZflI0",
    "media_url": "https://pbs.twimg.com/media/Ci04GO1VEAAvIgb.jpg",
    "display_url": "pic.twitter.com/Oiol9ZflI0",
    "expanded_url": "http://twitter.com/geekykaran/status/733304007557419013/photo/1",
    "indices": [
      66,
      89
    ]
  }],
  "tweet_type": "original",
  "retweet_count": 2,
  "favorite_count": 3,
  "tweet_posted_at": "Thu May 19 14:31:14 +0000 2016"
}, {
  "tweet_id": "733221168459603968",
  "tweet_author": "geekykaran",
  "tweet_author_name": "Karan Thakkar",
  "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_author": "geekykaran",
  "original_tweet_author_name": "Karan Thakkar",
  "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_id": "733221168459603968",
  "tweet_text": "Someone's getting fired at @myntra today. #MyntraDebacle",
  "tweet_url_entities": [],
  "tweet_media_entities": [],
  "tweet_type": "original",
  "retweet_count": 12,
  "favorite_count": 21,
  "tweet_posted_at": "Thu May 19 09:02:03 +0000 2016"
}, {
  "tweet_id": "733220091332939776",
  "tweet_author": "geekykaran",
  "tweet_author_name": "Karan Thakkar",
  "tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_author": "geekykaran",
  "original_tweet_author_name": "Karan Thakkar",
  "original_tweet_profile_image_url": "https://pbs.twimg.com/profile_images/728274649289785344/W1Ql2Zy__normal.jpg",
  "original_tweet_id": "733220091332939776",
  "tweet_text": ".@myntra @MyntraSupport wtf are you doing, son? https://t.co/XKB90sVuOh",
  "tweet_url_entities": [],
  "tweet_media_entities": [{
    "url": "https://t.co/XKB90sVuOh",
    "media_url": "https://pbs.twimg.com/media/CizrxA0UoAAAjIi.jpg",
    "display_url": "pic.twitter.com/XKB90sVuOh",
    "expanded_url": "http://twitter.com/geekykaran/status/733220091332939776/photo/1",
    "indices": [
      48,
      71
    ]
  }],
  "tweet_type": "original",
  "retweet_count": 1,
  "favorite_count": 4,
  "tweet_posted_at": "Thu May 19 08:57:47 +0000 2016"
}];

const App = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(data),
    };
  },

  onImageLoadError() {
    console.log(arguments);
  },

  renderTweetItem(tweet) {
    return (
      <View style={styles.tweetItem}>
        <View style={styles.leftSection}>
          <Image 
            style={styles.authorImage} 
            source={{uri: tweet.original_tweet_profile_image_url}}
            onError={this.onImageLoadError}
          />
        </View>
        <View style={styles.rightSection}>
          <View style={styles.upperSection}>
            <View style={styles.userInfo}>
              <Text>{tweet.original_tweet_author_name}</Text>
              <Text>{tweet.original_tweet_author}</Text>
            </View>
            <Text>{timeAgo(tweet.tweet_posted_at)}</Text>
          </View>
          <Text style={styles.tweetText}>{tweet.tweet_text}</Text>
        </View>
      </View>
    );
  },

  render() {
    return (
      <View style={styles.listView}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderTweetItem}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  listView: {
    backgroundColor:'#81c04d',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row',
    flex: 1
  },
  tweetItem: {
    padding: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: 'black'
  },
  leftSection: {
    marginRight: 10,
    alignItems: 'center'
  },
  authorImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'black'
  },
  rightSection: {
    flex: 1,
    flexDirection: 'column'
  },
  upperSection: {
    flexDirection: 'row'
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1
  },
  tweetText: {
    fontSize: 16,
    flexDirection: 'row'
  }
});

export default App;