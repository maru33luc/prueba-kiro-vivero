import * as fc from 'fast-check';

// Smoke test to verify Jest + fast-check are configured correctly
describe('fast-check setup', () => {
  it('should run property-based tests with fast-check', () => {
    // Feature: online-plant-nursery, setup verification
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a; // commutativity of addition
      }),
      { numRuns: 100 },
    );
  });

  it('should generate strings', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        return typeof s === 'string';
      }),
      { numRuns: 100 },
    );
  });
});
