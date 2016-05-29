import { fromJS } from 'immutable';

const initialState = fromJS({
  'data': {}
});

export default function(state = initialState, action) {
  let records, nextPageId;
  switch(action.type) {
    case 'FETCH_STATUS_FOR_LIST_BUILD_SCHEMA':
      const data = {};
      action.data.data.forEach((item) => {
        data[item.list_id] = {
          'records': [],
          'nextPageId': null,
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
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isFetching': false,
        'isFetchingError': true
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
      return state.mergeIn(['data', action.params.listId], fromJS({
        'isNextPageFetching': false,
        'isNextPageFetchingError': true
      }));
      break;

  }

  return state;
}
