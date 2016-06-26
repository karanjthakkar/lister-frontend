import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  InteractionManager,
  RefreshControl,
  SegmentedControlIOS
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import actions from '../actions';
import ListItem from './ListItem';
import { clearUserAllListCache } from '../utils/core';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const UserListView = React.createClass({
  getInitialState() {
    return {
      'data': ds.cloneWithRows([]),
      'isLoadingLists': true,
      'isRefreshingLists': false,
      'renderPlaceholderOnly': true,
      'styles': this.props.theme === 'LIGHT' ? lightStyles : darkStyles
    };
  },

  componentWillMount() {

    GoogleAnalytics.trackScreenView('User Lists');

    this.isMounted = true;
    this.props.actions.fetchUserAllLists({
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
    let data = props.UserAllList.get('records');

    if (this.props.viewType === 'Favorites') {
      data = data.filter((item) => {
        return item.get('is_favorited');
      });
    }

    const isLoadingLists = props.UserAllList.get('isFetching');

    const isRefreshingLists = props.UserAllList.get('isRefreshing');

    const isLoggedOut = props.UserAllList.get('isLoggedOut');

    if (isLoggedOut) {
      return this.props.doLogout();
    }
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      'isLoadingLists': isLoadingLists,
      'isRefreshingLists': isRefreshingLists,
    });
  },

  openListView(listItem) {
    GoogleAnalytics.trackEvent('Click', 'Show List Timeline');
    this.props.navigator.push({
      'name': 'TweetListView',
      listItem
    });
  },

  unfavoriteList(list) {
    this.props.actions.unfavoriteList({
      list,
      'userId': this.props.userId,
      'cookie': this.props.cookie
    });
  },

  favoriteList(list) {
    this.props.actions.favoriteList({
      list,
      'userId': this.props.userId,
      'cookie': this.props.cookie
    });
  },

  renderListsRefreshControl() {
    return (
      <RefreshControl
        style={this.state.styles.refreshControl}
        refreshing={this.state.isRefreshingLists}
        onRefresh={this.onUserListRefresh}
        title="Updating your lists..."
        titleColor="#8899A6"
      />
    );
  },

  renderListItem(listItem) {
    return (
      <ListItem data={listItem}
        openListView={this.openListView}
        theme={this.props.theme}
        unfavoriteList={this.unfavoriteList}
        favoriteList={this.favoriteList}
        listType={this.props.viewType}
      />
    );
  },

  onUserListRefresh() {
    GoogleAnalytics.trackEvent('Refresh', 'Refresh User Lists');

    this.setState({
      'isRefreshing': true
    });

    clearUserAllListCache(() => {
      this.props.actions.fetchUserAllLists({
        'userId': this.props.userId,
        'cookie': this.props.cookie,
        'noCache': true
      });
    });
  },

  render() {
    if (this.state.isLoadingLists
        || this.state.renderPlaceholderOnly) {
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
          {(() => {
            if (this.state.data.getRowCount() > 0) {
              return (
                <ListView
                  dataSource={this.state.data}
                  refreshControl={this.renderListsRefreshControl()}
                  renderRow={this.renderListItem}
                  enableEmptySections={true}
                  initialListSize={5}
                />
              );
            } else {
              return (
                <View style={this.state.styles.emptySection}>
                  {(() => {
                    if (this.props.viewType === 'AllLists') {
                      return (
                        <Text style={this.state.styles.emptyText}>
                          You don't have any lists :(
                        </Text>
                      );
                    } else {
                      return (
                        <Text style={this.state.styles.emptyText}>
                          You don't have any favorite lists. Swipe left and star any list to make it your favorite.
                        </Text>
                      );
                    }
                  })()}
                </View>
              );
            }
          })()}
        </View>
      );
    }
  },
});

const darkStyles = StyleSheet.create({
  emptySection: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20,
    backgroundColor: '#192633'
  },
  emptyText: {
    paddingLeft: 40,
    paddingRight: 40,
    textAlign: 'center',
    color: '#E8EAEB'
  },
  listView: {
    paddingTop: 64,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#192633'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192633'
  },
  refreshControl: {
    backgroundColor: '#192633'
  }
});

const lightStyles = StyleSheet.create({
  emptySection: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20,
  },
  emptyText: {
    paddingLeft: 40,
    paddingRight: 40,
    textAlign: 'center'
  },
  listView: {
    paddingTop: 64,
    flexDirection: 'column',
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
  }
});

function mapStateToProps(state) {
  return {
    'UserAllList': state.UserAllList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
