import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import ListItem from './ListItem';

const ds = new ListView.DataSource({
  rowHasChanged(r1, r2) {
    return !Immutable.is(r1, r2);
  }
});

const UserListView = React.createClass({
  getInitialState() {
    return {
      'isLoading': true
    };
  },

  componentWillMount() {
    this.props.actions.fetchUserLists({
      'userId': this.props.userId
    });
    this.setupListData(this.props);  
  },

  componentWillReceiveProps(nextProps) {
    this.setupListData(nextProps);
  },

  setupListData(props) {
    const data = props.UserList.get('records');
    const isLoading = props.UserList.get('isFetching');
    this.setState({
      'data': ds.cloneWithRows(data.toArray()),
      isLoading
    });
  },

  openListView(listItem) {
    this.props.navigator.push({
      'name': 'TweetListView',
      listItem
    });
  },

  renderListItem(listItem) {
    return (
      <ListItem data={listItem} 
        openListView={this.openListView}
      />
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
            renderRow={this.renderListItem}
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
    flex: 1
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
