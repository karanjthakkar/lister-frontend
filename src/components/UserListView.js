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
import { clearUserAllListCache, clearUserFavoriteListCache } from '../utils/core';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const UserListView = React.createClass({
  getInitialState() {
    return {
      'allLists': ds.cloneWithRows([]),
      'favoriteLists': ds.cloneWithRows([]),
      'isLoadingAllLists': true,
      'isLoadingFavoriteLists': true,
      'isRefreshingAllLists': false,
      'isRefreshingFavoriteLists': false,
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
    this.props.actions.fetchUserFavoriteLists({
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
    const allLists = props.UserAllList.get('records');
    const favoriteLists = props.UserFavoriteList.get('records');

    const isLoadingAllLists = props.UserAllList.get('isFetching');
    const isLoadingFavoriteLists = props.UserFavoriteList.get('isFetching');

    const isRefreshingAllLists = props.UserAllList.get('isRefreshing');
    const isRefreshingFavoriteLists = props.UserFavoriteList.get('isRefreshing');

    const isLoggedOut = props.UserAllList.get('isLoggedOut') || props.UserFavoriteList.get('isLoggedOut');

    if (isLoggedOut) {
      return this.props.doLogout();
    }
    this.setState({
      'allLists': ds.cloneWithRows(allLists.toArray()),
      'favoriteLists': ds.cloneWithRows(favoriteLists.toArray()),
      'isLoadingAllLists': isLoadingAllLists,
      'isLoadingFavoriteLists': isLoadingFavoriteLists,
      'isRefreshingAllLists': isRefreshingAllLists,
      'isRefreshingFavoriteLists': isRefreshingFavoriteLists
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

  renderAllListsRefreshControl() {
    return (
      <RefreshControl
        style={this.state.styles.refreshControl}
        refreshing={this.state.isRefreshingAllLists}
        onRefresh={this.onUserAllListRefresh}
        title="Updating your lists..."
        titleColor="#8899A6"
      />
    );
  },

  renderFavoriteListsRefreshControl() {
    return (
      <RefreshControl
        style={this.state.styles.refreshControl}
        refreshing={this.state.isRefreshingFavoriteLists}
        onRefresh={this.onUserFavoriteListRefresh}
        title="Updating your lists..."
        titleColor="#8899A6"
      />
    );
  },

  renderFavoriteListItem(listItem) {
    return (
      <ListItem data={listItem}
        openListView={this.openListView}
        theme={this.props.theme}
        unfavoriteList={this.unfavoriteList}
        favoriteList={this.favoriteList}
      />
    );
  },

  renderAllListItem(listItem) {
    return (
      <ListItem data={listItem}
        openListView={this.openListView}
        theme={this.props.theme}
        unfavoriteList={this.unfavoriteList}
        favoriteList={this.favoriteList}
      />
    );
  },

  onUserAllListRefresh() {
    GoogleAnalytics.trackEvent('Refresh', 'Refresh User All Lists');

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

  onUserFavoriteListRefresh() {
    GoogleAnalytics.trackEvent('Refresh', 'Refresh User Favorite Lists');

    this.setState({
      'isRefreshing': true
    });

    clearUserFavoriteListCache(() => {
      this.props.actions.fetchUserFavoriteLists({
        'userId': this.props.userId,
        'cookie': this.props.cookie,
        'noCache': true
      });
    });
  },

  render() {
    if (this.state.isLoadingAllLists
        || this.state.isLoadingFavoriteLists
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
            if (this.props.viewType === 'AllLists') {
              if (this.state.allLists.getRowCount() > 0) {
                return (
                  <ListView
                    dataSource={this.state.allLists}
                    refreshControl={this.renderAllListsRefreshControl()}
                    renderRow={this.renderAllListItem}
                    enableEmptySections={true}
                  />
                );
              } else {
                return (
                  <View style={this.state.styles.emptySection}>
                    <Text style={this.state.styles.emptyText}>
                      You don't have any lists :(
                    </Text>
                  </View>
                );
              }
            } else {
              if (this.state.favoriteLists.getRowCount() > 0) {
                return (
                  <ListView
                    dataSource={this.state.favoriteLists}
                    refreshControl={this.renderFavoriteListsRefreshControl()}
                    renderRow={this.renderFavoriteListItem}
                    enableEmptySections={true}
                  />
                );
              } else {
                return (
                  <View style={this.state.styles.emptySection}>
                    <Text style={this.state.styles.emptyText}>
                      You don't have any favorite lists. Click the heart icon to make it your favorite.
                    </Text>
                  </View>
                );
              }
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
    'UserAllList': state.UserAllList,
    'UserFavoriteList': state.UserFavoriteList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
