import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './src/containers/App';
import configStore from './src/stores/store.dev';

const store = configStore();

var ListerApp = React.createClass({
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
});

AppRegistry.registerComponent('ListerApp', () => ListerApp);
