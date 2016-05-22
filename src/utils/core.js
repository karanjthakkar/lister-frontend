import moment from 'moment';
import twitterText from 'twitter-text';

export const timeAgo = (time) => {
  return moment(time, 'ddd MMM DD HH:mm:ss ZZ GGGG').fromNow(true);
};

export const autoLink = (text, urlEntities, mediaEntities) => {
  mediaEntities.forEach((entity) => {
    if (entity.type === 'photo') {
      text = text.replace(entity.url, '');
    }
  });
  return twitterText.autoLink(text, {
    'usernameIncludeSymbol': true,
    'targetBlank': true,
    'urlClass': 'bio__link',
    'cashtagClass': 'bio__link',
    'usernameClass': 'bio__link',
    'hashtagClass': 'bio__link',
    'urlEntities': urlEntities
  });
};