import React from 'react';
import {
  ListView,
  Dimensions,
  Text,
  View,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import TweetItem from './TweetItem';

import { clearTweetListCache } from '../utils/core';

const Subscribable = require('Subscribable');

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const END_THRESHOLD = 100;

const TweetListView = React.createClass({

  mixins: [Subscribable.Mixin],

  getInitialState() {
    return {
      'mediaWidth': Dimensions.get('window').width - 64,
      'isLoading': true,
      'renderPlaceholderOnly': true
    };
  },

  componentWillMount() {

    this.isMounted = true;

    const listId = this.props.data.get('list_id');
    const { userId, cookie } = this.props;
    this.props.actions.fetchStatusForList({
      listId,
      userId,
      cookie
    });
    this.setupListData(this.props);
  },

  componentWillUnmount() {
    this.isMounted = false;
  },

  componentDidMount() {
    this.addListenerOn(this.props.routeEvents, 'reloadTweetListView', this.onTweetListRefresh);
    InteractionManager.runAfterInteractions(() => {
      if (this.isMounted) {
        this.setState({
          renderPlaceholderOnly: false
        });
      }
    });
  },

  onTweetListRefresh() {
    clearTweetListCache(() => {
      const listId = this.props.data.get('list_id');
      const { userId, cookie } = this.props;
      this.props.actions.fetchStatusForList({
        listId,
        userId,
        cookie,
        'noCache': true
      });
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setupListData(nextProps);
  },

  setupListData(props) {
    const listId = this.props.data.get('list_id');
    const data = props.TweetList.getIn(['data', listId, 'records']);
    const isLoading = props.TweetList.getIn(['data', listId, 'isFetching']);
    const isNextPageLoading = props.TweetList.getIn(['data', listId, 'isNextPageFetching']);
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      isLoading,
      isNextPageLoading
    });
  },

  userAction(action, tweetId) {
    const { userId, cookie } = this.props;
    this.props.actions.doAction({
      type: action,
      userId: userId,
      tweetId,
      cookie
    });
  },

  renderTweetItem(tweet) {
    return (
      <TweetItem
        tweet={tweet}
        mediaWidth={this.state.mediaWidth}
        userAction={this.userAction}
      />
    );
  },

  renderNextPageLoading() {
    const listId = this.props.data.get('list_id');
    const nextPageId = this.props.TweetList.getIn(['data', listId, 'nextPageId']);
    if (nextPageId) {
      return (
        <View style={styles.nextPageLoading}>
          <ActivityIndicatorIOS
            animating={true}
            size="small"
          />
        </View>
      );
    }
  },

  onScroll() {
    const contentLength = this.refs.listview.scrollProperties.contentLength;
    const visibleLength = this.refs.listview.scrollProperties.visibleLength;
    const offset = this.refs.listview.scrollProperties.offset;
    const listId = this.props.data.get('list_id');
    const nextPageId = this.props.TweetList.getIn(['data', listId, 'nextPageId']);
    const { userId, cookie } = this.props;
    if (contentLength - (visibleLength + offset) < END_THRESHOLD
        && nextPageId
        && !this.state.isNextPageLoading) {
      this.props.actions.fetchNextPage({
        listId,
        userId,
        cookie,
        nextPageId
      });
    }
  },

  render() {
    if (this.state.isLoading || this.state.renderPlaceholderOnly) {
      return (
        <View style={styles.loading}>
          <ActivityIndicatorIOS
            animating={true}
            size="small"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.listView}>
          <ListView
            ref="listview"
            dataSource={this.state.data}
            renderRow={this.renderTweetItem}
            initialListSize={5}
            renderFooter={this.renderNextPageLoading}
            onScroll={this.onScroll}
            scrollEventThrottle={1}
            enableEmptySections={true}
          />
        </View>
      );
    }
  },
});

const styles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  nextPageLoading: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
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
