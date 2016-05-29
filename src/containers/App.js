import React from 'react';
import {
  Navigator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicatorIOS,
  ActionSheetIOS,
  Alert
} from 'react-native';
import CookieManager from 'react-native-cookies';
import store from 'react-native-simple-store';

import TweetListView from '../components/TweetListView';
import UserListView from '../components/UserListView';
import LoginScreen from '../components/LoginScreen';
import Twitterlogin from '../components/Twitterlogin';
import { clearLocalCache } from '../utils/core';

import backIcon from '../images/left_arrow_blue.png';
import settingsIcon from '../images/settings.png';
import refreshIcon from '../images/refresh.png';

const EventEmitter = require('EventEmitter');

const App = React.createClass({

  getInitialState() {
    return {
      'isAuthenticated': false,
      'isWebView': false,
      'isLoading': true,
      'cookie': null,
      'userId': null
    };
  },

  componentWillMount() {
    this.eventEmitter = new EventEmitter();

    store.get('COOKIE')
      .then((cookie) => {
        store.get('USER_ID')
          .then((userId) => {
            if (cookie && userId) {
              this.setState({
                'isAuthenticated': true,
                'isLoading': false,
                'cookie': cookie,
                'userId': userId
              });
            } else {
              this.setState({
                'isAuthenticated': false,
                'isLoading': false
              });
            }
          });
      });
  },

  doLogout() {
    clearLocalCache(() => {
      CookieManager.clearAll((err, res) => {
        this.setState({
          'isAuthenticated': false,
          'isWebView': false,
          'isLoading': false,
          'cookie': null,
          'userId': null
        });
      });
    });
  },

  doLogoutWithMessage() {
    this.doLogout();
    Alert.alert(
      'Error',
      `Your session has expired. Login again.`,
      [
        {text: 'OK'}
      ]
    );
  },

  openWebView() {
    this.setState({
      'isWebView': true
    });
  },

  onComplete(userId, cookie) {
    store.save('COOKIE', cookie)
      .then(() => {
        store.save('USER_ID', userId)
          .then(() => {
            this.setState({
              'isWebView': false,
              'isAuthenticated': true,
              'userId': userId,
              'cookie': cookie
            });
          });
      });
  },

  onFailure() {
    this.setState({
      'isWebView': false
    });
    Alert.alert(
      'Error',
      `Unable to login.`,
      [
        {text: 'OK'}
      ]
    );
  },

  renderScene(route, navigator) {
    if (route.name === 'UserListView') {
      return (
        <UserListView
          navigator={navigator}
          userId={this.state.userId}
          cookie={this.state.cookie}
          doLogout={this.doLogoutWithMessage}
        />
      );
    } else if (route.name === 'TweetListView') {
      return (
        <TweetListView
          navigator={navigator}
          routeEvents={this.eventEmitter}
          data={route.listItem}
          userId={this.state.userId}
          cookie={this.state.cookie}
          doLogout={this.doLogoutWithMessage}
        />
      );
    }
  },

  refreshTweetListView() {
    this.eventEmitter.emit('reloadTweetListView');
  },

  renderNavBar() {
    const _this = this;
    const NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        if (route.name === 'TweetListView') {
          return (
            <TouchableOpacity
              onPress={() => navigator.pop()}
              style={styles.navButton}
            >
              <Image
                style={styles.backIcon}
                source={backIcon}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          );
        }
        return null;
      },
      Title(route, navigator, index, navState) {
        if (route.name === 'UserListView') {
          return(
            <Text style={styles.title}>
              Your Lists
            </Text>
          );
        } else {
          return(
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>
                {route.listItem.get('list_name')}
              </Text>
              <Text style={styles.subheading}>
                @{route.listItem.get('list_owner_author')}
              </Text>
            </View>
          );
        }
      },
      RightButton(route, navigator, index, navState) {
        if (route.name === 'UserListView') {
          return (
            <TouchableOpacity
              onPress={_this.showSettings}
              style={styles.navButton}
            >
              <Image
                style={styles.navIcon}
                source={settingsIcon}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={_this.refreshTweetListView}
              style={styles.navButton}
            >
              <Image
                style={styles.navIcon}
                source={refreshIcon}
              />
            </TouchableOpacity>
          );
        }
      }
    };
    return (
      <Navigator.NavigationBar
        style={styles.navBar}
        routeMapper={NavigationBarRouteMapper}
      />
    );
  },

  showSettings() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Logout',
        'Cancel',
      ],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      title: 'Account Settings'
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        this.doLogout();
      }
    });
  },

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicatorIOS
            animating={true}
            size="small"
          />
        </View>
      );
    }

    if (!this.state.isAuthenticated) {
      if (this.state.isWebView) {
        return (
          <Twitterlogin
            onComplete={this.onComplete}
            onFailure={this.onFailure}
          />
        );
      } else {
        return (
          <LoginScreen openWebView={this.openWebView} />
        );
      }
    }

    return (
      <Navigator
        initialRoute={{
          name: 'UserListView'
        }}
        sceneStyle={{
          overflow: 'visible',
          shadowColor: '#2D2727',
          shadowOpacity: 0.5,
          shadowRadius: 6,
          backgroundColor: '#2D2727',
        }}
        renderScene={this.renderScene}
        navigationBar={this.renderNavBar()}
      />
    );
  }
});

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E0E0E0',
    borderBottomWidth: 1
  },
  title: {
    marginTop: 10,
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  backButtonText: {
    color: '#1998F7',
    fontSize: 14,
    fontWeight: 'bold'
  },
  backIcon: {
    width: 10,
    height: 15,
    marginRight: 5
  },
  navIcon: {
    width: 20,
    height: 20,
    opacity: 0.7,
    marginRight: 5
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  heading: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subheading: {
    fontSize: 11,
    textAlign: 'center',
    color: '#8899a6'
  },
});

export default App;
