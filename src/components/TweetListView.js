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

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const TweetListView = React.createClass({
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
    InteractionManager.runAfterInteractions(() => {
      if (this.isMounted) {
        this.setState({
          renderPlaceholderOnly: false
        });
      }
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
    this.props.actions.doAction({
      type: action,
      userId: '3303637404',
      tweetId
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
    if(this.state.isNextPageLoading) {
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

  fetchNextPage() {
    this.setState({
      'isNextPageLoading': true
    });
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
            dataSource={this.state.data}
            renderRow={this.renderTweetItem}
            initialListSize={5}
            renderFooter={this.renderNextPageLoading}
            onEndReached={this.fetchNextPage}
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
