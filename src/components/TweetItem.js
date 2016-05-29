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
  autoLink,
  humanize
} from '../utils/core';
import HTMLView from 'react-native-htmlview';

import retweetIcon from '../images/retweet.png';
import retweetDoneIcon from '../images/retweet_hover.png';
import LikeIcon from '../images/like.png';
import LikeDoneIcon from '../images/like_hover.png';

const TweetItem = React.createClass({
  getTweetText(tweet) {
    const text = tweet.get('tweet_text');
    const urlEntities = tweet.get('tweet_url_entities').toJSON();
    const mediaEntities = tweet.get('tweet_media_entities').toJSON();
    return autoLink(text, urlEntities, mediaEntities);
  },

  doRetweetAction() {
    const tweet = this.props.tweet;
    if (tweet.get('retweeted')) {
      this.props.userAction('unretweet', tweet.get('tweet_id'));
    } else {
      this.props.userAction('retweet', tweet.get('tweet_id'));
    }
  },

  doLikeAction() {
    const tweet = this.props.tweet;
    if (tweet.get('favorited')) {
      this.props.userAction('unfavorite', tweet.get('tweet_id'));
    } else {
      this.props.userAction('favorite', tweet.get('tweet_id'));
    }
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

  openRetweeterProfileLink() {
    const username = this.props.tweet.get('tweet_author');
    this.openUrl(`https://twitter.com/${username}`);
  },

  openTweetLink() {
    const username = this.props.tweet.get('original_tweet_author');
    const tweetId = this.props.tweet.get('original_tweet_id');
    this.openUrl(`https://twitter.com/${username}/status/${tweetId}`);
  },

  render() {
    const tweet = this.props.tweet;
    const iconRetweet = tweet.get('retweeted') ? retweetDoneIcon : retweetIcon;
    const iconLike = tweet.get('favorited') ? LikeDoneIcon : LikeIcon;
    const actionRetweet = tweet.get('retweeted') ? styles.retweetDoneAction : styles.retweetAction;
    const actionLike = tweet.get('favorited') ? styles.likeDoneAction : styles.likeAction;
    return (
      <View style={styles.tweetItem}>
        {(() => {
          if (tweet.get('tweet_type') === 'retweet') {
            return (
              <View style={styles.metaSection}>
                <Image
                  style={styles.smallRetweetIcon}
                  source={iconRetweet}
                />
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'#f5f8fa'}
                  onPress={this.openRetweeterProfileLink}
                >
                  <Text style={styles.retweeter}>
                    {tweet.get('tweet_author_name')} retweeted
                  </Text>
                </TouchableHighlight>
              </View>
            );
          }
        })()}
        <View style={{flexDirection: 'row'}}>
          <View style={styles.leftSection}>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#f5f8fa'}
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
                  underlayColor={'#f5f8fa'}
                  onPress={this.openProfileLink}
                >
                  <Text style={styles.author}>{tweet.get('original_tweet_author_name')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'#f5f8fa'}
                  onPress={this.openProfileLink}
                >
                  <Text style={styles.username}>@{tweet.get('original_tweet_author')}</Text>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'#f5f8fa'}
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
                underlayColor={'#f5f8fa'}
                onPress={this.doRetweetAction}
              >
                <View style={styles.actionContainer}>
                  <Image
                    style={styles.retweetIcon}
                    source={iconRetweet}
                  />
                  <Text style={actionRetweet}>
                    {humanize(tweet.get('retweet_count'))}
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'#f5f8fa'}
                onPress={this.doLikeAction}
              >
                <View style={styles.actionContainer}>
                  <Image
                    style={styles.likeIcon}
                    source={iconLike}
                  />
                  <Text style={actionLike}>
                    {humanize(tweet.get('favorite_count'))}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  tweetItem: {
    padding: 10,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E1E8ED'
  },
  metaSection: {
    marginLeft: 20,
    marginBottom: 5,
    flexDirection: 'row'
  },
  retweeter: {
    fontSize: 12,
    marginRight: 5,
    color: '#8899a6'
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
    width: 70
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
    fontSize: 14,
    lineHeight: 17
  },
  retweetAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 14,
    lineHeight: 17
  },
  likeDoneAction: {
    marginRight: 10,
    color: '#E81C4F',
    fontSize: 14,
    lineHeight: 17
  },
  likeAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 14,
    lineHeight: 17
  },
  retweetIcon: {
    height: 20,
    width: 20.833,
    marginRight: 3
  },
  smallRetweetIcon: {
    height: 14,
    width: 14.6,
    marginRight: 3
  },
  likeIcon: {
    height: 20,
    width: 15,
    marginRight: 3
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden'
  }
});

export default TweetItem;
