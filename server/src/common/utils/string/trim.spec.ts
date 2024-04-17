import { trim } from './trim';

describe('trim', () => {
  it('should trim string', () => {
    expect(trim('   Mock  text     12   ')).toBe('Mock text 12');
  });
});
