export default {
  fetchStatusForList(listId) {
    return fetch(`http://local.lister.co:3000/user/3303637404/list/${listId}/statuses`, {
      'credentials': 'include',
      'headers': {
        'cookie': 'connect.sid=s%3Azb0MbsWDJXh-TEh9GjPKuSvS9Z_j_zcJ.mtNiJL0xCquXZ8geBJoFs3nMszFviybdrnO%2BpXjxISs'
      }
    });
  }
};
