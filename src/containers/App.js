import React from 'react';
import {
  Navigator,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import TweetListView from '../components/TweetListView';
import UserListView from '../components/UserListView';

import backIcon from '../images/left_arrow_blue.png';

const App = React.createClass({

  renderScene(route, navigator) {
    if (route.name === 'UserListView') {
      return (
        <UserListView 
          navigator={navigator}
          userId={'3303637404'}
        />
      );
    } else if (route.name === 'TweetListView') {
      return (
        <TweetListView 
          navigator={navigator}
          data={route.listItem}
        />
      );
    }
  },

  renderNavBar() {
    const NavigationBarRouteMapper = {
      LeftButton(route, navigator, index, navState) {
        if (route.name === 'TweetListView') {
          return (
            <TouchableOpacity 
              onPress={() => navigator.pop()}
              style={styles.backButton}
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
        return(
          <Text style={styles.title}>{route.name}</Text>
        )
      },
      RightButton() {
        return null;
      }
    };
    return (
      <Navigator.NavigationBar 
        style={styles.navBar}
        routeMapper={NavigationBarRouteMapper}
      />
    );
  },

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'UserListView'
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
  backButton: {
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
  }
});

export default App;