import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';

// import loginImage from '../images/login_bg.jpg';
import twitterLogo from '../images/twitterLogo.png';
import appLogo from '../images/logo.png';

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;
// const INITIAL_OFFSET = 190;

const LoginScreen = React.createClass({
  // getInitialState() {
  //   return {
  //     'offset': INITIAL_OFFSET
  //   };
  // },

  componentDidMount() {
    this.isMounted = true;
    // this.reverse = true;
    // this.moveTheImageByDelta();
  },

  componentWillUnmount() {
    this.isMounted = false;
    // cancelAnimationFrame(this.timing);
  },

  // moveTheImageByDelta() {
  //   if (this.isMounted) {
  //     if (this.state.offset > ((0.5 * width) + INITIAL_OFFSET)) {
  //       this.reverse = false
  //     } else if (this.state.offset < INITIAL_OFFSET) {
  //       this.reverse = true;
  //     }
  //     this.setState({
  //       'offset': this.state.offset + (this.reverse ? 0.03 : -0.03)
  //     });
  //     this.timing = requestAnimationFrame(this.moveTheImageByDelta);
  //   }
  // },

  render() {
    return (
      // <Image source={loginImage} style={[styles.loginScreen, {
      //   transform: [{
      //     translateX: -this.state.offset
      //   }]
      // }]}>
        <View style={styles.content}>
          <View style={styles.appNameContainer}>
            <Image
              source={appLogo}
              style={styles.appLogo}
            />
            <Text style={styles.appName}>Tweetify</Text>
            <Text style={styles.appTagline}>
              twitter lists made fun
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.props.openWebView}
          >
            <View style={styles.buttonView}>
              <Image
                source={twitterLogo}
                style={styles.twitterLogo}
              />
              <Text style={styles.loginText}>Sign in with Twitter</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            We will never post anything without your permission
          </Text>
        </View>
      // </Image>
    );
  }
});

const styles = StyleSheet.create({
  loginScreen: {
    // width: height * 1.5,
    // height,
    flex: 1,
    resizeMode: 'stretch'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // width,
    // backgroundColor: 'rgba(11, 9, 7, 0.6)'
  },
  appNameContainer: {
    flex: 1,
    marginTop: 90,
    alignItems: 'center'
  },
  appLogo: {
    width: 40,
    height: 40,
    borderRadius: 6.5,
    marginBottom: 10
  },
  appName: {
    color: '#000',
    fontWeight: '500',
    fontSize: 36,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  appTagline: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    opacity: 0.6,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  buttonView: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#55ACEE',
    width: 280,
    borderRadius: 5,
    marginBottom: 7
  },
  loginText: {
    color: '#FDFDF8',
    fontWeight: '500',
    fontSize: 20,
    marginLeft: 11
  },
  twitterLogo: {
    width: 40,
    height: 40,
    margin: 10,
    tintColor: '#FDFDF8'
  },
  disclaimer: {
    marginBottom: 33,
    fontSize: 10,
    opacity: 0.6,
    color: '#000',
    backgroundColor: 'transparent'
  }
});

export default LoginScreen;
