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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CookieManager from 'react-native-cookies';
import store from 'react-native-simple-store';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import TweetListView from '../components/TweetListView';
import UserListView from '../components/UserListView';
import LoginScreen from '../components/LoginScreen';
import Twitterlogin from '../components/Twitterlogin';
import { clearLocalCache } from '../utils/core';
import actions from '../actions';

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
      'userId': null,
      'username': '',
      'theme': 'LIGHT',
      'styles': lightStyles
    };
  },

  componentWillMount() {
    this.eventEmitter = new EventEmitter();

    store.get('COOKIE')
      .then((cookie) => {
        store.get('USER_ID')
          .then((userId) => {
            store.get('USERNAME')
              .then((username) => {
                store.get('THEME')
                  .then((theme) => {
                    if (cookie && userId && username) {

                      // Track userid
                      GoogleAnalytics.setUser(userId);

                      const cachedTheme = theme || 'LIGHT';
                      this.setState({
                        'isAuthenticated': true,
                        'isLoading': false,
                        'cookie': cookie,
                        'userId': userId,
                        'username': username,
                        'theme': cachedTheme,
                        'styles': cachedTheme === 'LIGHT' ? lightStyles : darkStyles
                      });
                    } else {
                      this.setState({
                        'isAuthenticated': false,
                        'isLoading': false
                      });
                    }
                  });
              });
          });
      });
  },

  doLogout() {
    this.props.actions.doLogout({
      cookie: this.state.cookie
    });
    clearLocalCache(() => {
      CookieManager.clearAll((err, res) => {
        this.setState({
          'isAuthenticated': false,
          'isWebView': false,
          'isLoading': false,
          'cookie': null,
          'userId': null,
          'username': '',
          'theme': 'LIGHT',
          'styles': lightStyles
        });
      });
    });
  },

  doLogoutWithMessage() {
    GoogleAnalytics.trackEvent('Logout', 'Session Expired');
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
    GoogleAnalytics.trackScreenView('Login - Webview');
    GoogleAnalytics.trackEvent('Login', 'Login Start');
    this.setState({
      'isWebView': true
    });
  },

  onComplete(params, cookie) {
    const { userId, username } = params;
    GoogleAnalytics.trackEvent('Login', 'Login Complete');
    store.save('COOKIE', cookie)
      .then(() => {
        store.save('USER_ID', userId)
          .then(() => {
            store.save('USERNAME', username)
              .then(() => {

                // Track userid
                GoogleAnalytics.setUser(userId);

                this.setState({
                  'isWebView': false,
                  'isAuthenticated': true,
                  'userId': userId,
                  'username': username,
                  'cookie': cookie
                });
              });
          });
      });
  },

  onFailure() {
    GoogleAnalytics.trackEvent('Login', 'Login Failed');
    this.setState({
      'isWebView': false
    });
    Alert.alert(
      'Error',
      `Login failed. Please try again.`,
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
          theme={this.state.theme}
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
          theme={this.state.theme}
        />
      );
    }
  },

  refreshTweetListView() {
    GoogleAnalytics.trackEvent('Refresh', 'Refresh Timeline');
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
              style={_this.state.styles.navButton}
            >
              <Image
                style={_this.state.styles.backIcon}
                source={backIcon}
              />
              <Text style={_this.state.styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          );
        }
        return null;
      },
      Title(route, navigator, index, navState) {
        if (route.name === 'UserListView') {
          return(
            <Text style={_this.state.styles.title}>
              Your Lists
            </Text>
          );
        } else {
          return(
            <View style={_this.state.styles.headingContainer}>
              <Text style={_this.state.styles.heading}>
                {route.listItem.get('list_name')}
              </Text>
              <Text style={_this.state.styles.subheading}>
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
              style={_this.state.styles.navButton}
            >
              <Image
                style={_this.state.styles.navIcon}
                source={settingsIcon}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={_this.refreshTweetListView}
              style={_this.state.styles.navButton}
            >
              <Image
                style={_this.state.styles.navIcon}
                source={refreshIcon}
              />
            </TouchableOpacity>
          );
        }
      }
    };
    return (
      <Navigator.NavigationBar
        style={this.state.styles.navBar}
        routeMapper={NavigationBarRouteMapper}
      />
    );
  },

  showSettings() {
    GoogleAnalytics.trackEvent('Click', 'Settings');
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        `Switch to ${this.state.theme === 'LIGHT'? 'Dark' : 'Light'} Mode`,
        'Logout',
        'Cancel',
      ],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1,
      title: `Account Settings (@${this.state.username})`
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        const newTheme = (this.state.theme === 'LIGHT') ? 'DARK' : 'LIGHT';
        this.setState({
          'theme': newTheme,
          'styles': newTheme === 'LIGHT' ? lightStyles : darkStyles
        });

        GoogleAnalytics.trackEvent('Theme Change', newTheme);

        store.save('THEME', newTheme);
        this.refs.navigator.replace({
          name: 'UserListView'
        });
      } else if (buttonIndex === 1) {
        GoogleAnalytics.trackEvent('Logout', 'Manual');
        GoogleAnalytics.trackEvent('Click', 'Settings - Logout');
        this.doLogout();
      } else {
        GoogleAnalytics.trackEvent('Click', 'Settings - Cancel');
      }
    });
  },

  render() {
    if (this.state.isLoading) {
      GoogleAnalytics.trackScreenView('Initalizing');
      return (
        <View style={this.state.styles.loading}>
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
        GoogleAnalytics.trackScreenView('Login Page');
        return (
          <LoginScreen openWebView={this.openWebView} />
        );
      }
    }

    return (
      <Navigator
        ref="navigator"
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

const lightStyles = StyleSheet.create({
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
  }
});

const darkStyles = StyleSheet.create({
  navBar: {
    backgroundColor: '#192633',
    borderColor: '#303B47',
    borderBottomWidth: 1
  },
  title: {
    marginTop: 10,
    color: '#E8EAEB',
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
    marginRight: 5,
    tintColor: '#E8EAEB'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192633'
  },
  heading: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E8EAEB'
  },
  subheading: {
    fontSize: 11,
    textAlign: 'center',
    color: '#8899A6'
  }
});

function mapStateToProps(state) {
  return { };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
