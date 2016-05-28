import api from '../api/core';
import store from 'react-native-simple-store';

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

    error(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_ERROR',
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

    error(params) {
      return {
        'type': 'FETCH_NEXT_STATUS_FOR_LIST_ERROR',
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

    error(params) {
      return {
        'type': 'FETCH_USER_LIST_ERROR',
        params
      };
    }
  },
  'doAction': {
    init(params) {
      return {
        'type': 'DO_ACTION_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'DO_ACTION_SUCCESS',
        data,
        params
      };
    },

    error(params) {
      return {
        'type': 'DO_ACTION_ERROR',
        params
      };
    }
  }
};


const Actions = {
  fetchStatusForList(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchStatusForList.init(params));
      // store.get(`TWEET_LIST_${params.listId}`)
      //   .then((value) => {
      //     if (value) {
      //       dispatch(Handlers.fetchStatusForList.success(value, params));
      //     } else {
            return api.fetchStatusForList(params.userId, params.listId, params.cookie)
              .then(checkStatus)
              .then(parseJSON)
              .then((json) => {
                store.save(`TWEET_LIST_${params.listId}`, json);
                dispatch(Handlers.fetchStatusForList.success(json, params));
              })
              .catch((error) => {
                const onComplete = function onComplete() {
                  dispatch(Handlers.fetchStatusForList.error(params));
                };

                if (error && error.response && error.response.json) {
                  error.response.json().then(onComplete);
                } else {
                  onComplete();
                }
              });
        //   }
        // });
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
            dispatch(Handlers.fetchNextPage.error(params));
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
      // store.get(`USER_LIST_${params.userId}`)
      //   .then((value) => {
      //     if (value) {
      //       dispatch(Handlers.fetchUserLists.success(value, params));
      //       return dispatch(Handlers.fetchStatusForList.build(value, params));
      //     } else {
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
                  dispatch(Handlers.fetchUserLists.error(params));
                };

                if (error && error.response && error.response.json) {
                  error.response.json().then(onComplete);
                } else {
                  onComplete();
                }
              });
        //   }
        // })
    };
  },
  doAction(params) {
    return (dispatch) => {
      dispatch(Handlers.doAction.init(params));
      return api.doAction(params)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          dispatch(Handlers.doAction.success(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete() {
            dispatch(Handlers.doAction.error(params));
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
