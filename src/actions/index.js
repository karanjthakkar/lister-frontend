import api from '../api/core';
import store from 'react-native-simple-store';

import { updateCacheWithActionForTweet } from '../utils/core';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const Handlers = {
  'fetchStatusForList': {
    build(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_BUILD_SCHEMA',
        data,
        params
      };
    },

    init(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_SUCCESS',
        data,
        params
      };
    },

    error(res, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_ERROR',
        'response': res,
        params
      };
    }
  },
  'fetchNextPage': {
    init(params) {
      return {
        'type': 'FETCH_NEXT_STATUS_FOR_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_NEXT_STATUS_FOR_LIST_SUCCESS',
        data,
        params
      };
    },

    error(res, params) {
      return {
        'type': 'FETCH_NEXT_STATUS_FOR_LIST_ERROR',
        'response': res,
        params
      };
    }
  },
  'fetchUserLists': {
    init(params) {
      return {
        'type': 'FETCH_USER_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_USER_LIST_SUCCESS',
        data,
        params
      };
    },

    error(res, params) {
      return {
        'type': 'FETCH_USER_LIST_ERROR',
        'response': res,
        params
      };
    }
  },
  'tweetAction': {
    init(params) {
      return {
        'type': 'TWEET_ACTION_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'TWEET_ACTION_SUCCESS',
        data,
        params
      };
    },

    error(res, params) {
      return {
        'type': 'TWEET_ACTION_ERROR',
        'response': res,
        params
      };
    }
  }
};

const fetchStatusForList = (params, dispatch, Handlers) => {
  return api.fetchStatusForList(params.userId, params.listId, params.cookie)
    .then(checkStatus)
    .then(parseJSON)
    .then((json) => {
      store.save(`TWEET_LIST_${params.listId}`, json);
      dispatch(Handlers.fetchStatusForList.success(json, params));
    })
    .catch((error) => {
      const onComplete = function onComplete(res) {
        dispatch(Handlers.fetchStatusForList.error(res, params));
      };

      if (error && error.response && error.response.json) {
        error.response.json().then(onComplete);
      } else {
        onComplete();
      }
    });
};

const fetchUserLists = (params, dispatch, Handlers) => {
  return api.fetchUserLists(params.userId, params.cookie)
    .then(checkStatus)
    .then(parseJSON)
    .then((json) => {
      store.save(`USER_LIST_${params.userId}`, json);
      dispatch(Handlers.fetchUserLists.success(json, params));
      dispatch(Handlers.fetchStatusForList.build(json, params));
    })
    .catch((error) => {
      const onComplete = function onComplete(res) {
        dispatch(Handlers.fetchUserLists.error(res, params));
      };

      if (error && error.response && error.response.json) {
        error.response.json().then(onComplete);
      } else {
        onComplete();
      }
    });
};

const Actions = {
  fetchStatusForList(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchStatusForList.init(params));
      if (params.noCache) {
        return fetchStatusForList(params, dispatch, Handlers);
      } else {
        store.get(`TWEET_LIST_${params.listId}`)
          .then((value) => {
            if (value) {
              dispatch(Handlers.fetchStatusForList.success(value, params));
            } else {
              return fetchStatusForList(params, dispatch, Handlers);
            }
          });
      }
    };
  },
  fetchNextPage(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchNextPage.init(params));
      return api.fetchNextPage(params.userId, params.listId, params.cookie, params.nextPageId)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          store.get(`TWEET_LIST_${params.listId}`)
            .then((oldJson) => {
              oldJson = oldJson || [];
              store.save(`TWEET_LIST_${params.listId}`, {
                'success': json.success,
                'data': oldJson.data.concat(json.data),
                'next_max_id': json.next_max_id
              });
            });
          dispatch(Handlers.fetchNextPage.success(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete(res) {
            dispatch(Handlers.fetchNextPage.error(res, params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  },
  fetchUserLists(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchUserLists.init(params));
      if (params.noCache) {
        return fetchUserLists(params, dispatch, Handlers);
      } else {
        store.get(`USER_LIST_${params.userId}`)
          .then((value) => {
            if (value) {
              dispatch(Handlers.fetchUserLists.success(value, params));
              return dispatch(Handlers.fetchStatusForList.build(value, params));
            } else {
              return fetchUserLists(params, dispatch, Handlers);
            }
          });
      }
    };
  },
  tweetAction(params) {
    return (dispatch) => {
      dispatch(Handlers.tweetAction.init(params));
      return api.tweetAction(params)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {

          // Update cache for that action
          updateCacheWithActionForTweet(params);

          dispatch(Handlers.tweetAction.success(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete(res) {
            dispatch(Handlers.tweetAction.error(res, params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  }
};

export default Actions;
