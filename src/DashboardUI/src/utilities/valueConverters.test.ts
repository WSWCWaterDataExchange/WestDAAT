import { convertSquareMetersToAcres } from './valueConverters';

describe('valueConverters', () => {
  describe('convertSquareMetersToAcres', () => {
    it('should convert square meters to acres', () => {
      // Arrange
      const squareMeters = 1000;
      const expectedAcres = 0.247105;

      // Act
      const actualAcres = convertSquareMetersToAcres(squareMeters);

      // Assert
      expect(actualAcres).toBeCloseTo(expectedAcres, 5);
    });
  });
});
