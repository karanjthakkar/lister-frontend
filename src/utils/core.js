import { AsyncStorage } from 'react-native';
import moment from 'moment';
import numeral from 'numeral';
import twitterText from 'twitter-text';

export const humanize = (number) => {
  if (number < 0) {
    return '0';
  }
  return numeral(number).format('0[.]0a');
}

export const timeAgo = (time) => {
  return moment(time, 'ddd MMM DD HH:mm:ss ZZ GGGG').fromNow(true);
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

export const clearTweetListCache = (callback) => {
  AsyncStorage.getAllKeys((err, keys) => {
    keys = keys.filter((key) => {
      return key.indexOf('TWEET_LIST') > -1;
    });
    AsyncStorage.multiRemove(keys, () => {
      callback();
    });
  });
};

function buildTextForEntity(type, text, replaceText, originalText) {
  let urlMarkup = '';
  if (type === 'url') {
    urlMarkup = `<a href="${originalText}" rel="nofollow">${replaceText}</a>`;
    return text.replace(originalText, urlMarkup);
  } else if (type === 'hashtag') {
    urlMarkup = `<a href="https://twitter.com/${replaceText}" rel="nofollow">#${replaceText}</a>`;
    return text.replace(`#${replaceText}`, urlMarkup);
  } else if (type === 'screenName') {
    urlMarkup = `<a href="https://twitter.com/${replaceText}" rel="nofollow">@${replaceText}</a>`;
    return text.replace(`@${replaceText}`, urlMarkup);
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
