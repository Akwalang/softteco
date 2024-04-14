export const toAlias = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/([\s\t]+)/g, '-')
    .replace(/([!@#$%^&*()\/\\]+)/g, '');
};
