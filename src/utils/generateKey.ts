import sha256 from 'crypto-js/sha256';

export const generateKey = (): string => {
  const currentTime = new Date().getTime().toString();

  const hash = sha256(currentTime);

  return hash.toString();
};
