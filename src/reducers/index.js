import { combineReducers } from 'redux';
import TweetList from './TweetList';
import UserList from './UserList';

const rootReducer = combineReducers({
  TweetList,
  UserList
});

export default rootReducer;