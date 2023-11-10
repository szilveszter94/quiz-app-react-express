import utf8 from "utf8";

export const decodeHTML = (encodedString) => {
  const decoded = utf8.decode(encodedString);
  return decoded;
};