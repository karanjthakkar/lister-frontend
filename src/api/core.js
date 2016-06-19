export default {
  fetchStatusForList(userId, listId, cookie) {
    return fetch(`https://api.tweetify.io/user/${userId}/list/${listId}/statuses`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  fetchNextPage(userId, listId, cookie, nextPageId) {
    return fetch(`https://api.tweetify.io/user/${userId}/list/${listId}/statuses?max_id=${nextPageId}`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  fetchUserAllLists(userId, cookie) {
    return fetch(`https://api.tweetify.io/user/${userId}/lists/all`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  fetchUserFavoriteLists(userId, cookie) {
    return fetch(`https://api.tweetify.io/user/${userId}/lists/favorites`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  tweetAction(params) {
    const { type, userId, tweetId, cookie } = params;
    return fetch(`https://api.tweetify.io/user/${userId}/tweet_action/${type}/${tweetId}`, {
      'method': 'POST',
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  favoriteList(params) {
    const { userId, list, cookie } = params;
    return fetch(`https://api.tweetify.io/user/${userId}/lists/${list.list_id}/favorite`, {
      'method': 'PUT',
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  unfavoriteList(params) {
    const { userId, list, cookie } = params;
    return fetch(`https://api.tweetify.io/user/${userId}/lists/${list.list_id}/favorite`, {
      'method': 'DELETE',
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  doLogout(params) {
    const { cookie } = params;
    return fetch(`https://api.tweetify.io/logout`, {
      'method': 'POST',
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  }
};
