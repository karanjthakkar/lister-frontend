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
import GoogleAnalytics from 'react-native-google-analytics-bridge';

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
      'renderPlaceholderOnly': true,
      'styles': this.props.theme === 'LIGHT' ? lightStyles : darkStyles
    };
  },

  componentWillMount() {

    GoogleAnalytics.trackScreenView('List Timeline');

    this.isMounted = true;
    this.listMountTime = Date.now();

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
    const listId = this.props.data.get('list_id');
    clearTweetListCache(listId, () => {
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
    const isLoggedOut = props.TweetList.getIn(['data', listId, 'isLoggedOut']);
    if (isLoggedOut) {
      return this.props.doLogout();
    }
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      isLoading,
      isNextPageLoading
    });
  },

  userAction(action, tweetId) {
    GoogleAnalytics.trackEvent('List Timeline', action);
    const { userId, cookie } = this.props;
    const listId = this.props.data.get('list_id');
    this.props.actions.tweetAction({
      type: action,
      userId: userId,
      tweetId,
      cookie,
      listId
    });
  },

  renderTweetItem(tweet) {
    return (
      <TweetItem
        tweet={tweet}
        mediaWidth={this.state.mediaWidth}
        userAction={this.userAction}
        listMountTime={this.listMountTime}
        theme={this.props.theme}
      />
    );
  },

  renderNextPageLoading() {
    const listId = this.props.data.get('list_id');
    const nextPageId = this.props.TweetList.getIn(['data', listId, 'nextPageId']);
    if (nextPageId) {
      return (
        <View style={this.state.styles.nextPageLoading}>
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
      GoogleAnalytics.trackEvent('List Timeline', 'Next Page');
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
        <View style={this.state.styles.loading}>
          <ActivityIndicatorIOS
            animating={true}
            size="small"
          />
        </View>
      );
    } else {
      return (
        <View style={this.state.styles.listView}>
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

const lightStyles = StyleSheet.create({
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

const darkStyles = StyleSheet.create({
  listView: {
    paddingTop: 64,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#192633'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192633'
  },
  nextPageLoading: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192633'
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
