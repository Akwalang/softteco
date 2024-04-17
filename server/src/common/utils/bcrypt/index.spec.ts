import { bcrypt } from '.';

describe('bcrypt', () => {
  const password = 'mock_password';

  describe('hash', () => {
    it('calculate hash for the string', async () => {
      const saltRounds = 10;
      const result = await bcrypt.hash(password, saltRounds);

      const regExp = new RegExp(
        `^\\$2[ab]\\$${saltRounds}\\$.{${55 - (saltRounds + '').length}}$`,
      );

      expect(result).toMatch(regExp);
    });
  });

  describe('compare', () => {
    it('compare 2 hashes', async () => {
      const hash = '$2a$10$0Jzo2cRjcb7GOsWdIwXPeOio3iXcp/80XuGHSePQlh8vfIixU1ToK';
      const result = await bcrypt.compare(password, hash);

      expect(result).toBeTruthy();
    });
  });
});
