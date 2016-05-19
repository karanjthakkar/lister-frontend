import moment from 'moment';

export const timeAgo = (time) => {
  return moment(time).fromNow(true);
};