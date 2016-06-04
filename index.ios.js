import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './src/containers/App';
import configStore from './src/stores/store.dev';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

const store = configStore();

// Initialize analytics
GoogleAnalytics.setTrackerId('UA-28477787-4');
GoogleAnalytics.setAppName('Tweetify');
GoogleAnalytics.setDispatchInterval(10);

// GoogleAnalytics.setDryRun(true);

var TweetifyApp = React.createClass({
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
});

AppRegistry.registerComponent('TweetifyApp', () => TweetifyApp);
