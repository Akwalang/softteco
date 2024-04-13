export const trim = (str: string): string => {
  return str.trim().replace(/([\s\t]{2,}|\t)/g, ' ');
};
