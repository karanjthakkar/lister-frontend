import React from 'react';
import {
  ListView,
  Dimensions,
  Text,
  View,
  StyleSheet
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import TweetItem from './TweetItem';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const TweetListView = React.createClass({
  getInitialState() {
    return {
      'mediaWidth': Dimensions.get('window').width - 64,
      'isLoading': true
    };
  },

  componentWillMount() {
    this.props.actions.fetchStatusForList({
      'listId': '732629595027955712'
    });
    this.setupListData(this.props);  
  },

  componentWillReceiveProps(nextProps) {
    this.setupListData(nextProps);
  },

  setupListData(props) {
    const data = props.TweetList.getIn(['data', '732629595027955712', 'records']);
    const isLoading = props.TweetList.getIn(['data', '732629595027955712', 'isFetching']);
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      isLoading
    });
  },

  renderTweetItem(tweet) {
    return (
      <TweetItem tweet={tweet} mediaWidth={this.state.mediaWidth}/>
    );
  },

  render() {
    if (this.state.isLoading) {
      return <Text>Loading...</Text>
    } else {
      return (
        <View style={styles.listView}>
          <ListView
            dataSource={this.state.data}
            renderRow={this.renderTweetItem}
          />
        </View>
      );
    }
  },
});

const styles = StyleSheet.create({
  listView: {
    paddingTop: 30,
    flexDirection: 'row',
    flex: 1
  }
});

function mapStateToProps(state) {
  return {
    'TweetList': state.TweetList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TweetListView);