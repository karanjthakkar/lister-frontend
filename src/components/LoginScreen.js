import React from 'react'
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';

const LoginScreen = React.createClass({

  render() {
    return (
      <View style={{
        flex: 1
      }}>

        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            color: '#000',
            fontWeight: 'bold',
            fontSize: 40
          }}>Tweetify</Text>
        </View>
        <TouchableHighlight onPress={this.props.openWebView}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 150
          }}>
            <Text style={{
              color: '#929292',
              fontSize: 16
            }}>Lets get started</Text>
            <View style={{
              flexDirection: 'row',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1787FB',
              width: 200,
              borderRadius: 5,
              marginTop: 10
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 16
              }}>Login with </Text><Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16
              }}>Twitter</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});


export default LoginScreen;
