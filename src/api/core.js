export default {
  fetchStatusForList(userId, listId, cookie) {
    return fetch(`http://192.168.0.101:3000/user/${userId}/list/${listId}/statuses`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  fetchUserLists(userId, cookie) {
    return fetch(`http://192.168.0.101:3000/user/${userId}/lists`, {
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  },
  doAction(params) {
    const type = params.type;
    if (['retweet', 'discard', 'favorite'].indexOf(type) > -1) {
      return this.takeActionOnTweet(type, params.userId, params.tweetId);
    }
  },
  takeActionOnTweet(type, userId, tweetId, cookie) {
    return fetch(`http://192.168.0.101:3000/user/${userId}/tweet_action/${type}/${tweetId}`, {
      'method': 'POST',
      'credentials': 'include',
      'headers': {
        'cookie': cookie
      }
    });
  }
};
