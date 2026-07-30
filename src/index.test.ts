import { AUTHZ_VERSION } from '.';

describe('frontend-authz', () => {
  it('exports AUTHZ_VERSION', () => {
    expect(AUTHZ_VERSION).toBeDefined();
    expect(typeof AUTHZ_VERSION).toBe('string');
  });
});
