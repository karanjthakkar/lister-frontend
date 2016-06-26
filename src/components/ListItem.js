import React from 'react';
import {
  Text,
  TweetListView,
  View,
  TouchableHighlight,
  StyleSheet,
  Image
} from 'react-native';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swipeout from 'react-native-swipeout';

import lockIcon from '../images/lock.png';
import favHoverIcon from '../images/fav_hover.png';
import favIcon from '../images/fav.png';

const UserListView = React.createClass({
  getInitialState() {
    return {
      'styles': this.props.theme === 'LIGHT' ? lightStyles : darkStyles
    };
  },

  openListView() {
    this.props.openListView(this.props.data);
  },

  addListToFavorites() {
    if (this.props.data.get('is_favorited')) {
      this.props.unfavoriteList(this.props.data.toJSON());
    } else {
      this.props.favoriteList(this.props.data.toJSON());
    }
  },

  renderSwipeActionIcon() {
    return (
      <View style={this.state.styles.rightSection}>
        <Image
          style={this.state.styles.favIcon}
          source={this.props.data.get('is_favorited') ? favHoverIcon : favIcon}
        />
      </View>
    );
  },

  renderItem() {
    return (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'#E1E8ED'}
        onPress={this.openListView}
      >
        <View style={this.state.styles.listItem}>
          <View style={this.state.styles.leftSection}>
            <Image
              style={this.state.styles.authorImage}
              source={{uri: this.props.data.get('list_owner_profile_image_url')}}
            />
          </View>
          <View style={this.state.styles.middleSection}>
            <View style={this.state.styles.userInfo}>
              <Text style={this.state.styles.name}>
                {this.props.data.get('list_name')}
              </Text>
              <View style={this.state.styles.metaText}>
                <Text style={this.state.styles.author}>by @{this.props.data.get('list_owner_author')} </Text>
                {(() => {
                  if (this.props.data.get('is_private')) {
                    return (
                      <Image
                        style={this.state.styles.lockIcon}
                        source={lockIcon}
                      />
                    );
                  }
                })()}
              </View>
            </View>
            {(() => {
              if (this.props.data.get('list_description')) {
                return (
                  <Text style={this.state.styles.description}>
                    {this.props.data.get('list_description')}
                  </Text>
                );
              }
            })()}
            <Text style={this.state.styles.memberCount}>
              {this.props.data.get('list_member_count')}
              &nbsp;
              {this.props.data.get('list_member_count') > 1 ? 'members': 'member'}
            </Text>
          </View>
          {(() => {
            if (this.props.listType === 'Favorites') {
              return (
                <View style={this.state.styles.favoritedIcon}>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={'transparent'}
                    onPress={this.addListToFavorites}
                  >
                    <Image
                      style={this.state.styles.favIcon}
                      source={this.props.data.get('is_favorited') ? favHoverIcon : favIcon}
                    />
                  </TouchableHighlight>
                </View>
              );
            }
          })()}
        </View>
      </TouchableHighlight>
    );
  },

  render() {
    const swipeoutBtns = [{
      'text': 'Unfavorite',
      'component': this.renderSwipeActionIcon(),
      'onPress': this.addListToFavorites,
      'backgroundColor': this.props.theme === 'LIGHT' ? '#F8F8F8' : '#E6E6E6'
    }];
    if (this.props.listType === 'AllLists') {
      return (
        <View style={this.state.styles.listItemSwipeout}>
          <Swipeout
            right={swipeoutBtns}
            backgroundColor={this.props.theme === 'LIGHT' ? '#F8F8F8' : '#E6E6E6'}
          >
            {this.renderItem()}
          </Swipeout>
        </View>
      );
    } else {
      return (
        <View style={this.state.styles.listItemSwipeout}>
          {this.renderItem()}
        </View>
      );
    }
  }
});

const darkStyles = StyleSheet.create({
  listItemSwipeout: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#303B47'
  },
  metaText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#192633'
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
    color: '#E8EAEB'
  },
  author: {
    fontSize: 13,
    color: '#8899A6'
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
    color: '#8899A6'
  },
  lockIcon: {
    width: 8,
    height: 8,
    tintColor: '#E8EAEB'
  },
  memberCount: {
    fontSize: 12,
    marginRight: 5,
    marginTop: 2,
    color: '#8899A6'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  leftSection: {
    marginRight: 10
  },
  authorImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
  },
  favIcon: {
    width: 25,
    height: 23.2
  },
  middleSection: {
    flexDirection: 'column',
    flex: 1
  },
  favoritedIcon: {
    marginLeft: 10
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const lightStyles = StyleSheet.create({
  listItemSwipeout: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E1E8ED'
  },
  metaText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF'
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5
  },
  author: {
    fontSize: 13,
    color: '#8899a6'
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2
  },
  lockIcon: {
    width: 8,
    height: 8
  },
  memberCount: {
    fontSize: 12,
    marginRight: 5,
    marginTop: 2,
    color: '#8899a6'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  leftSection: {
    marginRight: 10
  },
  authorImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
  },
  favIcon: {
    width: 25,
    height: 23.2
  },
  middleSection: {
    flexDirection: 'column',
    flex: 1
  },
  favoritedIcon: {
    marginLeft: 10
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default UserListView;
