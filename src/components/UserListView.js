import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  InteractionManager,
  RefreshControl
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import ListItem from './ListItem';
import { clearUserListCache } from '../utils/core';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const UserListView = React.createClass({
  getInitialState() {
    return {
      'data': ds.cloneWithRows([]),
      'isLoading': true,
      'isRefreshing': false,
      'renderPlaceholderOnly': true
    };
  },

  componentWillMount() {
    this.isMounted = true;
    this.props.actions.fetchUserLists({
      'userId': this.props.userId,
      'cookie': this.props.cookie
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
    const data = props.UserList.get('records');
    const isLoading = props.UserList.get('isFetching');
    const isRefreshing = props.UserList.get('isRefreshing');
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      'isLoading': isLoading,
      'isRefreshing': isRefreshing
    });
  },

  openListView(listItem) {
    this.props.navigator.push({
      'name': 'TweetListView',
      listItem
    });
  },

  renderRefreshControl() {
    return (
      <RefreshControl
        style={styles.refreshControl}
        refreshing={this.state.isRefreshing}
        onRefresh={this.onUserListRefresh}
        title="Updating your lists..."
      />
    );
  },

  renderListItem(listItem) {
    return (
      <ListItem data={listItem}
        openListView={this.openListView}
      />
    );
  },

  onUserListRefresh() {
    clearUserListCache(() => {
      this.props.actions.fetchUserLists({
        'userId': this.props.userId,
        'cookie': this.props.cookie,
        'noCache': true
      });
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
            refreshControl={this.renderRefreshControl()}
            renderRow={this.renderListItem}
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
  refreshControl: {
    backgroundColor: '#F5F8FA'
  }
});

function mapStateToProps(state) {
  return {
    'UserList': state.UserList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
