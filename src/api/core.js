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
  fetchUserLists(userId, cookie) {
    return fetch(`https://api.tweetify.io/user/${userId}/lists`, {
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
  }
};
