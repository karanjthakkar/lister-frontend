import { fromJS } from 'immutable';

const initialState = fromJS({
  'data': {
    '732629595027955712': {
      'records': [],
      'nextPageId': null,
      'isFetching': true,
      'isFetchingError': false,
      'isNextPageFetching': false,
      'isNextPageFetchingError': false
    }
  }
});

export default function(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_STATUS_FOR_LIST_INIT':
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': true,
        'isFetchingError': false
      }));

    case 'FETCH_STATUS_FOR_LIST_SUCCESS':
      // Destructuring assignment after variables have already been declared
      // needs the statement to be enclosed in a parentheses:
      // Source: http://stackoverflow.com/a/34836155
      const records = action.data.data;
      const nextPageId = action.data.next_max_id;
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': false,
        'isFetchingError': false,
        'records': records,
        nextPageId
      }));

    case 'FETCH_STATUS_FOR_LIST_ERROR':
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': false,
        'isFetchingError': true
      }));
  }

  return state;
}
