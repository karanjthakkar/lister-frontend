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
  humanize,
  autoLinkWithoutMarkup
} from '../utils/core';
import HTMLView from 'react-native-htmlview';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import retweetIcon from '../images/retweet.png';
import retweetDoneIcon from '../images/retweet_hover.png';
import LikeIcon from '../images/like.png';
import LikeDoneIcon from '../images/like_hover.png';

const TweetItem = React.createClass({
  getInitialState() {
    return {
      'styles': this.props.theme === 'LIGHT' ? lightStyles : darkStyles
    };
  },

  getTweetText(tweet, withoutMarkup) {
    const text = tweet.get('tweet_text');
    const urlEntities = tweet.get('tweet_url_entities').toJSON();
    const mediaEntities = tweet.get('tweet_media_entities').toJSON();
    if (withoutMarkup) {
      return autoLinkWithoutMarkup(text, urlEntities, mediaEntities);
    } else {
      return autoLink(text, urlEntities, mediaEntities);
    }
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
    GoogleAnalytics.trackEvent('List Timeline', 'Open Url');
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
    GoogleAnalytics.trackEvent('List Timeline', 'Open Profile');
    const username = this.props.tweet.get('original_tweet_author');
    this.openUrl(`https://twitter.com/${username}`);
  },

  openRetweeterProfileLink() {
    GoogleAnalytics.trackEvent('List Timeline', 'Open Retweeter Profile');
    const username = this.props.tweet.get('tweet_author');
    this.openUrl(`https://twitter.com/${username}`);
  },

  openTweetLink() {
    GoogleAnalytics.trackEvent('List Timeline', 'Open Tweet');
    const username = this.props.tweet.get('original_tweet_author');
    const tweetId = this.props.tweet.get('original_tweet_id');
    this.openUrl(`https://twitter.com/${username}/status/${tweetId}`);
  },

  openQuotedTweetLink() {
    GoogleAnalytics.trackEvent('List Timeline', 'Open Quoted Tweet');
    const username = this.props.tweet.getIn(['quoted_status', 'tweet_author']);
    const tweetId = this.props.tweet.getIn(['quoted_status', 'tweet_id']);
    this.openUrl(`https://twitter.com/${username}/status/${tweetId}`);
  },

  render() {
    const tweet = this.props.tweet;
    const iconRetweet = tweet.get('retweeted') ? retweetDoneIcon : retweetIcon;
    const iconLike = tweet.get('favorited') ? LikeDoneIcon : LikeIcon;
    const actionRetweet = tweet.get('retweeted') ? this.state.styles.retweetDoneAction : this.state.styles.retweetAction;
    const actionLike = tweet.get('favorited') ? this.state.styles.likeDoneAction : this.state.styles.likeAction;
    return (
      <View style={this.state.styles.tweetItem}>
        {(() => {
          if (tweet.get('tweet_type') === 'retweet') {
            return (
              <View style={this.state.styles.metaSection}>
                <Image
                  style={this.state.styles.smallRetweetIcon}
                  source={iconRetweet}
                />
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={this.openRetweeterProfileLink}
                >
                  <Text style={this.state.styles.retweeter}>
                    {tweet.get('tweet_author_name')} retweeted
                  </Text>
                </TouchableHighlight>
              </View>
            );
          }
        })()}
        <View style={{flexDirection: 'row'}}>
          <View style={this.state.styles.leftSection}>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'transparent'}
              onPress={this.openProfileLink}
            >
              <Image
                style={this.state.styles.authorImage}
                source={{uri: tweet.get('original_tweet_profile_image_url')}}
              />
            </TouchableHighlight>
          </View>
          <View style={this.state.styles.rightSection}>
            <View style={this.state.styles.userInfo}>
              <View style={this.state.styles.upperSection}>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={this.openProfileLink}
                >
                  <Text style={this.state.styles.author}>{tweet.get('original_tweet_author_name')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={'transparent'}
                  onPress={this.openProfileLink}
                >
                  <Text style={this.state.styles.username}>@{tweet.get('original_tweet_author')}</Text>
                </TouchableHighlight>
              </View>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.openTweetLink}
              >
                <Text style={this.state.styles.time}>{timeAgo(tweet.get('tweet_posted_at'), this.props.listMountTime)}</Text>
              </TouchableHighlight>
            </View>
            <Text style={this.state.styles.tweetText}>
              <HTMLView
                value={this.getTweetText(tweet)}
                stylesheet={this.state.styles}
                onLinkPress={this.openUrl}
              ></HTMLView>
            </Text>
            {(() => {
              const firstMediaEntity = tweet.get('tweet_media_entities').first();
              if (firstMediaEntity && firstMediaEntity.get('type') === 'photo') {
                const width = this.props.mediaWidth;
                const height = width * firstMediaEntity.get('aspectRatio');
                return (
                  <View style={this.state.styles.imageContainer}>
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
            {(() => {
              if (tweet.get('is_quote_status')) {
                return this.renderQuotedStatus();
              }
            })()}
            <View style={this.state.styles.actions}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.doRetweetAction}
              >
                <View style={this.state.styles.actionContainer}>
                  <Image
                    style={this.state.styles.retweetIcon}
                    source={iconRetweet}
                  />
                  <Text style={actionRetweet}>
                    {humanize(tweet.get('retweet_count'))}
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={this.doLikeAction}
              >
                <View style={this.state.styles.actionContainer}>
                  <Image
                    style={this.state.styles.likeIcon}
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
  },

  renderQuotedStatus() {
    const tweet = this.props.tweet.get('quoted_status');
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'transparent'}
        onPress={this.openQuotedTweetLink}
      >
        <View style={this.state.styles.quotedContainer}>
          <View style={this.state.styles.upperSection}>
            <Text style={this.state.styles.author}>{tweet.get('tweet_author_name')}</Text>
            <Text style={this.state.styles.username}>@{tweet.get('tweet_author')}</Text>
          </View>
          {(() => {
            const firstMediaEntity = tweet.get('tweet_media_entities').first();
            if (firstMediaEntity && firstMediaEntity.get('type') === 'photo') {
              return (
                <View style={this.state.styles.quotedTweetContainer}>
                  <View style={this.state.styles.quotedImageContainer}>
                    <Image
                      style={{
                        width: 100,
                        height: 70,
                        resizeMode: 'cover'
                      }}
                      source={{uri: firstMediaEntity.get('media_url')}}
                    />
                  </View>
                  <Text style={this.state.styles.quotedText}>{this.getTweetText(tweet, true)}</Text>
                </View>
              );
            } else {
              return (
                <Text style={this.state.styles.quotedText}>{this.getTweetText(tweet, true)}</Text>
              );
            }
          })()}
        </View>
      </TouchableHighlight>
    );
  }
});

const lightStyles = StyleSheet.create({
  quotedContainer: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10
  },
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
    fontSize: 13,
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
    flex: 1,
    overflow: 'hidden'
  },
  userInfo: {
    flexDirection: 'row'
  },
  author: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 5
  },
  username: {
    fontSize: 14,
    color: '#8899a6'
  },
  time: {
    fontSize: 14,
    color: '#8899a6'
  },
  p: {
    color: '#292f33',
    fontSize: 15,
    lineHeight: 18
  },
  a: {
    color: '#007AFF',
    fontSize: 15,
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
    fontSize: 13,
    lineHeight: 15
  },
  retweetDoneAction: {
    marginRight: 10,
    color: '#19CF86',
    fontSize: 15,
    lineHeight: 17
  },
  retweetAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 15,
    lineHeight: 17
  },
  likeDoneAction: {
    marginRight: 10,
    color: '#E81C4F',
    fontSize: 15,
    lineHeight: 17
  },
  likeAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 15,
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
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden'
  },
  quotedImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden',
    marginRight: 10
  },
  quotedTweetContainer: {
    flexDirection: 'row'
  },
  quotedText: {
    flex: 1,
    fontSize: 14
  },
  tweetText: {
    marginBottom: 10
  }
});

const darkStyles = StyleSheet.create({
  quotedContainer: {
    borderWidth: 1,
    borderColor: '#394A5D',
    backgroundColor: '#2A3D51',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10
  },
  tweetItem: {
    padding: 10,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#303B47'
  },
  metaSection: {
    marginLeft: 20,
    marginBottom: 5,
    flexDirection: 'row'
  },
  retweeter: {
    fontSize: 13,
    marginRight: 5,
    color: '#8899A6'
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
    flex: 1,
    overflow: 'hidden'
  },
  userInfo: {
    flexDirection: 'row'
  },
  author: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 5,
    color: '#E8EAEB'
  },
  username: {
    fontSize: 14,
    color: '#8899A6'
  },
  time: {
    fontSize: 14,
    color: '#8899A6'
  },
  p: {
    color: '#C5C9CC',
    fontSize: 15,
    lineHeight: 18
  },
  a: {
    color: '#2AA2EF',
    fontSize: 15,
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
    fontSize: 13,
    lineHeight: 15
  },
  retweetDoneAction: {
    marginRight: 10,
    color: '#19CF86',
    fontSize: 15,
    lineHeight: 17
  },
  retweetAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 15,
    lineHeight: 17
  },
  likeDoneAction: {
    marginRight: 10,
    color: '#E81C4F',
    fontSize: 15,
    lineHeight: 17
  },
  likeAction: {
    marginRight: 10,
    color: '#8899a6',
    fontSize: 15,
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
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden'
  },
  quotedImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.1)',
    overflow: 'hidden',
    marginRight: 10
  },
  quotedTweetContainer: {
    flexDirection: 'row'
  },
  quotedText: {
    flex: 1,
    fontSize: 14,
    color: '#C5C9CC'
  },
  tweetText: {
    marginBottom: 10
  }
});

export default TweetItem;
