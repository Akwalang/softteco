import { toAlias } from './toAlias';

describe('toAlias', () => {
  it('should return alias from string', () => {
    expect(toAlias('Mock_text: //\\ 1234455')).toBe('mock_text-1234455');
  });
});
