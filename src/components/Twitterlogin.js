import React from 'react';
import {
  StyleSheet,
  View,
  WebView,
  ActivityIndicatorIOS
} from 'react-native';

import CookieManager from 'react-native-cookies';

var TwitterLogin = React.createClass({

  onNavigationStateChange(data) {
    const url = data.url;
    const callbackUrlSegment = 'http://local.lister.co:3000/?code=';
    if (url.indexOf(callbackUrlSegment) > -1) {
      const userId = url.replace(callbackUrlSegment, '');
      if (userId !== '0') {
        CookieManager.get(url, (err, res) => {
          var cookie = '';
          for (var key in res) {
            cookie += key + '=' + res[key] + ';';
          }
          this.props.onComplete(userId, cookie);
        });
      } else {
        this.props.onFailure(cookie);
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

  render() {
    return (
      <WebView
        automaticallyAdjustContentInsets={false}
        source={{uri: 'http://local.lister.co:3000/auth/twitter'}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        decelerationRate="normal"
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={true}
        renderLoading={this.renderLoading}
      />
    );
  }
});

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  }
});

export default TwitterLogin;
