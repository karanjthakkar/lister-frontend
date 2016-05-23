import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Linking,
  Alert
} from 'react-native';
import { 
  timeAgo, 
  autoLink
} from '../utils/core';
import HTMLView from 'react-native-htmlview';

import retweetIcon from '../images/retweet.png';
import retweetDoneIcon from '../images/retweet_hover.png';
import LikeIcon from '../images/like.png';
import LikeDoneIcon from '../images/like_hover.png';

const TweetItem = React.createClass({
  getInitialState() {
    return {
      'hasRetweeted': false,
      'hasLiked': false
    };
  },

  getTweetText(tweet) {
    const text = tweet.get('tweet_text');
    const urlEntities = tweet.get('tweet_url_entities').toJSON();
    const mediaEntities = tweet.get('tweet_media_entities').toJSON();
    return autoLink(text, urlEntities, mediaEntities);
  },

  doRetweetAction() {
    const tweet = this.props.tweet;
    this.setState({
      'hasRetweeted': !this.state.hasRetweeted
    }, () => {
      if (this.state.hasRetweeted) {
        this.props.userAction('retweet', tweet.get('tweet_id'));
      }
    });
  },

  doLikeAction() {
    const tweet = this.props.tweet;
    this.setState({
      'hasLiked': !this.state.hasLiked
    }, () => {
      if (this.state.hasLiked) {
        this.props.userAction('favorite', tweet.get('tweet_id'));
      }
    });
  },

  openUrl(url) {
    Linking.openURL(url).catch((err) => {
      Alert.alert(
        'Error',
        `We couldn't open ${url}`,
        [
          {text: 'OK'}
        ]
      );
    });
  },

  openProfileLink() {
    const username = this.props.tweet.get('original_tweet_author');
    this.openUrl(`https://twitter.com/${username}`);
  },

  openTweetLink() {
    const username = this.props.tweet.get('original_tweet_author');
    const tweetId = this.props.tweet.get('original_tweet_id');
    this.openUrl(`https://twitter.com/${username}/status/${tweetId}`);
  },

  render() {
    const tweet = this.props.tweet;
    const iconRetweet = this.state.hasRetweeted ? retweetDoneIcon : retweetIcon;
    const iconLike = this.state.hasLiked ? LikeDoneIcon : LikeIcon;
    const actionRetweet = this.state.hasRetweeted ? styles.retweetDoneAction : styles.retweetAction;
    const actionLike = this.state.hasLiked ? styles.likeDoneAction : styles.likeAction;
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'#f5f8fa'}
        onPress={this.openTweetLink}
      >
        <View style={styles.tweetItem}>
          <View style={styles.leftSection}>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'transparent'}
              onPress={this.openProfileLink}
            >
              <Image 
                style={styles.authorImage} 
                source={{uri: tweet.get('original_tweet_profile_image_url')}}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.rightSection}>          
            <View style={styles.userInfo}>
              <View style={styles.upperSection}>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={this.openProfileLink}
                >
                  <Text style={styles.author}>{tweet.get('original_tweet_author_name')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={this.openProfileLink}
                >
                  <Text style={styles.username}>@{tweet.get('original_tweet_author')}</Text>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.openTweetLink}
              >
                <Text style={styles.time}>{timeAgo(tweet.get('tweet_posted_at'))}</Text>
              </TouchableHighlight>
            </View>
            <Text>
              <HTMLView 
                value={this.getTweetText(tweet)}
                stylesheet={styles}
                onLinkPress={this.openUrl}
              ></HTMLView>
            </Text>
            {(() => {
              const firstMediaEntity = tweet.get('tweet_media_entities').first();
              if (tweet.get('tweet_media_entities').count() > 0
                  && firstMediaEntity.get('type') === 'photo') {
                const width = this.props.mediaWidth;
                const height = width * firstMediaEntity.get('aspectRatio');
                return (
                  <View style={styles.imageContainer}>
                    <Image 
                      style={{
                        width: width,
                        height: height
                      }}
                      source={{uri: firstMediaEntity.get('media_url')}}
                    />
                  </View>
                );
              } 
            })()}
            <View style={styles.actions}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.doRetweetAction}
              >
                <View style={styles.actionContainer}>
                  <Image
                    style={styles.retweetIcon}
                    source={iconRetweet}
                  />
                  <Text style={actionRetweet}>
                    {tweet.get('retweet_count')}
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.doLikeAction}
              >
                <View style={styles.actionContainer}>
                  <Image
                    style={styles.likeIcon}
                    source={iconLike}
                  />
                  <Text style={actionLike}>
                    {tweet.get('favorite_count')}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  tweetItem: {
    padding: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E1E8ED'
  },
  leftSection: {
    marginRight: 10,
    alignItems: 'center'
  },
  authorImage: {
    width: 34,
    height: 34,
    borderRadius: 17
  },
  rightSection: {
    flex: 1,
    flexDirection: 'column'
  },
  upperSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    flex: 1
  },
  userInfo: {
    flexDirection: 'row'
  },
  author: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5
  },
  username: {
    fontSize: 13,
    color: '#8899a6'
  },
  time: {
    fontSize: 13,
    color: '#8899a6'
  },
  p: {
    color: '#292f33',
    fontSize: 14,
    lineHeight: 18
  },
  a: {
    color: '#007AFF',
    fontSize: 14,
    lineHeight: 18
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 10
  },
  actionContainer: {
    flexDirection: 'row',
    width: 50
  },
  action: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 12,
    lineHeight: 15
  },
  retweetDoneAction: {
    marginRight: 10,
    color: '#19CF86',
    fontSize: 12,
    lineHeight: 15
  },
  retweetAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 12,
    lineHeight: 15
  },
  likeDoneAction: {
    marginRight: 10,
    color: '#E81C4F',
    fontSize: 12,
    lineHeight: 15
  },
  likeAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 12,
    lineHeight: 15
  },
  retweetIcon: {
    height: 18,
    width: 18.75,
    marginRight: 3
  },
  likeIcon: {
    height: 18,
    width: 13.5,
    marginRight: 3
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden'
  }
});

export default TweetItem;