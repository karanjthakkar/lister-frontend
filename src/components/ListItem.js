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

  render() {
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
              <Text style={this.state.styles.author}>
                by
              </Text>
              <Text style={this.state.styles.author}>
                @{this.props.data.get('list_owner_author')}
              </Text>
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
            if (this.props.data.get('is_favorited')) {
              return (
                <View style={this.state.styles.rightSection}>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={'transparent'}
                    onPress={this.addListToFavorites}
                  >
                    <Image
                      style={this.state.styles.favIcon}
                      source={favHoverIcon}
                    />
                  </TouchableHighlight>
                </View>
              );
            } else {
              return (
                <View style={this.state.styles.rightSection}>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={'transparent'}
                    onPress={this.addListToFavorites}
                  >
                    <Image
                      style={this.state.styles.favIcon}
                      source={favIcon}
                    />
                  </TouchableHighlight>
                </View>
              );
            }
          })()}
        </View>
      </TouchableHighlight>
    );
  }
});

const darkStyles = StyleSheet.create({
  listItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#303B47',
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
    marginRight: 5,
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
    height: 8
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
  rightSection: {
    marginLeft: 10
  }
});

const lightStyles = StyleSheet.create({
  listItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#FFFFFF'
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5
  },
  author: {
    fontSize: 13,
    marginRight: 5,
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
  rightSection: {
    marginLeft: 10
  }
});

export default UserListView;
