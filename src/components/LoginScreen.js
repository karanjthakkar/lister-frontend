import React from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';

import loginImage from '../images/login_bg.jpeg';

const width = Dimensions.get('window').height * 1.5;
const height = Dimensions.get('window').height;

const LoginScreen = React.createClass({
  getInitialState() {
    return {
      'offset': 250
    };
  },

  componentDidMount() {
    this.isMounted = true;
    this.moveTheImageByDelta();
  },

  componentWillUnmount() {
    this.isMounted = false;
    cancelAnimationFrame(this.timing);
  },

  moveTheImageByDelta() {
    if (this.isMounted) {
      this.setState({
        'offset': this.state.offset + 0.07
      });
      this.timing = requestAnimationFrame(this.moveTheImageByDelta);
    }
  },

  render() {
    return (
      <Image source={loginImage} style={[styles.loginScreen, {
        transform: [{
          translateX: -this.state.offset
        }]
      }]}>
        <View style={[styles.content, {
          transform: [{
          translateX: this.state.offset
        }]
        }]}>
          <View style={styles.appNameContainer}>
            <Text style={styles.appName}>Tweetify</Text>
          </View>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'transparent'}
            onPress={this.props.openWebView}
          >
            <View style={styles.buttonView}>
              <Text style={styles.loginText}>Sign in with </Text><Text style={styles.loginTextBold}>Twitter</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Image>
    );
  }
});

const styles = StyleSheet.create({
  loginScreen: {
    width,
    height,
    flex: 1,
    resizeMode: 'stretch'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  appNameContainer: {
    flex: 1,
    marginTop: 120
  },
  appName: {
    color: '#FDFDF8',
    fontWeight: '500',
    fontSize: 48,
    backgroundColor: 'transparent'
  },
  buttonView: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEFF0',
    width: 300,
    borderRadius: 5,
    marginBottom: 70
  },
  loginText: {
    color: '#3F97E6',
    fontWeight: '400',
    fontSize: 20
  },
  loginTextBold: {
    color: '#3F97E6',
    fontWeight: '700',
    fontSize: 20
  }
});

export default LoginScreen;
