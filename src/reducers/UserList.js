import { fromJS } from 'immutable';

const initialState = fromJS({
  'records': [],
  'nextPageId': null,
  'isRefreshing': false,
  'isFetching': true,
  'isFetchingError': false,
  'isNextPageFetching': false,
  'isNextPageFetchingError': false
});

export default function(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_USER_LIST_INIT':
      const isRefreshing = action.params.noCache ? true : false;
      const isFetching = action.params.noCache ? false : true;
      return state.merge({
        'isFetchingError': false,
        isFetching,
        isRefreshing
      });

    case 'FETCH_USER_LIST_SUCCESS':
      // Destructuring assignment after variables have already been declared
      // needs the statement to be enclosed in a parentheses:
      // Source: http://stackoverflow.com/a/34836155
      const records = action.data.data;
      const nextPageId = action.data.next_max_id;
      return state.merge({
        'isRefreshing': false,
        'isFetching': false,
        'isFetchingError': false,
        'records': records,
        nextPageId
      });

    case 'FETCH_USER_LIST_ERROR':
      const isLoggedOut = action.response && action.response.code === 1;
      return state.merge({
        'isRefreshing': false,
        'isFetching': false,
        'isFetchingError': true,
        isLoggedOut
      });
  }

  return state;
}
