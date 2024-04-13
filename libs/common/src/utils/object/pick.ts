export const pick = <T extends Record<any, any>, K extends keyof T>(
  src: T,
  keys: K[],
): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (Object.hasOwnProperty.call(src, key)) {
        result[key] = src[key];
      }

      return result;
    },
    {} as Pick<T, K>,
  );
};
