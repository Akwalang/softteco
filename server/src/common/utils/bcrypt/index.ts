import * as bcryptjs from 'bcryptjs';

export const bcrypt = {
  hash: (value: string, saltRounds: number = 10): Promise<string> => {
    return new Promise((resolve, reject) => {
      bcryptjs.genSalt(saltRounds, (error, salt) => {
        if (error) return reject(error);

        bcryptjs.hash(value, salt, (error, hash) => {
          error ? reject(error) : resolve(hash);
        });
      });
    });
  },
  compare: (value: string, hash: string): Promise<boolean> => {
    return bcryptjs.compare(value, hash);
  },
};
