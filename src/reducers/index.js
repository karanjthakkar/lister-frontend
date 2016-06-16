import { combineReducers } from 'redux';
import TweetList from './TweetList';
import UserAllList from './UserAllList';
import UserFavoriteList from './UserFavoriteList';

const rootReducer = combineReducers({
  TweetList,
  UserAllList,
  UserFavoriteList
});

export default rootReducer;
