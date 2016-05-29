import { fromJS } from 'immutable';

const initialState = fromJS({
  'data': {}
});

export default function(state = initialState, action) {
  let records, nextPageId, isLoggedOut;
  switch(action.type) {
    case 'FETCH_STATUS_FOR_LIST_BUILD_SCHEMA':
      const data = {};
      action.data.data.forEach((item) => {
        data[item.list_id] = {
          'records': [],
          'nextPageId': null,
          'isLoggedOut': false,
          'isFetching': true,
          'isFetchingError': false,
          'isNextPageFetching': false,
          'isNextPageFetchingError': false
        };
      });
      return state.mergeIn(['data'], data);

    case 'FETCH_STATUS_FOR_LIST_INIT':
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': true,
        'isFetchingError': false
      }));

    case 'FETCH_STATUS_FOR_LIST_SUCCESS':
      // Destructuring assignment after variables have already been declared
      // needs the statement to be enclosed in a parentheses:
      // Source: http://stackoverflow.com/a/34836155
      records = action.data.data;
      nextPageId = action.data.next_max_id;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': false,
        'isFetchingError': false,
        'records': records,
        nextPageId
      }));

    case 'FETCH_STATUS_FOR_LIST_ERROR':
      isLoggedOut = action.response && action.response.code === 1;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': false,
        'isFetchingError': true,
        isLoggedOut
      }));

    case 'FETCH_NEXT_STATUS_FOR_LIST_INIT':
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isNextPageFetching': true,
        'isNextPageFetchingError': false
      }));
      break;

    case 'FETCH_NEXT_STATUS_FOR_LIST_SUCCESS':
      records = action.data.data;
      nextPageId = action.data.next_max_id;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isNextPageFetching': false,
        'isNextPageFetchingError': false,
        'records': state.getIn(['data', action.params.listId, 'records']).concat(fromJS(records)),
        nextPageId
      }));
      break;

    case 'FETCH_NEXT_STATUS_FOR_LIST_ERROR':
      isLoggedOut = action.response && action.response.code === 1;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isNextPageFetching': false,
        'isNextPageFetchingError': true,
        isLoggedOut
      }));
      break;

    case 'TWEET_ACTION_INIT':
      if (action.params.type === 'favorite') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'favorited': true,
              'favorite_count': tweet.get('favorite_count') + 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'unfavorite') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'favorited': false,
              'favorite_count': tweet.get('favorite_count') - 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'retweet') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'retweeted': true,
              'retweet_count': tweet.get('retweet_count') + 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'unretweet') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'retweeted': false,
              'retweet_count': tweet.get('retweet_count') - 1
            });
          }
          return tweet;
        });
      }

      return state.mergeIn(['data', action.params.listId], fromJS({
        'records': newRecords
      }));
      break;

    case 'TWEET_ACTION_SUCCESS':
      break;

    case 'TWEET_ACTION_ERROR':
      if (action.params.type === 'favorite') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'favorited': false,
              'favorite_count': tweet.get('favorite_count') - 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'unfavorite') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'favorited': true,
              'favorite_count': tweet.get('favorite_count') + 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'retweet') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'retweeted': false,
              'retweet_count': tweet.get('retweet_count') - 1
            });
          }
          return tweet;
        });
      } else if (action.params.type === 'unretweet') {
        newRecords = state.getIn(['data', action.params.listId, 'records']).map((tweet) => {
          if (tweet.get('tweet_id') === action.params.tweetId) {
            return tweet.merge({
              'retweeted': true,
              'retweet_count': tweet.get('retweet_count') + 1
            });
          }
          return tweet;
        });
      }

      isLoggedOut = action.response && action.response.code === 1;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'records': newRecords,
        isLoggedOut
      }));
      break;

  }

  return state;
}
