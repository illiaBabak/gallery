import { ImageType, ImageUrl, ImageUser } from 'src/types/types';

const isObj = (data: unknown): data is object => !!data && typeof data === 'object';

const isString = (data: unknown): data is string => typeof data === 'string';

const isNumber = (data: unknown): data is number => typeof data === 'number';

const isImageUser = (data: unknown): data is ImageUser => {
  return (
    isObj(data) &&
    'username' in data &&
    'profile_image' in data &&
    isString(data.username) &&
    isObj(data.profile_image) &&
    'medium' in data.profile_image &&
    isString(data.profile_image.medium)
  );
};

const isImageUrl = (data: unknown): data is ImageUrl => {
  return isObj(data) && 'regular' in data && isString(data.regular);
};

export const isImage = (data: unknown): data is ImageType => {
  return (
    isObj(data) &&
    'alt_description' in data &&
    'created_at' in data &&
    'likes' in data &&
    'urls' in data &&
    'user' in data &&
    isString(data.alt_description) &&
    isString(data.created_at) &&
    isNumber(data.likes) &&
    isImageUrl(data.urls) &&
    isImageUser(data.user)
  );
};

export const isImageArr = (data: unknown): data is ImageType[] => {
  return Array.isArray(data) && data.every((el) => isImage(el));
};
