import { AsyncStorage } from 'react-native';
import store from 'react-native-simple-store';
import moment from 'moment';
import numeral from 'numeral';
import twitterText from 'twitter-text';

export const humanize = (number) => {
  if (number < 0) {
    return '0';
  }
  return numeral(number).format('0[.]0a');
}

export const timeAgo = (time, now = moment()) => {
  const then = moment(time, 'ddd MMM DD HH:mm:ss ZZ YYYY');
  const diffSeconds = moment(now).diff(then, 'seconds');
  const diffMinutes = moment(now).diff(then, 'minutes');
  const diffHours = moment(now).diff(then, 'hours');
  const diffDays = moment(now).diff(then, 'days');
  if (diffSeconds > 0 && diffSeconds < 60) { // 0 seconds to 59 seconds
    return `${diffSeconds === 0 ? 1 : diffSeconds}s`;
  } else if (diffMinutes > 0 && diffMinutes < 60) { // 1 minute to 59 minutes
    return `${diffMinutes}m`;
  } else if (diffHours > 0 && diffHours < 24) { // 1 hours to 23 hours
    return `${diffHours}h`;
  } else if (diffDays > 0 && diffDays < 7) { // 1 day to 7 days
    return `${diffDays}d`;
  } else {
    return then.format('DD/MM/YY');
  }
};

function findEntityForUrl(url, urlEntities) {
  let entity = {};
  urlEntities.forEach((innerEntity) => {
    if (innerEntity.url === url) {
      entity = innerEntity;
    }
  });
  return entity.display_url;
}

export const clearLocalCache = (callback) => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiRemove(keys, () => {
      callback();
    });
  });
};

export const clearUserListCache = (callback) => {
  AsyncStorage.getAllKeys((err, keys) => {
    keys = keys.filter((key) => {
      return key.indexOf('USER_LIST') > -1;
    });
    AsyncStorage.multiRemove(keys, () => {
      callback();
    });
  });
};

export const clearTweetListCache = (listId, callback) => {
  AsyncStorage.getAllKeys((err, keys) => {
    keys = keys.filter((key) => {
      return (
        (key.indexOf(`TWEET_LIST_${listId}`) > -1) ||
        (key.indexOf(`SCROLL_POSITION_${listId}`) > -1)
      );
    });
    AsyncStorage.multiRemove(keys, () => {
      callback();
    });
  });
};

function buildTextForEntity(type, text, replaceText, originalText, withoutMarkup) {
  let urlMarkup = '';
  if (type === 'url') {
    if (withoutMarkup) {
      urlMarkup = replaceText;
    } else {
      urlMarkup = `<a href="${originalText}" rel="nofollow">${replaceText}</a>`;
    }
    return text.replace(originalText, urlMarkup);
  } else if (type === 'hashtag') {
    if (withoutMarkup) {
      return text;
    } else {
      urlMarkup = `<a href="https://twitter.com/#!/search?q=%23${replaceText}" rel="nofollow">#${replaceText}</a>`;
      return text.replace(`#${replaceText}`, urlMarkup);
    }
  } else if (type === 'screenName') {
    if (withoutMarkup) {
      return text;
    } else {
      urlMarkup = `<a href="https://twitter.com/${replaceText}" rel="nofollow">@${replaceText}</a>`;
      return text.replace(`@${replaceText}`, urlMarkup);
    }

  }
  return text;
}

export const autoLink = (text, urlEntities, mediaEntities) => {
  mediaEntities.forEach((entity) => {
    if (entity.type === 'photo') {
      text = text.replace(entity.url, '');
    }
  });
  const actualEntities = twitterText.extractEntitiesWithIndices(text, {
    extractUrlsWithoutProtocol: false
  });
  for (let i = 0; i < actualEntities.length; i++) {
    const entity = actualEntities[i];
    if (entity.url) {
      text = buildTextForEntity('url', text, findEntityForUrl(entity.url, urlEntities), entity.url);
    } else if (entity.hashtag) {
      text = buildTextForEntity('hashtag', text, entity.hashtag);
    } else if (entity.screenName) {
      text = buildTextForEntity('screenName', text, entity.screenName);
    }
  }
  return `<p>${text}</p>`;
};

export const autoLinkWithoutMarkup = (text, urlEntities, mediaEntities) => {
  mediaEntities.forEach((entity) => {
    if (entity.type === 'photo') {
      text = text.replace(entity.url, '');
    }
  });
  const actualEntities = twitterText.extractEntitiesWithIndices(text, {
    extractUrlsWithoutProtocol: false
  });
  for (let i = 0; i < actualEntities.length; i++) {
    const entity = actualEntities[i];
    if (entity.url) {
      text = buildTextForEntity('url', text, findEntityForUrl(entity.url, urlEntities), entity.url, true);
    } else if (entity.hashtag) {
      text = buildTextForEntity('hashtag', text, entity.hashtag, undefined, true);
    } else if (entity.screenName) {
      text = buildTextForEntity('screenName', text, entity.screenName, undefined, true);
    }
  }
  return text;
};

export const stripText = (text) => {
  return text.substring(0, 30) + '…';
};

export const updateCacheWithActionForTweet = (params) => {
  store.get(`TWEET_LIST_${params.listId}`)
    .then((tweetList) => {
      tweetList.data = tweetList.data.map((tweet) => {
        if (params.tweetId === tweet.tweet_id) {
          let changedKeys = {};
          if (params.type === 'retweet') {
            changedKeys = {
              retweeted: true,
              retweet_count: tweet.retweet_count + 1
            };
          } else if (params.type === 'unretweet') {
            changedKeys = {
              retweeted: false,
              retweet_count: tweet.retweet_count - 1
            };
          } else if (params.type === 'favorite') {
            changedKeys = {
              favorited: true,
              favorite_count: tweet.favorite_count + 1
            };
          } else if (params.type === 'unfavorite') {
            changedKeys = {
              favorited: false,
              favorite_count: tweet.favorite_count - 1
            };
          }
          return Object.assign(tweet, changedKeys);
        } else {
          return tweet;
        }
      });
      store.save(`TWEET_LIST_${params.listId}`, tweetList);
    });
};
