export const toAlias = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/([!:;"'{}\[\]<>?`~@#$%^&*()\/\\]+)/g, '')
    .replace(/([\s\t]+)/g, '-');
};
