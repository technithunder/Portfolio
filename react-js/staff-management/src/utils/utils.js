import CryptoJS from 'crypto-js';

export const encryptText = (text) => {
  const key = '55a51621a6648525';
  const keyutf = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Base64.parse(key);
  const enc = CryptoJS.AES.encrypt(text, keyutf, { iv: iv });
  const encStr = enc.toString();
  return encStr;
};

export const convertToNormalNumber = (number, type) => {
  const normalizedNumber = number.replace(/\D/g, '');
  if (type === 'duns') {
    const formatted = normalizedNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      '$1-$2-$3'
    );
    return formatted;
  }
  return normalizedNumber;
};
