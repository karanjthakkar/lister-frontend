import React from 'react';
import {
  StyleSheet,
  View,
  WebView,
  ActivityIndicatorIOS,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import CookieManager from 'react-native-cookies';

import { stripText } from '../utils/core';

import closeIcon from '../images/close.png';

var TwitterLogin = React.createClass({

  getInitialState() {
    return {
      'url': ''
    };
  },

  onNavigationStateChange(data) {
    const url = data.url;
    this.setState({
      'url': stripText(url)
    });
    const callbackUrlSegment = 'http://staging.tweetify.io/?code=';
    if (url.indexOf(callbackUrlSegment) > -1) {
      const userId = url.replace(callbackUrlSegment, '');
      if (userId !== '0') {
        CookieManager.get(url, (err, res) => {
          var cookie = '';
          for (var key in res) {
            cookie += key + '=' + res[key] + ';';
          }
          this.refs.webview.stopLoading();
          this.props.onComplete(userId, cookie);
        });
      } else {
        this.refs.webview.stopLoading();
        this.props.onFailure();
      }
    }
  },

  renderLoading() {
    return (
      <View style={styles.loading}>
        <ActivityIndicatorIOS
          animating={true}
          size="small"
        />
      </View>
    );
  },

  closeWebview() {
    this.refs.webview.stopLoading();
    this.props.onFailure();
  },

  render() {
    return (
      <View style={styles.loginPage}>
        <View style={styles.webviewHeader}>
          <Text style={styles.webviewHeaderText}>
            {this.state.url}
          </Text>
          <TouchableOpacity
              onPress={this.closeWebview}
              style={styles.navButton}
            >
            <Image
              style={styles.closeIcon}
              source={closeIcon}
            />
          </TouchableOpacity>
        </View>
        <WebView
          ref="webview"
          style={styles.webview}
          automaticallyAdjustContentInsets={false}
          source={{uri: 'https://api.tweetify.io/auth/twitter'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={true}
          renderLoading={this.renderLoading}
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  loginPage: {
    flexDirection: 'column',
    flex: 1
  },
  loading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  webviewHeader: {
    marginTop: 25,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderBottomWidth: 1
  },
  webviewHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16
  },
  closeIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  }
});

export default TwitterLogin;
