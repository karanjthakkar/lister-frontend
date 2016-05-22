export default {
  fetchStatusForList(listId) {
    return fetch(`http://local.lister.co:3000/user/3303637404/list/${listId}/statuses`, {
      'credentials': 'include',
      'headers': {
        'cookie': 'connect.sid=s%3Azb0MbsWDJXh-TEh9GjPKuSvS9Z_j_zcJ.mtNiJL0xCquXZ8geBJoFs3nMszFviybdrnO%2BpXjxISs'
      }
    });
  },
  doAction(params) {
    const type = params.type;
    if (['retweet', 'discard', 'favorite'].indexOf(type) > -1) {
      return this.takeActionOnTweet(type, params.userId, params.tweetId);
    }
  },
  takeActionOnTweet(type, userId, tweetId) {
    return fetch(`http://local.lister.co:3000/user/${userId}/tweet_action/${type}/${tweetId}`, {
      'method': 'POST',
      'credentials': 'include',
      'headers': {
        'cookie': 'connect.sid=s%3Azb0MbsWDJXh-TEh9GjPKuSvS9Z_j_zcJ.mtNiJL0xCquXZ8geBJoFs3nMszFviybdrnO%2BpXjxISs'
      }
    });
  }
};
